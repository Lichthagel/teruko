"use client";

import type { ReactElement } from "react";

import Filters from "@/components/Filters";
import Gallery from "@/components/Gallery";
import ScrollButtons from "@/components/ScrollButtons";
import { useStore } from "@nanostores/react";
import { sortStore, tagsStore } from "client-stores";

const Home = (): ReactElement => {
  const tags = useStore(tagsStore);

  const sort = useStore(sortStore) ?? "NEWEST";

  return (
    <>
      <div className="container mx-auto">
        <Filters />

        <Gallery sort={sort} tags={tags} />
      </div>
      <ScrollButtons />
    </>
  );
};

export default Home;
