import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import bg1 from "../../assets/images/hero-1.jpg";
import bg2 from "../../assets/images/hero-2.jpg";
import bg3 from "../../assets/images/hero-3.jpg";
import bg4 from "../../assets/images/hero-6.jpg";
import bg5 from "../../assets/images/hero-7.jpg";

const images = [bg1, bg2, bg3, bg4, bg5];

const HeroSlider = () => {
  const settings = {
    infinite: true,
    speed: 1000, 
    autoplay: true,
    autoplaySpeed: 3000,
    fade: true, 
    arrows: false,
    dots: false,
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Slider {...settings} style={{ height: "100%" }}>
        {images.map((img, index) => (
          <div key={index} style={{ height: "100%" }}>
            <div style={{ 
               height: "600px", 
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