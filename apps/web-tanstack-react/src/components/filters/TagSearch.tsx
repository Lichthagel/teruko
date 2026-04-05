import type { TagExt } from "models";
import type { KeyboardEventHandler } from "react";
import { useFilters } from "#/stores/filters";
import styles from "client-css/m/filters.module.scss";
import { TagSuggestions } from "client-graphql/snippets";
import { LoaderCircle, Search } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useQuery } from "urql";

export const TagSearch = () => {
  const { setTags } = useFilters();

  const [tagInput, setTagInput] = useState("");
  const [activeSuggestion, setActiveSuggestion] = useState(0);

  const [suggestionsResult] = useQuery({
    query: TagSuggestions,
    variables: { query: tagInput },
    pause: tagInput.length < 3,
  });

  const suggestions = useMemo<TagExt[]>(
    () => (tagInput.length > 3 && suggestionsResult.data?.tagSuggestions) || [],
    [suggestionsResult.data?.tagSuggestions, tagInput.length],
  );

  const handleSubmit = useCallback(() => {
    const suggestion = suggestions[activeSuggestion];

    if (!suggestion) {
      return;
    }

    setTags(prev => [...prev, suggestion.slug]);
    setTagInput("");
    setActiveSuggestion(0);
  }, [activeSuggestion, setTags, suggestions]);

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = useCallback((e) => {
    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();

        setActiveSuggestion((activeSuggestion) => {
          if (activeSuggestion < suggestions.length - 1) {
            return activeSuggestion + 1;
          } else {
            return 0;
          }
        },
        );

        break;
      }
      case "ArrowUp": {
        e.preventDefault();

        setActiveSuggestion((activeSuggestion) => {
          if (activeSuggestion > 0) {
            return activeSuggestion - 1;
          } else {
            return 0;
          }
        },
        );

        break;
      }
      case "Enter": {
        e.preventDefault();

        handleSubmit();

        break;
      }
      case "Escape": {
        e.preventDefault();

        setTagInput("");
        setActiveSuggestion(0);

        setTags([]);

        break;
      }
    // No default
    }
  }, [handleSubmit, setTags, suggestions.length]);

  return (
    <div className={styles["search-container"]}>
      <Search />

      <input
        value={tagInput}
        onInput={e => setTagInput((e.target as HTMLInputElement).value)}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
        type="text"
      />

      {false // fetching
        && (
          <div className={styles["suggestions-loading"]}>
            <LoaderCircle className={styles.icon} />
          </div>
        )}

      {suggestions.length > 0
        && (
          <ul className={styles["suggestions-container"]}>
            {suggestions.map((suggestion, index) => {
              return (
                <li
                  key={suggestion.slug}
                  className={index === activeSuggestion ? styles.active : undefined}
                  onClick={() => handleSubmit()}
                  onMouseEnter={() => setActiveSuggestion(index)}
                  style={{
                    backgroundColor: (index === activeSuggestion && suggestion.category && suggestion.category.color) || undefined,
                    color: (index !== activeSuggestion && suggestion.category && suggestion.category.color) || undefined,
                  }}
                >
                  {suggestion.slug}
                </li>
              );
            })}

          </ul>
        )}
    </div>
  );
};
