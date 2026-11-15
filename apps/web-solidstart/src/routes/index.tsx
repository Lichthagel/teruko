import { clientOnly } from "@solidjs/start";
import { Show } from "solid-js";
import { Filters } from "~/components/filters/Filters";
import ScrollButtons from "~/components/ScrollButtons";
import { sort, tags } from "~/utils/filters";

const Gallery = clientOnly(() => import("../components/gallery/Gallery"));

export default function Home() {
  return (
    <>
      <div class="container">
        <Filters />

        <Show
          when={{
            sort: sort(),
            tags: tags(),
          }}
          keyed
        >
          {filters => <Gallery tags={filters.tags} sort={filters.sort} />}
        </Show>
      </div>

      <ScrollButtons />
    </>
  );
}
