import type { Component, JSX } from "solid-js";
import { createQuery } from "@urql/solid";
import styles from "client-css/m/filters.module.scss";
import { Tag } from "client-graphql/snippets";
import { X } from "lucide-solid";
import { setTags } from "~/utils/filters";
import { StatusBar } from "../status/StatusBar";

export const TagQuery: Component<{ tag: string }> = (props) => {
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
        <button
          onClick={removeTag}
          type="button"
        >
          <X />
        </button>
      </div>

      <StatusBar error={!!result.error} fetching={result.fetching} />
    </>
  );
};
