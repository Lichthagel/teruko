import type { ImageSort } from "models";
import { createSignal } from "solid-js";

export const [tags, setTags] = createSignal<string[]>([]);
export const [sort, setSort] = createSignal<ImageSort>("NEWEST");
