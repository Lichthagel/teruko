import type { JSX } from "solid-js/h/jsx-runtime";
import { Title } from "@solidjs/meta";
import { useNavigate, useParams } from "@solidjs/router";
import { createQuery, useClient } from "@urql/solid";
import styles from "client-css/m/imagepage.module.scss";
import { createImageNavigation } from "client-graphql/gallery";
import { Image } from "client-graphql/snippets";
import { Download } from "lucide-solid";
import { createMemo, createSignal, For, Match, onCleanup, onMount, Show, Switch } from "solid-js";
import TagChip from "~/components/TagChip";

export default () => {
  const params = useParams();
  const navigate = useNavigate();
  const client = useClient();
  const navigation = createImageNavigation(client, () => Number(params.id), id => navigate(`/${id}`, { scroll: false }));
  const [progress, setProgress] = createSignal(navigation.getSnapshot());
  const navigationState = createMemo(() => navigation.getState(progress()));
  onMount(() => {
    const unsubscribe = navigation.subscribe(() => setProgress(navigation.getSnapshot()));
    window.addEventListener("keydown", navigation.keydown);
    onCleanup(() => {
      window.removeEventListener("keydown", navigation.keydown);
      unsubscribe();
      navigation.dispose();
    });
  });

  const [result] = createQuery({
    query: Image,
    variables: {
      get id() { return Number.parseInt(params.id!); },
    },
  });

  const image = createMemo(() => result.data?.image);
  const fileExt = createMemo(() => image()?.filename.split(".").pop());

  const scroll: JSX.EventHandler<HTMLImageElement, Event> = (e) => {
    (e.target as HTMLElement).scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <>
      <Show when={image()?.title}>
        <Title>
          {`${image()?.title} - `}
          てる子
        </Title>
      </Show>

      <div class={styles.viewer} data-image-id={image()?.id} aria-busy={navigationState().loading}>
        <button type="button" aria-label="Previous image" data-direction="previous" disabled={!navigationState().canPrevious} onClick={() => void navigation.previous()}>&lt;</button>
        <button type="button" aria-label="Next image" data-direction="next" disabled={!navigationState().canNext} onClick={() => void navigation.next()}>
          <Show when={image()}>
            {image => (
              <img alt={image().title ?? image().filename} class={styles.image} height={image().height} onLoad={scroll} src={`/img/${image().filename}`} width={image().width} />
            )}
          </Show>
        </button>
        <button type="button" aria-label="Next image" data-direction="next" disabled={!navigationState().canNext} onClick={() => void navigation.next()}>&gt;</button>
        <span role="status">{navigationState().error}</span>
      </div>
      <Switch>
        <Match when={image()}>
          {image => (
            <div>

              <div class="container">
                <div class={styles["meta-container"]}>
                  <div class={styles["meta-title"]}>
                    <h1>
                      {image()?.title || "No title"}
                    </h1>

                    <span>
                      Source:
                      <a
                        href={image().source ?? undefined}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {image().source}
                      </a>
                    </span>
                  </div>

                  <div class={styles["meta-rest"]}>
                    <div class={styles["meta-dates"]}>
                      <div>
                        <span>Created At: </span>
                        {image().createdAt.toLocaleString()}
                      </div>
                      <div>
                        <span>Updated At: </span>
                        {image().updatedAt.toLocaleString()}
                      </div>
                    </div>

                    <a class={styles["meta-dlicon"]} href={`/${image().id}/original`} target="_blank">
                      <Download class={styles.icon} />
                      <span>
                        {fileExt()}
                      </span>
                    </a>

                    <Show when={!!fileExt() && fileExt() !== "avif"}>
                      <a class={styles["meta-dlicon"]} href={`/${image().id}/avif`} target="_blank">
                        <Download class={styles.icon} />
                        <span>
                          avif
                        </span>
                      </a>
                    </Show>

                    <a class={styles["meta-dlicon"]} href={`/${image().id}/webp`} target="_blank">
                      <Download class={styles.icon} />
                      <span>
                        webp
                      </span>
                    </a>
                  </div>
                </div>

                <div class={styles.tags}>
                  <For each={image().tags}>
                    {tag => (
                      <TagChip tag={tag} />
                    )}
                  </For>
                </div>
              </div>
            </div>
          )}
        </Match>
      </Switch>
    </>
  );
};
