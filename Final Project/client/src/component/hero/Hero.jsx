import React, { useState } from "react";
import HeroSlider from "./HeroSlider";
import SearchBar from "../search/SearchBar";
import { Link } from "react-router-dom";
import styles from "./Hero.module.css";

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <div className={styles.heroContainer}>
      {/* Background Slider */}
      <div className={styles.sliderWrapper}>
        <HeroSlider setCurrentSlide={setCurrentSlide} />
      </div>
      
      {/* Dark Overlay for contrast */}
      <div className={styles.overlay}></div>

      {/* Main Content */}
      <div className={styles.contentWrapper}>
        <div className={styles.glassCard}>
          <h1 className={styles.title}>
            Welcome to <span className={styles.brandHighlight}>Shop</span>ifyy
          </h1>
          
          <div className={styles.searchContainer}>
            <SearchBar />
          </div>

          <div className={styles.buttonGroup}>
            <Link to='/products' className={styles.primaryBtn}>
              Shop Now
            </Link>
            <button className={styles.secondaryBtn}>
              Today's Deals
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;