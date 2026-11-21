import type { VirtualItem } from "@tanstack/virtual-core";
import type { ImageSort } from "models";
import type { ImagesResult } from "./snippets/index.js";

type Edges = ImagesResult["images"]["edges"];
type GalleryState = {
  key: string;
  edges: Edges;
  hasNextPage: boolean;
  offset: number;
  measurements: VirtualItem[];
  width: number;
  anchor?: { id: number; index: number; top: number };
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
      edges: [],
      hasNextPage: true,
      offset: 0,
      measurements: [],
      width: 0,
    };
  }
  return saved;
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
  const anchor = previousWidth && previousWidth !== element.clientWidth
    ? state.anchor
    : undefined;
  if (anchor) {
    const index = state.edges.findIndex(edge => edge.node.id === anchor.id);
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
      scroll();
    }
  };
  const interrupt = () => {
    cancelAnimationFrame(frame);
    restoring = false;
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
