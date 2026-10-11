import type { Component } from "solid-js";
import { getPixivMetadata } from "services/pixiv";
import { createEffect, createMemo, createSignal, on } from "solid-js";
import { CREATE_IMAGE, TERUKO_BASE_URL } from "../constants.js";
import { clearToken, requireToken } from "../token.js";
import { GMfetch } from "../utils.js";

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
  const filename = createMemo(() => props.url?.split("/").at(-1));

  const uploadImage = async (open = false) => {
    if (!props.url) {
      return;
    }

    window.addEventListener("beforeunload", beforeUnload);

    try {
      const id = filename()?.split("_p")[0];

      setText("fetching metadata...");

      const meta = id ? await getPixivMetadata(id) : null;

      setText("down...");

      const res = await fetch(props.url, { headers: { Referer: location.origin } });

      const blob = await res.blob();

      const file = new File([blob], filename() ?? "image.png", {
        type: blob.type,
      });

      const token = requireToken();

      setText("up...");
      const formData = new FormData();
      formData.append("operations", JSON.stringify({
        query: CREATE_IMAGE,
        variables: {
          files: [null],
          title: meta?.title,
          source: meta?.source,
          tags: meta?.tags?.map(tag => tag.slug),
        },
      }));
      formData.append("map", JSON.stringify({ 0: ["variables.files.0"] }));
      formData.append("0", file);
      const result = await GMfetch(`${TERUKO_BASE_URL}/graphql`, {
        method: "POST",
        data: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (result.status === 401) {
        clearToken();
        throw new Error("Teruko rejected your token. Click again to enter a new token.");
      }
      const response = JSON.parse(result.responseText) as {
        data: { createImage: { id: string }[] } | null;
        errors?: { message: string }[];
      };

      window.removeEventListener("beforeunload", beforeUnload);
      if (response.errors?.length) {
        setSmall(true);
        setText(response.errors?.[0]?.message ?? JSON.stringify(response));
        // alert(`error: ${result}`);
      } else if (response.data) {
        if (open) {
          window.open(`${TERUKO_BASE_URL}/${response.data.createImage[0]?.id as string}`, "_blank");
        } else {
          setText(`id: ${response.data.createImage[0]?.id as string}`);
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

  createEffect(on(() => props.url, () => {
    setText("teruko");
    setSmall(false);
  }));

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
