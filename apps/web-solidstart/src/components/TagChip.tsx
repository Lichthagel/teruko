import type { TagExt } from "models";
import type { Component } from "solid-js";
import styles from "client-css/m/imagepage.module.scss";

const TagChip: Component<{ tag: TagExt }> = (props) => {
  const onClick = () => {
    // tagsStore.set([tag.slug]);
    // void goto(resolve("/", {}));
  };

  return (
    <button
      class={styles["tag-chip"]}
      onClick={onClick}
      style={props.tag.category?.color ? `background-color: ${props.tag.category?.color}` : undefined}
      type="button"
    >
      {props.tag.slug}
    </button>
  );
};

export default TagChip;
