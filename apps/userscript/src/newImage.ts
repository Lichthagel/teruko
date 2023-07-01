/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { urqlClient } from "client-common";
import { CombinedError, gql } from "@urql/core";

const NEW_IMAGE = gql`
  mutation ($files: [Upload!]!) {
    createImage(files: $files) {
      id
    }
  }
`;

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

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
          url: "http://192.168.1.178:3030/graphql",
          fetchOptions: {
            headers: {
              "Apollo-Require-Preflight": "true",
            },
          },
        }
      )
      .toPromise();

    window.removeEventListener("beforeunload", beforeUnload);
    if (result.data) {
      if (open)
        window.open(
          `http://192.168.1.178:3000/${
            result.data.createImage[0].id as string
          }`,
          "_blank"
        );
      else
        target.textContent = `id: ${result.data.createImage[0].id as string}`;
      // alert(`uploaded (id: ${result.data.createImage[0].id})`);
    } else {
      target.classList.add("terukoButtonSmall");
      target.textContent = result.toString();
      // alert(`error: ${result}`);
    }
  } catch (error) {
    window.removeEventListener("beforeunload", beforeUnload);
    target.classList.add("terukoButtonSmall");
    target.textContent = (error as CombinedError).message;
  }
}

export default newImage;
