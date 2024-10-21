import { useStore } from "@nanostores/react";
import styles from "client-css/m/filters.module.scss";
import { tagsStore } from "client-stores";
import clsx from "clsx";
import { Loader2, Search } from "lucide-react";
import { useCallback, useState } from "react";

import useSuggestions from "@/hooks/useSuggestions";

const TagInput = () => {
  const tags = useStore(tagsStore);

  const [tagInput, setTagInput] = useState("");
  const [activeSuggestion, setActiveSuggestion] = useState(0);

  const { fetching, suggestions } = useSuggestions(tagInput); // TODO handle error

  const handleSubmit = useCallback(
    (tagSlug: string) => {
      tagsStore.set([...tags, tagSlug]);

      setTagInput("");
      setActiveSuggestion(0);
    },
    [tags],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();

          if (activeSuggestion < suggestions.length - 1) {
            setActiveSuggestion(activeSuggestion + 1);
          }

          break;
        }
        case "ArrowUp": {
          e.preventDefault();

          if (activeSuggestion > 0) {
            setActiveSuggestion(activeSuggestion - 1);
          }

          break;
        }
        case "Enter": {
          e.preventDefault();

          const suggestion = suggestions[activeSuggestion];

          if (suggestion) {
            handleSubmit(suggestion.slug);
          }

          break;
        }
        case "Escape": {
          e.preventDefault();

          setTagInput("");
          setActiveSuggestion(0);

          tagsStore.set([]);

          break;
        }
        // No default
      }
    },
    [activeSuggestion, handleSubmit, suggestions],
  );

  return (
    <div className={styles["search-container"]}>
      <Search />

      <input
        onChange={(e) => {
          setTagInput(e.target.value);
          setActiveSuggestion(0);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Search..."
        type="text"
        value={tagInput}
      />
      {fetching && (
        <div className={styles["suggestions-loading"]}>
          <Loader2 className={styles.icon} />
        </div>
      )}
      {suggestions.length > 0 && (
        <ul className={styles["suggestions-container"]}>
          {suggestions.map((suggestion, index) => (
            <li
              className={clsx(index === activeSuggestion && styles.active)}
              key={suggestion.slug}
              onClick={() => handleSubmit(suggestion.slug)}
              onMouseEnter={() => setActiveSuggestion(index)}
              style={{
                backgroundColor:
                  (index === activeSuggestion &&
                    suggestion.category &&
                    suggestion.category.color) ||
                    undefined,
                color:
                  (index !== activeSuggestion &&
                    suggestion.category &&
                    suggestion.category.color) ||
                    undefined,
              }}
            >
              {suggestion.slug}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TagInput;
