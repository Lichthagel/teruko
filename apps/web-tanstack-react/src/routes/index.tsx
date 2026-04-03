import { createFileRoute } from "@tanstack/react-router";

const App = () => {
  return (
    <main>
      Teruko
    </main>
  );
};

export const Route = createFileRoute("/")({ component: App });
