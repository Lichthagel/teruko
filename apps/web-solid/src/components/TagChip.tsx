import type { Tag, TagCategory } from "models";
import type { Component } from "solid-js";
import { useNavigate } from "@solidjs/router";
import styles from "client-css/m/imagepage.module.scss";
import { setTags } from "../utils/filters";
// import { BadgeCheck } from "lucide-solid";

const TagChip: Component<{
  tag: Pick<Tag, "slug" | "approved"> & { category?: Pick<TagCategory, "color"> | null };
}> = (props) => {
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
      <span>{props.tag.slug}</span>
      {/* {props.tag.approved && <BadgeCheck size={16} />} */}
    </button>
  );
};

export default TagChip;
