"use client";

import { useState, useMemo, useEffect } from "react";
import { debounce, get } from "lodash";
import { get as aGet } from "@/lib/axios";

export default function SearchPage() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);

  const debouncedFetch = useMemo(
    () =>
      debounce(async (q) => {
        setLoading(true);
        try {
          const res = await aGet("/api/fixtures/search", { params: { q } });
          setResults(res);
        } catch (err) {
          console.error(err);
          setResults([]);
        } finally {
          setLoading(false);
        }
      }, 300),
    []
  );

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  const handleChange = (e) => {
    handleOnSelect(null);
    const q = e.target.value.trim();
    setKeyword(e.target.value);

    if (!q) {
      debouncedFetch.cancel();
      setResults([]);
      return;
    }

    debouncedFetch(q);
  };

  const handleOnSelect = (item) => {
    setSelected(item);
  };

  const renderResult = () => {
    if ((results || []).length > 0) {
      return (
        <ul className="space-y-2 mb-4">
          {results.map((item) => (
            <li
              key={item.fixture_mid}
              onClick={() => handleOnSelect(item)}
              className="p-2 border border-gray-200 rounded hover:bg-gray-100 cursor-pointer"
            >
              {get(item, "home_team")} vs {get(item, "away_team")}
            </li>
          ))}
        </ul>
      );
    } else {
      return <span>No data</span>;
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded shadow">
      {selected && (
        <>
          <h2 className="text-xl font-semibold mb-4">Select result</h2>
          <div className="p-4 border-t border-gray-200">
            <h3 className="text-lg font-medium mb-2">Match Details</h3>
            <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto">
              {JSON.stringify(selected, null, 2)}
            </pre>
          </div>
        </>
      )}
      <h2 className="text-xl font-semibold mb-4">Search Fixtures</h2>

      <input
        type="text"
        value={keyword}
        onChange={handleChange}
        placeholder="Type a team name…"
        className="w-full px-3 py-2 border border-gray-300 rounded mb-4 focus:outline-none focus:ring"
      />

      {loading ? (
        <p className="text-blue-600 mb-4">Searching…</p>
      ) : (
        renderResult()
      )}
    </div>
  );
}
