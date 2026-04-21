import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { buildUrl } from "../config/api";
import BASE_URL from "../config/api";
const api = (path) => buildUrl(`/api${path}`);

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // reset on route change
  useEffect(() => {
    setQuery("");
    setResults([]);
    setShowDropdown(false);
  }, [location.pathname]);

  // live search
  useEffect(() => {
    const delay = setTimeout(() => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      const fetchResults = async () => {
        const res = await fetch(
          api(`/search?q=${query}`)
        );
        const data = await res.json();
        setResults(data);
      };

      fetchResults();
    }, 300);

    return () => clearTimeout(delay);
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setShowDropdown(false);
    navigate(`/search?q=${query}`);
  };

  return (
    <div className="position-relative">
      <form className="d-flex" onSubmit={handleSearch}>
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setShowDropdown(e.target.value.length >= 2);
          }}
          onFocus={() => setShowDropdown(true)}
        />

        <button className="btn btn-outline-success" type="submit">
          Search
        </button>
      </form>

      {showDropdown && results.length > 0 && (
        <div className="position-absolute bg-white border shadow w-100"
          style={{ top: "100%", left: 0, zIndex: 1000 }}>

          {results.map((item) => (
            <div
              key={item.id}
              className="d-flex gap-2 p-2 align-items-center"
              style={{ cursor: "pointer" }}
              onClick={() => {
                setQuery("");
                setResults([]);
                setShowDropdown(false);
                navigate(`/product/${item.id}`);
              }}
            >
              <img
                src={
                  item.thumbnail
                    ? `${BASE_URL}/storage/${item.thumbnail}`
                    : "/placeholder.png"
                }
                width="40"
                height="40"
              />

              <div>
                <div>{item.name}</div>
                <small>₹{item.price}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;