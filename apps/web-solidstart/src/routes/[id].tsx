import type { ImageExt } from "models";
import { Title } from "@solidjs/meta";
import { useParams } from "@solidjs/router";
import { createQuery, gql } from "@urql/solid";
import { createMemo, Show } from "solid-js";

export default () => {
  const { id } = useParams();

  const [result] = createQuery<{ image: ImageExt | null }>({
    query: gql`
      query Image($id: ID!) {
        image(id: $id) {
          id
          title
          source
          filename
          createdAt
          updatedAt
          width
          height
          tags {
            slug
            category {
              color
            }
          }
        }
      }
    `,
    variables: { id },
  });

  const image = createMemo(() => result.data?.image);

  return (
    <>
      <Show when={image()?.title}>
        <Title>
          {`${image()?.title} - `}
          てる子
        </Title>
      </Show>
      {JSON.stringify(result.data)}
    </>
  );
};
