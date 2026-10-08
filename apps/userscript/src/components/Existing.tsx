import type { Component } from "solid-js";
import { createEffect, createResource, Match, onCleanup, Switch } from "solid-js";
import { createUrqlClient, IMAGE_BY_FILENAME, TERUKO_BASE_URL } from "../constants";

const Existing: Component<{ filename: string }> = (props) => {
  const [existingId, { refetch }] = createResource(
    () => props.filename,
    async (filename) => {
      const token = GM_getValue<string>("teruko_token", "");
      if (!token)
        return undefined;
      const client = createUrqlClient(`${TERUKO_BASE_URL}/graphql`);
      const result = await client.query(IMAGE_BY_FILENAME, { filename }).toPromise();
      return (result.data?.imageByFilename as { id: string } | null)?.id;
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
