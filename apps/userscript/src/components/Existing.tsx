import type { Component } from "solid-js";
import { createEffect, createResource, Match, onCleanup, Switch } from "solid-js";
import { IMAGE_BY_FILENAME, TERUKO_BASE_URL } from "../constants";
import { clearToken, getToken } from "../token.js";
import { GMgraphql } from "../utils.js";

const Existing: Component<{ filename: string }> = (props) => {
  const [existingId, { refetch }] = createResource(
    () => props.filename,
    async (filename) => {
      const token = getToken();
      if (!token)
        return undefined;
      const { res, response } = await GMgraphql<{ imageByFilename: { id: string } | null }>(
        JSON.stringify({
          query: IMAGE_BY_FILENAME,
          variables: { filename },
        }),
        token,
      );

      if (res.status === 401) {
        clearToken();
        return undefined;
      }

      return response.data?.imageByFilename?.id;
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
