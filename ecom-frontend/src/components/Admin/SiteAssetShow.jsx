import React, { useEffect, useState } from "react";

function SlugSectionsPreview({ slug }) {
    
  const [sections, setSections] = useState([]);

  useEffect(() => {
  if (!slug) return;

  const delay = setTimeout(() => {
    

    const fetchSections = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/site-assets/sections/${slug}`
        );

        const data = await res.json();

        setSections(data.section || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchSections();
  }, 400); // ⏱️ wait 400ms after typing stops

  return () => clearTimeout(delay); // cancel previous calls
}, [slug]);

  return (
    <div className="mt-3">
      <h6>Available Banners for this Slug</h6>

      {sections.length === 0 ? (
        <p>No banners found</p>
      ) : (
        <ul>
          {sections.map((section, index) => (
            <li key={index}>{section}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SlugSectionsPreview;