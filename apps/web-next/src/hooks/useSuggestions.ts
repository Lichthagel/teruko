import { TagExt } from "models";
import { useEffect, useState } from "react";
import { CombinedError, gql, useClient } from "urql";

const useSuggestions = (query: string) => {
  const client = useClient();

  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<CombinedError | null>(null);
  const [suggestions, setSuggestions] = useState<TagExt[]>([]);

  useEffect(() => {
    if (query.length < 3) {
      // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
      setSuggestions([]);
      // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
      setFetching(false);
      return;
    }

    // eslint-disable-next-line @eslint-react/hooks-extra/no-direct-set-state-in-use-effect
    setFetching(true);
    const timeout = setTimeout(() => {
      client
        .query<{ tagSuggestions: TagExt[] }>(
          gql`
            query TagSuggestions($query: String!) {
              tagSuggestions(query: $query) {
                slug
                category {
                  color
                }
              }
            }
          `,
          { query },
        )
        .toPromise()
        .then(({ data }) => {
          if (data?.tagSuggestions) {
            setSuggestions(data.tagSuggestions);
            setFetching(false);
            return;
          }

          setSuggestions([]);
          setFetching(false);
        })
        .catch((error: CombinedError) => {
          setFetching(false);
          setError(error);
        });
    }, 250);

    return () => clearTimeout(timeout);
  }, [client, query]);

  return {
    fetching,
    error,
    suggestions,
  };
};

export default useSuggestions;
