import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { FaTrash, FaEdit } from "react-icons/fa";

import { deleteProduct } from "../../store/features/productSlice";
import ProductImage from "../utils/ProductImage";

import styles from "./ProductCard.module.css";

const ProductCard = ({ products }) => {
  const dispatch = useDispatch();
  
  const userRoles = useSelector((state) => state.auth.roles);
  const isAdmin = userRoles.includes("ROLE_ADMIN");

  const handleDelete = async (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const result = await dispatch(deleteProduct(productId)).unwrap();
        toast.success(result.message || "Product deleted");
      } catch (error) {
        toast.error(error.message || "Failed to delete product");
      }
    }
  };

  if (!products || products.length === 0) {
    return <div className="text-center p-5">No products found.</div>;
  }

  return (
    <div className={styles.gridContainer}>
      {products.map((product) => (
        <div className={styles.card} key={product.id}>
          
          {/* Image Area */}
          <Link to={`/product/${product.id}/details`} className={styles.imageWrapper}>
            {product.images.length > 0 ? (
              <ProductImage productId={product.images[0].id} />
            ) : (
              <span className="text-muted">No Image</span>
            )}
          </Link>

          {/* Body */}
          <div className={styles.cardBody}>
            <Link to={`/product/${product.id}/details`} className={styles.productTitle}>
              {product.name}
            </Link>
            
            <p className={styles.description}>
              {product.description}
            </p>

            <div className={styles.price}>
              ₹{product.price}
            </div>

            <div className={styles.stockWrapper}>
              {product.inventory > 0 ? (
                <span style={{ color: "#28a745", fontWeight: "600", fontSize: "0.85rem" }}>
                  In Stock
                </span>
              ) : (
                <span style={{ color: "#dc3545", fontWeight: "600", fontSize: "0.85rem" }}>
                  Out of Stock
                </span>
              )}
            </div>
            <div className={styles.actions}>
              <Link
                to={`/product/${product.id}/details`}
                className={styles.addToCartBtn}
              >
                View Details
              </Link>

              {/* Admin Controls */}
              {isAdmin && (
                <div className={styles.adminActions}>
                  <Link 
                    to={`/update-product/${product.id}/update`}
                    className={styles.iconBtn}
                    title="Edit Product"
                  >
                    <FaEdit size={14} />
                  </Link>
                  
                  <button 
                    onClick={() => handleDelete(product.id)}
                    className={`${styles.iconBtn} ${styles.deleteBtn}`}
                    title="Delete Product"
                    type="button"
                  >
                    <FaTrash size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCard;

ProductCard.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      inventory: PropTypes.number,
      images: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        })
      ),
    })
  ),
};