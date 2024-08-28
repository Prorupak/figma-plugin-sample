import * as React from "react";
import { useState, useEffect } from "react";
import { useDebounceCallback } from "../../hooks/useDebounce";
import SearchIcon from "./SearchIcon";

const SearchPlugin: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<string[]>([]);
  const [current, setCurrent] = useState<number | undefined>(undefined);
  const [searching, setSearching] = useState<boolean>(false);

  const updateSearch = useDebounceCallback((newQuery: string) => {
    setQuery(newQuery);
    setResults([]);
    setCurrent(undefined);
    setSearching(newQuery !== "");
    parent.postMessage(
      {
        pluginMessage: {
          type: "search-query",
          query: newQuery,
        },
      },
      "*"
    );
  }, 300);

  const getPrevious = () =>
    current === undefined
      ? results.length - 1
      : (current + results.length - 1) % results.length;
  const getNext = () =>
    current === undefined ? 0 : (current + 1) % results.length;

  const showPrevious = () => {
    const prev = getPrevious();
    setCurrent(prev);
    parent.postMessage(
      {
        pluginMessage: {
          type: "show",
          show: results[prev],
        },
      },
      "*"
    );
  };

  const showNext = () => {
    const next = getNext();
    setCurrent(next);
    parent.postMessage(
      {
        pluginMessage: {
          type: "show",
          show: results[next],
        },
      },
      "*"
    );
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data.pluginMessage;
      if (message.query !== query) return;
      setResults((prevResults) => [...prevResults, ...message.results]);
      if (message.done) setSearching(false);
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [query]);

  return (
    <div className="container">
      <div className="input-wrapper">
        <SearchIcon />
        <input
          id="query"
          type="text"
          placeholder="Enter query to search"
          onChange={(e) => updateSearch(e.target.value)}
        />
      </div>
      <div>
        {query ? (
          <>
            <p id="status">
              {searching
                ? `Searching...${
                    results.length ? ` Found ${results.length} results` : ""
                  }`
                : query
                ? `Done! Found ${results.length} results`
                : ""}
            </p>
            <div className="button-wrapper">
              <button
                id="previous"
                className="text-search-button"
                onClick={showPrevious}
                disabled={!results.length}
              >
                Previous
              </button>
              <button
                id="next"
                className="text-search-button"
                onClick={showNext}
                disabled={!results.length}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <p className="helper-text">
            Please enter your query to start searching
          </p>
        )}
      </div>
    </div>
  );
};

export default SearchPlugin;
