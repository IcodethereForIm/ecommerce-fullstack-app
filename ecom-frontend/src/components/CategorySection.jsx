import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CategorySection.module.css"

function CategorySection({menSection,womenSection,type}) {
  const navigate = useNavigate();
  const [menSectionImage, setMenSectionImage] = React.useState(null);
  const [woMenSectionImage, setWoMenSectionImage] = React.useState(null);

  React.useEffect(() => {
      fetch(`http://127.0.0.1:8000/api/site-assets/${menSection?.section}/${type}/${menSection.asset_key}`)
        .then(res => res.json())
        .then(data => setMenSectionImage(data.data?.[0]?.image_url || null))
        .catch(err => console.error(err));
    }, [menSection?.section, menSection?.asset_key, type]);
  
    React.useEffect(() => {
      fetch(`http://127.0.0.1:8000/api/site-assets/${womenSection?.section}/${type}/${womenSection.asset_key}`)
        .then(res => res.json())
        .then(data => setWoMenSectionImage(data.data?.[0]?.image_url || null))
        .catch(err => console.error(err));
    }, [womenSection?.section, womenSection?.asset_key, type]);

  return (
    <div className="container my-5">
      <div className="row g-4">

        {/* MEN */}
        <div className="col-md-6">
          <div
            className={styles.categorybox}
            onClick={() => navigate(`/category/${menSection?.slug}`)}
          >
            <img
              src={menSectionImage}
              alt="Men"
              className="img-fluid"
            />
            <div className={styles.overlay}>
              <h2>Men</h2>
            </div>
          </div>
        </div>

        {/* WOMEN */}
        <div className="col-md-6">
          <div
            className={styles.categorybox}
            onClick={() => navigate(`/category/${womenSection?.slug}`)}
          >
            <img
              src={woMenSectionImage}
              alt="Women"
              className="img-fluid"
            />
            <div className={styles.overlay}>
              <h2>Women</h2>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CategorySection;