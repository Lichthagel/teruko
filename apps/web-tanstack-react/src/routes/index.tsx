import { Filters } from "#/components/filters/Filters";
import { createFileRoute } from "@tanstack/react-router";

const App = () => {
  return (
    <div className="container">
      <Filters />
    </div>
  );
};

export const Route = createFileRoute("/")({ component: App });
