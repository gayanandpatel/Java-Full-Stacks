import { useState, useEffect } from "react";
import PropTypes from "prop-types";

import styles from "./ProductImage.module.css";

const ProductImage = ({ productId, altText = "Product Image" }) => {
  const [productImg, setProductImg] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

ProductImage.propTypes = {
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  altText: PropTypes.string,
};

  // Use env variable or fallback
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:9090/api/v1";

  useEffect(() => {
    let isMounted = true; 

    const fetchProductImage = async (id) => {
      if (!id) {
        if (isMounted) {
          setIsLoading(false);
          setError(true);
        }
        return;
      }

      try {
        setIsLoading(true);
        setError(false);
        
        let response = await fetch(
          `${BASE_URL}/images/image/download/${id}`
        );

        
        if (response.status === 404) {
          try {
            
            const productResponse = await fetch(`${BASE_URL}/products/product/${id}/product`);
            
            if (productResponse.ok) {
              const responseJson = await productResponse.json();
              const productData = responseJson.data || responseJson;
              
              
              const realImageId = 
                (productData.images && productData.images.length > 0 ? productData.images[0].id : null) || 
                productData.productImage || 
                productData.image;

              if (realImageId) {
                
                response = await fetch(`${BASE_URL}/images/image/download/${realImageId}`);
              } else {
                throw new Error("No image associated with this product");
              }
            } else {
                console.warn(`Fallback fetch failed with status: ${productResponse.status}`);
            }
          } catch (innerErr) {
            console.warn("Product fallback fetch failed:", innerErr);
            
          }
        }

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
        
        if (err.message !== "Failed to load image") {
             console.error("Error inside ProductImage:", err);
        }
        if (isMounted) {
          setError(true);
          setIsLoading(false);
        }
      }
    };

    fetchProductImage(productId);

    return () => {
      isMounted = false;
    };
  }, [productId, BASE_URL]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.placeholder}>
          
          <span>...</span> 
        </div>
      </div>
    );
  }

  if (error || !productImg) {
    return (
      <div className={styles.container}>
        <div className={styles.placeholder}>
          <span style={{fontSize: '0.8rem'}}>No Image</span>
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