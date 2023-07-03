"use client";

import Filters from "@/components/Filters";
import Gallery from "@/components/Gallery";
import ScrollButtons from "@/components/ScrollButtons";
import type { ReactElement } from "react";
import { tagsStore, sortStore } from "client-common/stores";
import { useStore } from "@nanostores/react";

const Home = (): ReactElement => {
  const tags = useStore(tagsStore);

  const sort = useStore(sortStore) ?? "NEWEST";

  return (
    <>
      <div className="container mx-auto">
        <Filters />

        <Gallery tags={tags} sort={sort} />
      </div>
      <ScrollButtons />
    </>
  );
};

export default Home;
