import type { Component, JSX } from "solid-js";
import { createQuery } from "@urql/solid";
import styles from "client-css/m/filters.module.scss";
import { Tag } from "client-graphql/snippets";
import { BadgeCheck, Pencil, X } from "lucide-solid";
import { createSignal, Show } from "solid-js";
import { setTags } from "~/utils/filters";
import { StatusBar } from "../status/StatusBar";
import TagDialog from "../tag/TagDialog";

export const TagQuery: Component<{ tag: string }> = (props) => {
  const [dialogOpen, setDialogOpen] = createSignal(false);

  const [result] = createQuery({
    query: Tag,
    variables: () => ({ slug: props.tag }),
  });

  const removeTag: JSX.EventHandlerUnion<HTMLButtonElement, Event> = (event) => {
    event.preventDefault();
    // eslint-disable-next-line solid/reactivity
    setTags(prev => prev.filter(t => t !== props.tag));
  };

  return (
    <>
      <div
        class={styles["tag-query"]}
        style:background-color={result.data?.tag.category?.color}
      >
        <span>{props.tag}</span>
        <Show when={result.data?.tag.approved}>
          <BadgeCheck size={16} />
        </Show>
        <button
          onClick={(e) => {
            e.preventDefault();
            setDialogOpen(true);
          }}
          type="button"
        >
          <Pencil />
        </button>
        <button
          onClick={removeTag}
          type="button"
        >
          <X />
        </button>
      </div>

      <TagDialog open={dialogOpen()} setOpen={setDialogOpen} slug={props.tag} />

      <StatusBar error={!!result.error} fetching={result.fetching} />
    </>
  );
};
