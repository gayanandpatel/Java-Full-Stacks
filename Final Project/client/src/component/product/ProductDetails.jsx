import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaShoppingCart, FaStar } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";

// Actions
import { getProductById, setQuantity } from "../../store/features/productSlice";
import { addToCart } from "../../store/features/cartSlice";

// Components
import ImageZoomify from "../common/ImageZoomify";
import QuantityUpdater from "../utils/QuantityUpdater";
import StockStatus from "../utils/StockStatus";
import ProductImage from "../utils/ProductImage"; // Reused for thumbnails
import LoadSpinner from "../common/LoadSpinner";

// Styles
import styles from "./ProductDetails.module.css";

const ProductDetails = () => {
  const { productId } = useParams();
  const dispatch = useDispatch();

  // Redux State
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const { product, quantity, isLoading } = useSelector((state) => state.product);
  
  // Local State for Gallery
  const [activeImageId, setActiveImageId] = useState(null);

  useEffect(() => {
    dispatch(getProductById(productId));
  }, [dispatch, productId]);

  // Set default active image when product loads
  useEffect(() => {
    if (product?.images?.length > 0) {
      setActiveImageId(product.images[0].id);
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to shop.");
      return;
    }
    try {
      await dispatch(addToCart({ productId, quantity })).unwrap();
      toast.success("Added to cart successfully!");
    } catch (error) {
      toast.error(error.message || "Could not add to cart");
    }
  };

  const handleIncreaseQuantity = () => {
    dispatch(setQuantity(quantity + 1));
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      dispatch(setQuantity(quantity - 1));
    }
  };

  if (isLoading) return <LoadSpinner />;
  if (!product) return <div className="text-center mt-5">Product not found</div>;

  const productOutOfStock = product.inventory <= 0;

  return (
    <div className={styles.pageContainer}>
      <ToastContainer position="bottom-right" />
      
      <div className={styles.productGrid}>
        
        {/* --- Left: Interactive Gallery --- */}
        <div className={styles.gallerySection}>
          {/* Main Large Image */}
          <div className={styles.mainImageWrapper}>
            {activeImageId ? (
              <ImageZoomify productId={activeImageId} />
            ) : (
              <span style={{color: '#999'}}>No Image Available</span>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.images && product.images.length > 1 && (
            <div className={styles.thumbnailList}>
              {product.images.map((img) => (
                <div 
                  key={img.id}
                  className={`${styles.thumbnail} ${activeImageId === img.id ? styles.activeThumb : ''}`}
                  onClick={() => setActiveImageId(img.id)}
                >
                  {/* Using ProductImage just to fetch/render the small img tag */}
                  <ProductImage productId={img.id} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- Right: Product Info --- */}
        <div className={styles.infoSection}>
          <span className={styles.brandLabel}>{product.brand || "Generic Brand"}</span>
          <h1 className={styles.productName}>{product.name}</h1>

          {/* Placeholder Rating */}
          <div className={styles.ratingRow}>
            <div className={styles.stars}>
              <FaStar /><FaStar /><FaStar /><FaStar /><FaStar style={{color: '#ddd'}}/>
            </div>
            <span>(4.0 Reviews)</span>
          </div>

          <div className={styles.priceRow}>
            <span className={styles.price}>${product.price}</span>
            <div className={styles.stockLabel}>
              <StockStatus inventory={product.inventory} />
            </div>
          </div>

          <div className={styles.descriptionTitle}>Description</div>
          <p className={styles.description}>{product.description}</p>

          {/* Actions */}
          <div className={styles.actionsWrapper}>
            
            <div className={styles.qtyWrapper}>
              <span className={styles.qtyLabel}>Quantity:</span>
              <QuantityUpdater
                quantity={quantity}
                onDecrease={handleDecreaseQuantity}
                onIncrease={handleIncreaseQuantity}
                disabled={productOutOfStock}
              />
            </div>

            <div className={styles.btnRow}>
              <button
                className={`${styles.addToCartBtn} ${productOutOfStock ? styles.btnDisabled : ''}`}
                onClick={handleAddToCart}
                disabled={productOutOfStock}
              >
                <FaShoppingCart />
                {productOutOfStock ? "Out of Stock" : "Add to Cart"}
              </button>
              
              <button 
                className={`${styles.buyNowBtn} ${productOutOfStock ? styles.btnDisabled : ''}`}
                disabled={productOutOfStock}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;