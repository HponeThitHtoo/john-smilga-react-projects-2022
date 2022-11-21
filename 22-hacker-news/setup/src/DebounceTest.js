import React, { useEffect, useState } from "react";

import useDebounce from "./useDebounce";

const DebounceTest = () => {
  // State and setters for ...
  // Search term
  const [searchTerm, setSearchTerm] = useState("");
  // API search results
  const [results, setResults] = useState([]);
  // Searching status (whether there is pending API request)
  const [isSearching, setIsSearching] = useState(false);
  // Debounce search term so that it only gives us latest value ...
  // ... if searchTerm has not been updated within last 500ms.
  // The goal is to only have the API call fire when user stops typing ...
  // ... so that we aren't hitting our API rapidly.
  const debouncedSearchTerm = useDebounce(searchTerm, 2500);

  // API search function
  const searchCharacters = (search) => {
    const apiKey = REACT_APP_API_KEY;
    const hashKey = REACT_APP_HASH;

    return fetch(
      `https://gateway.marvel.com/v1/public/comics?ts=1&apikey=${apiKey}&hash=${hashKey}&titleStartsWith=${search}`,
      {
        method: "GET",
      }
    )
      .then((r) => r.json())
      .then((r) => r.data.results)
      .catch((error) => {
        console.error(error);
        return [];
      });
  };

  // Effect for API call
  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsSearching(true);
      searchCharacters(debouncedSearchTerm).then((results) => {
        setIsSearching(false);
        setResults(results);
      });
    } else {
      setResults([]);
      setIsSearching(false);
    }
  }, [debouncedSearchTerm]); // Only call effect if debounced search term changes

  return (
    <div>
      <input
        type="text"
        placeholder="Search Marvel Comics"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {isSearching && <div>Searching...</div>}

      {results.map((result) => (
        <div key={result.id}>
          <h4>{result.title}</h4>
          <img
            src={`${result.thumbnail.path}/portrait_incredible.${result.thumbnail.extension}`}
            alt=""
          />
        </div>
      ))}
    </div>
  );
};

export default DebounceTest;
