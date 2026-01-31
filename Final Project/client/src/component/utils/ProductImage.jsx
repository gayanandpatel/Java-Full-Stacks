import React, { useState, useEffect } from "react";
// Import styles
import styles from "./ProductImage.module.css";

const ProductImage = ({ productId, altText = "Product Image" }) => {
  const [productImg, setProductImg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Use env variable or fallback
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9090/api/v1";

  useEffect(() => {
    let isMounted = true; // Cleanup flag

    const fetchProductImage = async (id) => {
      try {
        setIsLoading(true);
        setError(false);
        
        const response = await fetch(
          `${BASE_URL}/images/image/download/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to load image");
        }

        const blob = await response.blob();
        const reader = new FileReader();
        
        reader.onloadend = () => {
          if (isMounted) {
            setProductImg(reader.result);
            setIsLoading(false);
          }
        };
        
        reader.readAsDataURL(blob);
      } catch (err) {
        console.error("Error fetching image:", err);
        if (isMounted) {
          setError(true);
          setIsLoading(false);
        }
      }
    };

    if (productId) {
      fetchProductImage(productId);
    } else {
      setIsLoading(false);
      setError(true);
    }

    return () => {
      isMounted = false;
    };
  }, [productId, BASE_URL]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.placeholder}>
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !productImg) {
    return (
      <div className={styles.container}>
        <div className={styles.placeholder}>
          <span>No Image</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <img 
        src={productImg} 
        alt={altText} 
        className={styles.image} 
      />
    </div>
  );
};

export default ProductImage;