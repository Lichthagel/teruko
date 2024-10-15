const NEW_IMAGE = `
  mutation ($files: [Upload!]!) {
    createImage(files: $files) {
      id
    }
  }
`;

const TERUKO_BASE_URL = import.meta.env.VITE_TERUKO_BASE_URL as string;

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

    const formData = new FormData();
    formData.append("operations", JSON.stringify({
      query: NEW_IMAGE,
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
    if (result.data) {
      if (open) {
        window.open(
          `${TERUKO_BASE_URL}/${result.data.createImage[0]?.id as string}`,
          "_blank",
        );
      } else {
        target.textContent = `id: ${result.data.createImage[0]?.id as string}`;
      }
      // alert(`uploaded (id: ${result.data.createImage[0].id})`);
    } else {
      target.classList.add("terukoButtonSmall");
      target.textContent = result.errors?.[0]?.message ?? JSON.stringify(result);
      // alert(`error: ${result}`);
    }
  } catch (error) {
    window.removeEventListener("beforeunload", beforeUnload);
    target.classList.add("terukoButtonSmall");
    target.textContent = String(error);
  }
}

export default newImage;
