import type { VirtualItem } from "@tanstack/virtual-core";
import type { Client } from "@urql/core";
import type { ImageSort } from "models";
import type { ImagesResult } from "./snippets/index.js";
import { Images } from "./snippets/index.js";

type Edges = ImagesResult["images"]["edges"];
type GalleryState = {
  key: string;
  tags: readonly string[];
  sort: ImageSort;
  edges: Edges;
  hasNextPage: boolean;
  offset: number;
  measurements: VirtualItem[];
  width: number;
  anchor?: { id: number; index: number; top: number };
  returnTo?: number;
  layout?: ReturnType<typeof galleryLayout>;
};

// Browser-only, single active filter set: never share user data between SSR requests.
let saved: GalleryState | undefined;
export const galleryState = (tags: readonly string[], sort: ImageSort): GalleryState => {
  const key = JSON.stringify([
    sort,
    [...tags].sort(),
  ]);
  if (typeof window === "undefined") {
    return {
      key,
      tags,
      sort,
      edges: [],
      hasNextPage: true,
      offset: 0,
      measurements: [],
      width: 0,
    };
  }
  if (saved?.key !== key) {
    saved = {
      key,
      tags,
      sort,
      edges: [],
      hasNextPage: true,
      offset: 0,
      measurements: [],
      width: 0,
    };
  }
  return saved;
};

export type ImageNavigationSnapshot = { loading: boolean; error: string };

