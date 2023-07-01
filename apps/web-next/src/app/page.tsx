import Gallery from "@/components/Gallery";
import ScrollButtons from "@/components/ScrollButtons";
import { zImageSort } from "models";
import type { ReactElement } from "react";

const Home = ({
  searchParams,
}: {
  params: { slug: string };
  searchParams: Record<string, string | string[] | undefined>;
}): ReactElement => {
  const tags = ((): string[] => {
    if (Array.isArray(searchParams.tag)) {
      return searchParams.tag;
    } else if (typeof searchParams.tag === "string") {
      return [searchParams.tag];
    } else {
      return [];
    }
  })();

  const sort = zImageSort.optional().parse(searchParams.sort) ?? "NEWEST";

  return (
    <>
      <div className="container mx-auto">
        <Gallery tags={tags} sort={sort} />
      </div>
      <ScrollButtons />
    </>
  );
};

export default Home;
