import styles from "client-css/m/filters.module.scss";
import { ListX, Search } from "lucide-solid";
import { For, Show } from "solid-js";
import { setTags, tags } from "~/utils/filters";
import TagInput from "../common/TagInput";
import { SortSelect } from "./SortSelect";
import { TagQuery } from "./TagQuery";

export const Filters = () => {
  const resetTags = (event: Event) => {
    event.preventDefault();
    setTags([]);
  };

  return (
    <div class={styles.main}>
      <Show when={tags().length}>
        <div class={styles["tag-container"]}>
          <For each={tags()}>
            {tag => (<TagQuery tag={tag} />)}
          </For>
          <div class={`${styles["tag-query"]} ${styles.reset}`}>
            <button onClick={resetTags}>
              <ListX />
            </button>
          </div>
        </div>
      </Show>

      <TagInput
        icon={Search}
        onSubmit={v => setTags(old => [...old, v])}
        onEscape={() => setTags([])}
      />

      <SortSelect />
    </div>
  );
};
