import useSuggestions from "@/hooks/useSuggestions";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

const TagInput = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [tagInput, setTagInput] = useState("");
  const [activeSuggestion, setActiveSuggestion] = useState(0);

  const { fetching, error, suggestions } = useSuggestions(tagInput);

  const handleSubmit = useCallback(
    (tagSlug: string) => {
      setTagInput("");
      setActiveSuggestion(0);

      const newSearchParams = new URLSearchParams(searchParams.toString());

      newSearchParams.append("tag", tagSlug);

      router.push(`${pathname}?${newSearchParams.toString()}`);
    },
    [pathname, router, searchParams]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case "Enter": {
          e.preventDefault();

          if (suggestions.length > 0) {
            handleSubmit(suggestions[activeSuggestion].slug);
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

          const newSearchParams = new URLSearchParams(searchParams.toString());

          newSearchParams.delete("tag");

          router.push(`${pathname}?${newSearchParams.toString()}`);

          break;
        }
        // No default
      }
    },
    [
      activeSuggestion,
      handleSubmit,
      pathname,
      router,
      searchParams,
      suggestions,
    ]
  );

  return (
    <div className="relative inline-block">
      <input
        type="text"
        className="h-10 rounded bg-base-100 px-2 focus:outline-none"
        placeholder="Search..."
        value={tagInput}
        onChange={(e) => {
          setTagInput(e.target.value);
          setActiveSuggestion(0);
        }}
        onKeyDown={handleKeyDown}
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
              key={suggestion.slug}
              className={clsx("my-1 h-10 cursor-pointer truncate rounded p-2", {
                "bg-primary text-primary-content": index === activeSuggestion,
                "bg-neutral text-neutral-content": index !== activeSuggestion,
              })}
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
