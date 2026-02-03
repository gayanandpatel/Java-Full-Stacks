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
        
        // 1. Try to fetch the image assuming 'id' is a direct Image ID
        let response = await fetch(
          `${BASE_URL}/images/image/download/${id}`
        );

        // 2. If 404 (Not Found), it likely means 'id' is a Product ID, not an Image ID.
        // We need to fetch the Product Details to find the real Image ID.
        if (response.status === 404) {
          try {
            // FIX: Updated endpoint to match productSlice.js structure
            // Old (Broken): ${BASE_URL}/products/${id}
            // New (Correct): ${BASE_URL}/products/product/${id}/product
            const productResponse = await fetch(`${BASE_URL}/products/product/${id}/product`);
            
            if (productResponse.ok) {
              const responseJson = await productResponse.json();
              const productData = responseJson.data || responseJson; // Handle potential wrapper
              
              // Extract the first image ID
              const realImageId = 
                (productData.images && productData.images.length > 0 ? productData.images[0].id : null) || 
                productData.productImage || 
                productData.image;

              if (realImageId) {
                // Retry download with the correct Image ID
                response = await fetch(`${BASE_URL}/images/image/download/${realImageId}`);
              } else {
                // No image found in product details
                throw new Error("No image associated with this product");
              }
            } else {
                console.warn(`Fallback fetch failed with status: ${productResponse.status}`);
            }
          } catch (innerErr) {
            console.warn("Product fallback fetch failed:", innerErr);
            // We don't throw here, we let the original response check below handle the failure
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
        // Only log errors if they aren't standard 404s to reduce console noise
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
          {/* Optional: Add a small spinner here */}
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