import type { Component } from "solid-js";
import { createEffect, createResource, Match, onCleanup, Switch } from "solid-js";
import { graphqlRequest, IMAGE_BY_FILENAME, TERUKO_BASE_URL } from "../constants";

const Existing: Component<{ filename: string }> = (props) => {
  const [existingId, { refetch }] = createResource(
    () => props.filename,
    async (filename) => {
      const token = GM_getValue<string>("teruko_token", "");
      if (!token)
        return undefined;
      const result = await graphqlRequest<{ imageByFilename: { id: string } | null }>(IMAGE_BY_FILENAME, { filename });
      if (result.errors?.length)
        throw new Error(result.errors[0]?.message ?? "GraphQL request failed");
      return result.data?.imageByFilename?.id;
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
