import type { Component } from "solid-js";
import { customElement } from "solid-element";
import { createMemo, Show } from "solid-js";
import styles from "../style.css?inline";
import DownloadButton from "./DownloadButton";
import Existing from "./Existing";

type Props = {
  url: string | null;
};

const Actions: Component<Props> = (props) => {
  const filename = createMemo(() => props.url?.split("/").at(-1));

  return (
    <div class="actions">
      <Show when={filename()}>
        <Existing filename={filename()!} />
      </Show>
      <DownloadButton url={props.url} />
    </div>
  );
};

export const defineActions = () => {
  customElement<Props>("teruko-actions", {
    url: null,
  }, props => (
    <>
      <style>{styles}</style>
      <Actions {...props} />
    </>
  ));
};

export type ActionsElement = HTMLElement & Props;

declare global {
  // eslint-disable-next-line ts/consistent-type-definitions
  interface HTMLElementTagNameMap {
    "teruko-actions": ActionsElement;
  }
}
