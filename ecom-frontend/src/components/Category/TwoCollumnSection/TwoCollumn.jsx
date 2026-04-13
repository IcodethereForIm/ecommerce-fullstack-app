import React from "react";
import styles from "./TwoCollumn.module.css";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

function TwoColumnSection({ upperSection, bottomsSection, type, }) {
    const [upperImage, setUpperImage] = React.useState(null);
    const [bottomsImage, setBottomsImage] = React.useState(null);
    const {slug} = useParams()

    React.useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/site-assets/${upperSection?.section}/${type}/${upperSection?.asset_key}`)
      .then(res => res.json())
      .then(data => setUpperImage(data.data?.[0]?.image_url || null))
      .catch(err => console.error(err));
  }, [upperSection?.section, type,upperSection?.asset_key]);

  React.useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/site-assets/${bottomsSection?.section}/${type}/${bottomsSection?.asset_key}`)
      .then(res => res.json())
      .then(data => setBottomsImage(data.data?.[0]?.image_url || null))
      .catch(err => console.error(err));
  }, [bottomsSection?.section, type, bottomsSection?.asset_key]);


  return (
    <div className={styles.wrapper}>
      {/* Upper Column */}
      <div className={styles.column}>
        {upperImage ? (
          <img src={upperImage} alt="Upper" className={styles.image} />
        ) : (
          <div className={styles.skeleton}></div>
        )}
        <h3 className={styles.title}>UPPER</h3>
        <Link to={`/category/${upperSection?.slug}`}>
        <button className={`btn btn-outline-light fw-bold ${styles.hoverSlide}`}>SHOP NOW</button>
        </Link>
      </div>

      {/* Bottoms Column */}
      <div className={styles.column}>
        {bottomsImage ? (
          <img src={bottomsImage} alt="Bottoms" className={styles.image} />
        ) : (
          <div className={styles.skeleton}></div>
        )}
        <h3 className={styles.title}>BOTTOMS</h3>
        <Link to={`/category/${bottomsSection?.slug}`}>
        <button className={`btn btn-outline-light fw-bold ${styles.hoverSlide}`}>SHOP NOW</button>
        </Link>
      </div>
    </div>
  );
}

export default TwoColumnSection;