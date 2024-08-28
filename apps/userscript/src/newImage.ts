/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { CombinedError, gql } from "@urql/core";
import { urqlClient } from "client-common";

const NEW_IMAGE = gql`
  mutation ($files: [Upload!]!) {
    createImage(files: $files) {
      id
    }
  }
`;
const TERUKO_BASE = "https://desktop.licht.moe:3030";

const beforeUnload = (event: BeforeUnloadEvent) => {
  event.preventDefault();
  event.returnValue = "";
  return "Still uploading";
};

async function newImage(url: string, open: boolean, target: HTMLDivElement) {
  window.addEventListener("beforeunload", beforeUnload);

  target.textContent = "down...";

  try {
    const res = await fetch(url, {
      headers: {
        Referer: "https://www.pixiv.net/",
      },
    });

    const blob = await res.blob();

    const file = new File([blob], url.split("/").at(-1)!, {
      type: blob.type,
    });

    target.textContent = "up...";

    const result = await urqlClient
      .mutation(
        NEW_IMAGE,
        {
          files: [file],
        },
        {
          url: `${TERUKO_BASE}/graphql`,
          fetchOptions: {
            headers: {
              "Apollo-Require-Preflight": "true",
            },
          },
        },
      )
      .toPromise();

    window.removeEventListener("beforeunload", beforeUnload);
    if (result.data) {
      if (open) {
        window.open(
          `${TERUKO_BASE}/${result.data.createImage[0].id as string}`,
          "_blank",
        );
      } else {
        target.textContent = `id: ${result.data.createImage[0].id as string}`;
      }
      // alert(`uploaded (id: ${result.data.createImage[0].id})`);
    } else {
      target.classList.add("terukoButtonSmall");
      target.textContent = result.error ?
        result.error.message :
        JSON.stringify(result);
      // alert(`error: ${result}`);
    }
  } catch (error) {
    window.removeEventListener("beforeunload", beforeUnload);
    target.classList.add("terukoButtonSmall");
    target.textContent = (error as CombinedError).message;
  }
}

export default newImage;
