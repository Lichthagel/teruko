import type { ImageExt } from "models";
import type { JSX } from "solid-js/h/jsx-runtime";
import { Title } from "@solidjs/meta";
import { useParams } from "@solidjs/router";
import { createQuery, gql } from "@urql/solid";
import styles from "client-css/m/imagepage.module.scss";
import { Download } from "lucide-solid";
import { createMemo, For, Match, Show, Switch } from "solid-js";
import TagChip from "~/components/TagChip";

export default () => {
  const { id } = useParams();

  const [result] = createQuery<{ image: ImageExt | null }>({
    query: gql`
      query Image($id: ID!) {
        image(id: $id) {
          id
          title
          source
          filename
          createdAt
          updatedAt
          width
          height
          tags {
            slug
            category {
              color
            }
          }
        }
      }
    `,
    variables: { id },
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

      <Switch>
        <Match when={image()}>
          {image => (
            <div>
              <img
                alt={image().title ?? image().filename}
                class={styles.image}
                height={image().height}
                onLoad={scroll}
                src={`/img/${image().filename}`}
                width={image().width}
              />

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

                    <a class={styles["meta-dlicon"]} href={`/${image().id}/original`}>
                      <Download class={styles.icon} />
                      <span>
                        {fileExt()}
                      </span>
                    </a>

                    <Show when={!!fileExt() && fileExt() !== "avif"}>
                      <a class={styles["meta-dlicon"]} href={`/${image().id}/avif`}>
                        <Download class={styles.icon} />
                        <span>
                          avif
                        </span>
                      </a>
                    </Show>

                    <a class={styles["meta-dlicon"]} href={`/${image().id}/webp`}>
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
