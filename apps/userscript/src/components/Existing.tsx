import type { Component } from "solid-js";
import { createEffect, createResource, Match, onCleanup, Switch } from "solid-js";
import { IMAGE_BY_FILENAME, TERUKO_BASE_URL, TERUKO_BASIC_AUTH } from "../constants";
import { GMfetch } from "../utils";

const Existing: Component<{ filename: string }> = (props) => {
  const [existingId, { refetch }] = createResource(
    () => props.filename,
    async (filename) => {
      const res = await GMfetch(`${TERUKO_BASE_URL}/graphql`, {
        method: "POST",
        data: JSON.stringify(
          {
            query: IMAGE_BY_FILENAME,
            variables: { filename },
          },
        ),
        headers: {
          "Content-Type": "application/json",
          "Apollo-Require-Preflight": "true",
          ...(TERUKO_BASIC_AUTH ? { Authorization: `Basic ${TERUKO_BASIC_AUTH}` } : {}),
        },
      });

      const json = JSON.parse(res.responseText);

      return (json.data.imageByFilename as { id: string } | null)?.id;
    },
  );

  createEffect(() => {
    if ((!existingId.loading && !existingId()) || existingId.error) {
      const timeout = setTimeout(refetch, 5000);

      onCleanup(() => {
        clearTimeout(timeout);
      });
    }
  });

  return (
    <div>
      <Switch fallback="missing">
        <Match when={existingId.error}>
          Error:
          {" "}
          {existingId.error}
        </Match>
        <Match when={existingId.loading}>
          ...
        </Match>
        <Match when={existingId()}>
          <a
            href={`${TERUKO_BASE_URL}/${existingId()}`}
            target="_blank"
            on:click={(e) => {
              e.stopPropagation();
            }}
          >
            {existingId()}
          </a>
        </Match>
      </Switch>
    </div>
  );
};

export default Existing;
