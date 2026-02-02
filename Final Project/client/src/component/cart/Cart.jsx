import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserCart,
  updateQuantity,
  removeItemFromCart,
} from "../../store/features/cartSlice";
import ProductImage from "../utils/ProductImage";
import QuantityUpdater from "../utils/QuantityUpdater";
import LoadSpinner from "../common/LoadSpinner";
import { toast, ToastContainer } from "react-toastify";


import { FaTrash } from "react-icons/fa"; 


import styles from "./Cart.module.css";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userId } = useSelector((state) => state.auth);
  const cart = useSelector((state) => state.cart);
  const cartId = useSelector((state) => state.cart.cartId);
  const isLoading = useSelector((state) => state.cart.isLoading);

  useEffect(() => {
    if (userId) {
      dispatch(getUserCart(userId));
    }
  }, [dispatch, userId]);

  const handleIncreaseQuantity = (itemId) => {
    const item = cart.items.find((item) => item.product.id === itemId);
    if (item && cartId) {
      dispatch(
        updateQuantity({
          cartId,
          itemId,
          newQuantity: item.quantity + 1,
        })
      );
    }
  };

  const handleDecreaseQuantity = (itemId) => {
    const item = cart.items.find((item) => item.product.id === itemId);
    if (item && item.quantity > 1) {
      dispatch(
        updateQuantity({
          cartId,
          itemId,
          newQuantity: item.quantity - 1,
        })
      );
    }
  };

  const handleRemoveItem = (itemId) => {
    try {
      dispatch(removeItemFromCart({ cartId, itemId }));
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePlaceOrder = async () => {
    navigate("/checkout");
  };

  if (isLoading) {
    return <LoadSpinner />;
  }

  return (
    <div className={styles.wrapper}>
      <ToastContainer />

      {cart.items.length === 0 ? (
        <div className={styles.emptyState}>
          <h3>Your cart is empty</h3>
          <Link to={"/products"} className={styles.checkoutBtn} style={{ maxWidth: '200px', margin: '0 auto' }}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <>
          <h2 className={styles.heading}>Shopping Cart ({cart.items.length} items)</h2>
          
          <div className={styles.layout}>
            
            <div className={styles.cartList}>
              
              <div className={`d-none d-md-grid ${styles.headerRow}`}>
                <div>Product</div>
                <div>Description</div>
                <div>Brand</div>
                <div>Quantity</div>
                <div>Total</div>
                <div></div>
              </div>

              {cart.items.map((item, index) => (
                <div key={index} className={styles.cartItem}>
                  {/* Image Column */}
                  <div className={styles.imageWrapper}>
                    <Link to={`/products/${item.product?.id}`}>
                      {item.product?.images?.length > 0 && (
                        <ProductImage productId={item.product?.images[0].id} />
                      )}
                    </Link>
                  </div>

                  {/* Name Column */}
                  <div className={styles.itemMeta}>
                    <Link to={`/products/${item.product?.id}`} className={styles.itemName}>
                      {item.product?.name}
                    </Link>
                    <span className="d-md-none text-muted">{item.product?.brand}</span>
                    <span className="d-md-none mt-2">${item.product?.price?.toFixed(2)} / unit</span>
                  </div>

                  {/* Brand Column (Desktop) */}
                  <div className={`d-none d-md-block ${styles.itemBrand}`}>
                    {item.product?.brand}
                  </div>

                   {/* Quantity Column */}
                  <div>
                    <QuantityUpdater
                      quantity={item.quantity}
                      onDecrease={() => handleDecreaseQuantity(item.product.id)}
                      onIncrease={() => handleIncreaseQuantity(item.product.id)}
                    />
                  </div>

                  {/* Total Price Column */}
                  <div className={styles.totalPrice}>
                    ₹{item.totalPrice?.toFixed(2)}
                  </div>

                  {/* Action Column - FIXED: Using FaTrash Icon */}
                  <div className="text-end">
                    <button 
                      className={styles.removeBtn} 
                      onClick={() => handleRemoveItem(item.product.id)}
                      title="Remove Item"
                    >
                      <FaTrash size={16} /> 
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Order Summary */}
            <div className={styles.summaryCard}>
              <div className={styles.summaryHeader}>Order Summary</div>
              
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span className="fw-bold">₹{cart.totalAmount?.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Tax estimate</span>
                <span>₹0.00</span>
              </div>

              <div className={styles.summaryTotal}>
                <span>Total</span>
                <span>₹{cart.totalAmount?.toFixed(2)}</span>
              </div>

              <button onClick={handlePlaceOrder} className={styles.checkoutBtn}>
                Proceed to Checkout
              </button>
              
              <Link to={"/products"} className={styles.continueLink}>
                or Continue Shopping
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;