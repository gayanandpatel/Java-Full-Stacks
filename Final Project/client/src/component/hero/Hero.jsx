import HeroSlider from "./HeroSlider";
import { Link } from "react-router-dom";
import styles from "./Hero.module.css";

const Hero = () => {
  return (
    <div className={styles.heroContainer}>
      {/* Background Slider */}
      <div className={styles.sliderWrapper}>
        <HeroSlider />
      </div>
      
      {/* Side Gradient Overlay */}
      <div className={styles.overlay}></div>

      {/* Main Content - Left Aligned */}
      <div className={styles.contentWrapper}>
        <h1 className={styles.title}>
          Big Savings on <br />
          <span className={styles.brandHighlight}>Trending Fashion</span>
        </h1>
        <p className={styles.subTitle}>
           Up to 50% off on latest brands. Limited time offer.
        </p>

        <Link to='/products' className={styles.primaryBtn}>
          Explore Collection
        </Link>
      </div>
    </div>
  );
};

export default Hero;