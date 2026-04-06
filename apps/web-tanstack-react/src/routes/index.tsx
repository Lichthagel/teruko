import { Filters } from "#/components/filters/Filters";
import Gallery from "#/components/gallery/Gallery";
import ScrollButtons from "#/components/ScrollButtons";
import { useFilters } from "#/stores/filters";
import { createFileRoute } from "@tanstack/react-router";

const App = () => {
  const { tags, sort } = useFilters();
  return (
    <>
      <div className="container">
        <Filters />

        <Gallery tags={tags} sort={sort} />
      </div>
      <ScrollButtons />
    </>
  );
};

export const Route = createFileRoute("/")({ component: App });
