import { type ImageSort } from "models";
import { atom } from "nanostores";

export const tagsStore = atom<string[]>([]);
export const sortStore = atom<ImageSort | null>(null);
