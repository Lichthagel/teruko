import { customElement } from "solid-element";
import { Component, createSignal } from "solid-js";

import { CREATE_IMAGE, TERUKO_BASE_URL } from "./constants.js";
import styles from "./style.css?inline";

type Props = {
  url: string | null;
};

const beforeUnload = (event: BeforeUnloadEvent) => {
  event.preventDefault();
  event.returnValue = true;
  return "Still uploading";
};

const DownloadButton: Component<Props> = (props) => {
  const [text, setText] = createSignal("teruko");
  const [small, setSmall] = createSignal(false);

  const uploadImage = async (open = false) => {
    if (!props.url) {
      return;
    }

    window.addEventListener("beforeunload", beforeUnload);

    setText("down...");

    try {
      const res = await fetch(props.url, { headers: { Referer: location.origin } });

      const blob = await res.blob();

      const file = new File([blob], props.url.split("/").at(-1) ?? "image.png", {
        type: blob.type,
      });

      setText("up...");

      const formData = new FormData();
      formData.append("operations", JSON.stringify({
        query: CREATE_IMAGE,
        variables: {
          files: [null],
        },
      }));
      formData.append("map", JSON.stringify({
        0: ["variables.files.0"],
      }));
      formData.append("0", file);

      const result = await fetch(`${TERUKO_BASE_URL}/graphql`, {
        method: "POST",
        body: formData,
        headers: {
          "Apollo-Require-Preflight": "true",
        },
      })
        .then((res) => res.json() as Promise<{
          data: {
            createImage: { id: string }[];
          } | null;
          errors?: {
            message: string;
          }[];
        }>);

      window.removeEventListener("beforeunload", beforeUnload);
      if (result.errors) {
        setSmall(true);
        setText(result.errors?.[0]?.message ?? JSON.stringify(result));
        // alert(`error: ${result}`);
      } else if (result.data) {
        if (open) {
          window.open(
            `${TERUKO_BASE_URL}/${result.data.createImage[0]?.id as string}`,
            "_blank",
          );
        } else {
          setText(`id: ${result.data.createImage[0]?.id as string}`);
        }
        // alert(`uploaded (id: ${result.data.createImage[0].id})`);
      } else {
        setSmall(true);
        setText("no data");
        // alert("no data");
      }
    } catch (error) {
      window.removeEventListener("beforeunload", beforeUnload);
      setSmall(true);
      setText(String(error));
    }
  };

  return (
    <button
      class="button"
      classList={{ small: small() }}
      on:click={(event) => {
        event.stopPropagation();
        event.preventDefault();

        void uploadImage(event.shiftKey);
      }}
      type="button"
    >
      {text()}
    </button>
  );
};

export default DownloadButton;

export const defineDownloadButton = () => {
  customElement<Props>("teruko-download-button", {
    url: null,
  }, (props) => (
    <>
      <style>{styles}</style>
      <DownloadButton {...props} />
    </>
  ));
};

export type DownloadButtonElement = HTMLElement & Props;

declare global {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface HTMLElementTagNameMap {
    "teruko-download-button": DownloadButtonElement;
  }
}
