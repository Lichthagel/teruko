import { ImageSort } from "models";
import { atom } from "nanostores";

export const tags = atom<string[]>([]);
export const sort = atom<ImageSort | null>(null);
