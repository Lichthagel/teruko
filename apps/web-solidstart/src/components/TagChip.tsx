import type { TagExt } from "models";
import type { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";
import styles from "client-css/m/imagepage.module.scss";
import { setTags } from "~/utils/filters";

const TagChip: Component<{ tag: TagExt }> = (props) => {
  const navigate = useNavigate();

  const onClick = () => {
    setTags([props.tag.slug]);
    navigate("/");
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
