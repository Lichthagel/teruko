import useSuggestions from "@/hooks/useSuggestions";
import { useStore } from "@nanostores/react";
import { tagsStore } from "client-common/stores";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { useCallback, useState } from "react";

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
        case "Enter": {
          e.preventDefault();

          const suggestion = suggestions[activeSuggestion];

          if (suggestion) {
            handleSubmit(suggestion.slug);
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
        case "ArrowDown": {
          e.preventDefault();

          if (activeSuggestion < suggestions.length - 1) {
            setActiveSuggestion(activeSuggestion + 1);
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
    <div className="relative inline-block">
      <input
        className="h-10 rounded bg-base-100 px-2 focus:outline-none"
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
        <div className="absolute left-0 right-0 z-20 flex h-20 items-center justify-center bg-base-100 p-1">
          <Loader2 className="h-14 w-14 animate-spin" />
        </div>
      )}
      {suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 z-20 block bg-base-100 p-1">
          {suggestions.map((suggestion, index) => (
            <li
              className={clsx("my-1 h-10 cursor-pointer truncate rounded p-2", {
                "bg-primary text-primary-content": index === activeSuggestion,
                "bg-neutral text-neutral-content": index !== activeSuggestion,
              })}
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
