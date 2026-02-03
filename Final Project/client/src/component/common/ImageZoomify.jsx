import { useEffect, useState } from "react";
import ImageZoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import PropTypes from "prop-types";

import styles from "./ImageZoomify.module.css";

const ImageZoomify = ({ productId }) => {
  const [productImg, setProductImg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductImage = async (id) => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:9090/api/v1/images/image/download/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to load image");
        }

        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
          setProductImg(reader.result);
          setIsLoading(false);
        };
        reader.readAsDataURL(blob);
      } catch (error) {
        console.error("Error fetching image:", error);
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchProductImage(productId);
    }
  }, [productId]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.skeleton}></div>
      </div>
    );
  }

  if (!productImg) {
    return (
      <div className={styles.container}>
        <span style={{ color: "#999", fontSize: "0.9rem" }}>
          No image available
        </span>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.zoomWrapper}>
        <ImageZoom>
          <img
            src={productImg}
            alt="Product"
            className={styles.image}
          />
        </ImageZoom>
      </div>
    </div>
  );
};

ImageZoomify.propTypes = {
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default ImageZoomify;