import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import styles from "./Hero.module.css"
function Hero({section,assetKey,type}){
    const [banners, setBanners] = useState([]);
      const [index, setIndex] = useState(0);
      const [loading, setLoading] = useState(true); // 🔹 new loading state
      const navigat = useNavigate()
    
      // 🔹 Fetch images
      useEffect(() => {
        setLoading(true); // start loading when section/type changes
        fetch(`http://127.0.0.1:8000/api/site-assets/${section?.section}/${type}/${assetKey}`)
          .then((res) => res.json())
          .then((data) => {
            const bannerData = data.data || [];
            setBanners(bannerData);
            //setIndex(0); // reset slider when type changes
    
            // 🔹 Preload first image
            if (bannerData.length > 0) {
              const img = new Image();
              img.src = bannerData[0].image_url;
              img.onload = () => setLoading(false);
            } else {
              setLoading(false);
            }
          })
          .catch((err) => {
            console.error(err);
            setLoading(false);
          });
      }, [section?.section, type,assetKey]);
      
      //  Auto slider
      useEffect(() => {
        if (banners.length === 0) return;
    
        const interval = setInterval(() => {
          setIndex((prev) => (prev + 1) % banners.length);
        }, 3000); // change every 3 sec
    
        return () => clearInterval(interval);
      }, [banners]);
    
      //  Manual controls
      const nextSlide = () => {
        setIndex((prev) => (prev + 1) % banners.length);
      };
    
      const prevSlide = () => {
        setIndex((prev) =>
          prev === 0 ? banners.length - 1 : prev - 1
        );
      };
    
      return (
        <div>
          {/*  Skeleton placeholder */}
          {loading ? (
            <div className={styles.skeleton}></div>
          ) : (
            // 🔥 FULL WIDTH BANNER
            banners.length > 0 && (
              <div className={styles.bannerWrapper}>
                <img
                  src={banners[index].image_url}
                  alt="banner"
                  className={styles.bannerImg}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigat(`/collections/${section?.slug}`) }
                />
    
                {/* LEFT BUTTON */}
                <button
                  onClick={prevSlide}
                  className={`${styles.sliderBtn} ${styles.left}`}
                >
                  ❮
                </button>
    
                {/* RIGHT BUTTON */}
                <button
                  onClick={nextSlide}
                  className={`${styles.sliderBtn} ${styles.right}`}
                >
                  ❯
                </button>
    
                {/* DOTS */}
                <div className={styles.dotContainer}>
                  {banners.map((_, i) => (
                    <span
                      key={i}
                      onClick={() => setIndex(i)}
                      className={`${styles.dot} ${i === index ? styles.active : ""}`}
                    />
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      );
}
export default Hero