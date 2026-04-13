import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Promo.module.css"

function PromoBanner() {
  const [banners, setBanners] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const bannerData = [
    {
      id: 1,
      title: "Summer Sale",
      subtitle: "Up to 50% Off",
      image: "/images/summerCol1.jpg",
      link: "/category/men",
    },
    {
      id: 2,
      title: "New Collection",
      subtitle: "Fresh Styles 2026",
      image: "/images/summerCol2.jpg",
      link: "/category/women",
    },
    {
      id: 3,
      title: "Exclusive Collection",
      subtitle: "Hot Trends 2026",
      image: "/images/summerCol3.jpg",
      link: "/category/women-upper",
    },
  ];

  useEffect(() => {
    // Initialize with first banner
    setBanners([bannerData[currentIndex]]);

    // Setup interval to change banners every 5 seconds
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % bannerData.length);
      setBanners([bannerData[(currentIndex + 1) % bannerData.length]]);
    }, 2500);

    return () => clearInterval(interval); // cleanup
  }, [currentIndex]);
  return (
    <div
      id="promoCarousel"
      className="carousel slide"
      data-bs-ride="carousel"
    >
      <div className="carousel-inner">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <div className={styles.promohero}>
              <img src={banner.image} className="d-block w-100" alt="" />

              <div className={styles.overlay}>
                <h1>{banner.title}</h1>
                <p>{banner.subtitle}</p>
                <Link to={banner.link} className="btn btn-warning">
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#promoCarousel"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon"></span>
      </button>

      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#promoCarousel"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon"></span>
      </button>
    </div>
  );
}

export default PromoBanner;