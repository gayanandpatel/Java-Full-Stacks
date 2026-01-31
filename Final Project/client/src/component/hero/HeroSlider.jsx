import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import bg1 from "../../assets/images/hero-1.jpg";
import bg2 from "../../assets/images/hero-2.jpg";
import bg3 from "../../assets/images/hero-3.jpg";
import bg5 from "../../assets/images/hero-7.jpg";

const images = [bg1, bg2, bg3, bg5];

const HeroSlider = () => {
  const settings = {
    infinite: true,
    speed: 1000, 
    autoplay: true,
    autoplaySpeed: 5000, // Fixed naming convention (camelCase)
    fade: true, // Adds a smoother cross-fade effect
    arrows: false,
    dots: false,
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    position: "absolute",
    top: 0,
    left: 0
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Slider {...settings} style={{ height: "100%" }}>
        {images.map((img, index) => (
          <div key={index} style={{ height: "100%" }}>
            {/* Using inline styles here ensures the background cover works perfectly */}
            <div style={{ 
               height: "600px", // Match Hero container height
               backgroundImage: `url(${img})`,
               backgroundSize: 'cover',
               backgroundPosition: 'center'
            }} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroSlider;