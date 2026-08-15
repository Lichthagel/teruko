import type { RouteDefinition } from "@solidjs/router";
import { Title } from "@solidjs/meta";
import { httpStatus } from "@solidjs/web";

export const route = {
  preload: () => httpStatus(404),
} satisfies RouteDefinition;

export default function NotFound() {
  return (
    <main>
      <Title>Not Found</Title>
      <h1>Page Not Found</h1>
    </main>
  );
}
