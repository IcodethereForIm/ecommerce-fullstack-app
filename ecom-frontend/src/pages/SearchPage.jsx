import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { buildUrl } from "../config/api";
import BASE_URL from "../config/api";
const api = (path) => buildUrl(`/api${path}`);

const SearchPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const query = params.get("q");

  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchResults = async () => {
      const res = await fetch(api(`/search?q=${query}`));
      const data = await res.json();
      
      setResults(data);
    };

    if (query) fetchResults();
  }, [query]);

  return (
    <div>
      <h3>Search results for: {query}</h3>

      {results.map((item) => (
  <div key={item.id} className="d-flex align-items-center gap-3 p-2 border-bottom" onClick={()=>{navigate(`/product/${item.id}`);}}>
    
    <img
      src={
        item.thumbnail
        ? `${BASE_URL}/storage/${item.thumbnail}`
        : "/placeholder.png"
  }
      alt={item.name}
      width="50"
      height="50"
      style={{ objectFit: "cover" }}
    />

    <div>
      <div>{item.name}</div>
      <small>₹{item.price}</small>
      <p className="mb-0 text-muted" style={{ fontSize: "12px" }}>
        {item.description?.slice(0, 40)}...
      </p>
    </div>

  </div>
))}
    </div>
  );
};

export default SearchPage;