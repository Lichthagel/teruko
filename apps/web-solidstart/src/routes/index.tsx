import { clientOnly } from "@solidjs/start";
import { Filters } from "~/components/filters/Filters";
import { sort, tags } from "~/utils/filters";

const Gallery = clientOnly(() => import("../components/gallery/Gallery"));

export default function Home() {
  return (
    <div class="container">
      <Filters />

      <Gallery tags={tags()} sort={sort()} />
    </div>
  );
}