// Reuse the gallery's merged pages; image entities and query results remain in urql.
export const createImageNavigation = (
  client: Client,
  getId: () => number,
  navigate: (id: number) => unknown,
) => {
  const state = typeof window === "undefined"
    ? undefined
    : saved;
  let disposed = false;
  let generation = 0;
  let snapshot: ImageNavigationSnapshot = { loading: false, error: "" };
  const listeners = new Set<() => void>();
  // GraphQL serializes ID scalars as strings, unlike the numeric database model.
  const index = () => state?.edges.findIndex(edge => Number(edge.node.id) === getId()) ?? -1;
  const publish = (value: ImageNavigationSnapshot) => {
    snapshot = value;
    for (const listener of listeners)
      listener();
  };
  const getState = (progress = snapshot) => {
    const position = index();
    return {
      ...progress,
      canPrevious: !progress.loading && position > 0,
      canNext: !progress.loading && position >= 0 && (position < state!.edges.length - 1 || state!.hasNextPage),
    };
  };
  const move = async (direction: "previous" | "next") => {
    const position = index();
    if (!state || disposed || snapshot.loading || position < 0)
      return;
    const target = position + (direction === "previous"
      ? -1
      : 1);
    if (target < 0 || (target >= state.edges.length && !state.hasNextPage))
      return;
    publish({ loading: true, error: "" });
    const currentId = getId();
    const requestGeneration = generation;
    const active = () => !disposed && generation === requestGeneration;
    try {
      if (target >= state.edges.length) {
        const oldest = state.sort === "OLDEST";
        const cursor = state.edges.at(-1)?.cursor;
        // A random sample may contain only seen IDs; retrying must get a fresh sample.
        const result = await client.query(Images, {
          tags: state.tags,
          after: oldest ? null : cursor,
          before: oldest ? cursor : null,
          first: oldest ? null : 20,
          last: oldest ? 20 : null,
          random: state.sort === "RANDOM",
        }, {
          requestPolicy: state.sort === "RANDOM"
            ? "network-only"
            : "cache-first",
        }).toPromise();
        if (!active() || saved !== state || currentId !== getId())
          return;
        if (result.error)
          throw result.error;
        if (!result.data)
          throw new Error("Unable to load the next image.");
        const { edges, pageInfo } = result.data.images;
        const ids = new Set(state.edges.map(edge => Number(edge.node.id)));
        state.edges = [
          ...state.edges,
          ...edges.filter(edge => !ids.has(Number(edge.node.id))),
        ];
        state.hasNextPage = oldest ? pageInfo.hasPreviousPage : pageInfo.hasNextPage;
        if (target >= state.edges.length && state.hasNextPage)
          throw new Error("No new images returned. Try again.");
      }
      const image = state.edges[target]?.node;
      if (active() && currentId === getId() && image) {
        const previousReturnTo = state.returnTo;
        state.returnTo = Number(image.id);
        try {
          await navigate(Number(image.id));
        } catch (error) {
          state.returnTo = previousReturnTo;
          throw error;
        }
      }
    } catch {
      if (active())
        publish({ loading: false, error: "Unable to load the image. Please try again." });
    } finally {
      if (active())
        publish({ ...snapshot, loading: false });
    }
  };
  return {
    getState,
    getSnapshot: () => snapshot,
    subscribe: (listener: () => void) => {
      disposed = false;
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    previous: () => move("previous"),
    next: () => move("next"),
    keydown: (event: KeyboardEvent) => {
      if (event.defaultPrevented || event.repeat || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey)
        return;
      // Inspect only the event path, including editable ancestors and shadow hosts.
      if (event.composedPath().some(target => target instanceof HTMLElement
        && (["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName) || target.isContentEditable || target.getAttribute("role") === "textbox"))) {
        return;
      }
      const direction = event.key === "ArrowLeft"
        ? "previous"
        : event.key === "ArrowRight"
          ? "next"
          : undefined;
      if (!direction || index() < 0)
        return;
      event.preventDefault();
      void move(direction);
    },
    dispose: () => {
      disposed = true;
      generation++;
      snapshot = { loading: false, error: "" };
      listeners.clear();
    },
  };
};

export const galleryLayout = (element: HTMLElement) => ({
  columns: Number.parseInt(getComputedStyle(element).getPropertyValue("--gallery-columns")) || 1,
  width: element.clientWidth,
  margin: element.getBoundingClientRect().top + window.scrollY,
  gap: Number.parseFloat(getComputedStyle(element).columnGap) || 4,
});

export const estimateCard = (image: Edges[number]["node"] | undefined, width: number) =>
  image?.width && image.height
    ? width * image.height / image.width + (image.tags?.some(tag => !tag.slug.startsWith("artist_"))
      ? 28
      : 4)
    : 400;

export const initialGalleryLayout = (state?: GalleryState) => state?.layout ?? ({
  columns: 1,
  width: 0,
  margin: 0,
  gap: 4,
});

export const virtualGalleryOptions = (images: Edges[number]["node"][], state: GalleryState, layout: ReturnType<typeof galleryLayout>) => ({
  count: images.length,
  enabled: layout.width > 0,
  lanes: layout.columns,
  gap: layout.gap,
  overscan: 3,
  scrollMargin: layout.margin,
  initialOffset: state.offset,
  initialMeasurementsCache: layout.width === 0 || state.width === layout.width
    ? state.measurements
    : [],
  getItemKey: (index: number) => images[index]!.id,
  estimateSize: (index: number) => estimateCard(images[index], (layout.width - layout.gap * (layout.columns - 1)) / layout.columns),
});

export const virtualCardStyle = (item: VirtualItem, layout: ReturnType<typeof galleryLayout>) => ({
  width: `${(layout.width - layout.gap * (layout.columns - 1)) / layout.columns}px`,
  transform: `translate(${item.lane * (layout.width + layout.gap) / layout.columns}px, ${item.start - layout.margin}px)`,
});

export const watchGallery = (
  element: HTMLElement,
  state: GalleryState,
  update: (layout: ReturnType<typeof galleryLayout>) => void,
  snapshot: () => VirtualItem[],
  jumpToIndex?: (index: number) => void,
) => {
  const previousWidth = state.width;
  let previous = "";
  const resize = () => {
    const layout = galleryLayout(element);
    const key = JSON.stringify(layout);
    if (key !== previous) {
      previous = key;
      state.layout = layout;
      update(layout);
    }
  };
  const observer = new ResizeObserver(resize);
  observer.observe(element);
  resize();
  let restoring = true;
  const scroll = () => {
    if (restoring)
      return;
    state.offset = window.scrollY;
    const cards = [
      ...element.querySelectorAll<HTMLElement>("[data-index]"),
    ];
    const anchor = cards.find(card => card.getBoundingClientRect().bottom > 0);
    if (anchor) {
      const index = Number(anchor.dataset.index);
      const image = state.edges[index]?.node;
      if (!image)
        return;
      state.anchor = {
        id: image.id,
        index,
        top: anchor.getBoundingClientRect().top,
      };
    }
  };
  window.addEventListener("scroll", scroll, { passive: true });
  // Routers and dynamic measurements can both adjust scroll after the first paint.
  const offset = state.offset;
  const returnIndex = state.returnTo === undefined
    ? -1
    : state.edges.findIndex(edge => Number(edge.node.id) === state.returnTo);
  const anchor = returnIndex >= 0
    ? { id: state.returnTo!, index: returnIndex, top: 16 }
    : previousWidth && previousWidth !== element.clientWidth
      ? state.anchor
      : undefined;
  if (anchor) {
    const index = state.edges.findIndex(edge => Number(edge.node.id) === Number(anchor.id));
    if (index >= 0)
      anchor.index = index;
  }
  let remaining = 10;
  let frame = 0;
  let jumped = false;
  const restore = () => {
    if (anchor && !jumped) {
      jumped = true;
      jumpToIndex?.(anchor.index);
      frame = requestAnimationFrame(restore);
      return;
    }
    const card = anchor && element.querySelector<HTMLElement>(`[data-index="${anchor.index}"]`);
    const top = card
      ? window.scrollY + card.getBoundingClientRect().top - anchor!.top
      : offset;
    window.scrollTo({ top, behavior: "instant" });
    if (--remaining > 0) {
      frame = requestAnimationFrame(restore);
    } else {
      restoring = false;
      state.returnTo = undefined;
      scroll();
    }
  };
  const interrupt = () => {
    cancelAnimationFrame(frame);
    restoring = false;
    state.returnTo = undefined;
    scroll();
  };
  window.addEventListener("wheel", interrupt, { passive: true });
  window.addEventListener("touchstart", interrupt, { passive: true });
  window.addEventListener("keydown", interrupt);
  element.addEventListener("pointerdown", interrupt);
  frame = requestAnimationFrame(restore);
  return () => {
    cancelAnimationFrame(frame);
    observer.disconnect();
    window.removeEventListener("scroll", scroll);
    window.removeEventListener("wheel", interrupt);
    window.removeEventListener("touchstart", interrupt);
    window.removeEventListener("keydown", interrupt);
    element.removeEventListener("pointerdown", interrupt);
    state.measurements = snapshot();
    state.width = state.layout?.width ?? element.clientWidth;
  };
};
