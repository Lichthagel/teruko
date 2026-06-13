import type { LucideIcon } from "lucide-react";
import type { TagExt } from "models";
import type { FunctionComponent, KeyboardEventHandler } from "react";
import styles from "client-css/m/taginput.module.scss";
import { TagSuggestions } from "client-graphql/snippets";
import { LoaderCircle } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "urql";

const TagInput: FunctionComponent<{
  icon?: LucideIcon;
  tagInput?: string;
  setTagInput?: (value: string) => void;
  clearOnSubmit?: boolean;
  onSubmit?: (value: string) => void;
  onEscape?: () => void;
}> = ({
  icon: Icon,
  tagInput: tagInputExt,
  setTagInput: setTagInputExt,
  clearOnSubmit = true,
  onSubmit,
  onEscape,
}) => {
  const [tagInput, setTagInput] = useState("");

  useEffect(() => {
    if (tagInputExt) {
      // eslint-disable-next-line react/set-state-in-effect
      setTagInput(tagInputExt);
    }
  }, [tagInputExt]);
  useEffect(() => {
    setTagInputExt?.(tagInput);
  }, [setTagInputExt, tagInput]);

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

    onSubmit?.(suggestion.slug);
    if (clearOnSubmit) {
      setTagInput("");
    }
    setActiveSuggestion(0);
  }, [activeSuggestion, clearOnSubmit, onSubmit, suggestions]);

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

        onEscape?.();

        break;
      }
    // No default
    }
  }, [handleSubmit, onEscape, suggestions.length]);

  return (
    <div className={styles["search-container"]}>
      {Icon && <Icon className={styles.icon} />}

      <input
        value={tagInput}
        onInput={event => setTagInput(event.currentTarget.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
        type="text"
      />

      {suggestionsResult.fetching // fetching
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

export default TagInput;
