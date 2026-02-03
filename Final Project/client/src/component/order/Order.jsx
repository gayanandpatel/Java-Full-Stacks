import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchUserOrders } from "../../store/features/orderSlice";
import { ToastContainer } from "react-toastify";


import ProductImage from "../utils/ProductImage";
import LoadSpinner from "../common/LoadSpinner";

import styles from "./Order.module.css";

const Order = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  
  const orders = useSelector((state) => state.order.orders);
  const loading = useSelector((state) => state.order.loading);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserOrders(userId));
    }
  }, [dispatch, userId]);

  if (loading) {
    return <LoadSpinner />;
  }

  // Helper to format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper to get status class
  const getStatusClass = (status) => {
    const statusKey = status ? status.toUpperCase() : "PENDING";
    return styles[`status_${statusKey}`] || styles.status_PENDING;
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="bottom-right" />
      
      <h2 className={styles.pageTitle}>Order History</h2>

      {orders.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyText}>You haven&apos;t placed any orders yet.</p>
          <Link to="/products" className={styles.shopBtn}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className={styles.orderList}>
          {orders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              
              {/* Card Header: Order Summary */}
              <div className={styles.cardHeader}>
                <div className={styles.headerGroup}>
                  <span className={styles.label}>Order Placed</span>
                  <span className={styles.value}>{formatDate(order.orderDate)}</span>
                </div>
                
                <div className={styles.headerGroup}>
                  <span className={styles.label}>Total Amount</span>
                  <span className={styles.value}>₹{order.totalAmount.toFixed(2)}</span>
                </div>
                
                <div className={styles.headerGroup}>
                  <span className={styles.label}>Order ID</span>
                  <span className={`${styles.value} ${styles.orderId}`}>#{order.id}</span>
                </div>

                <div className={styles.headerGroup}>
                   <span className={`${styles.statusBadge} ${getStatusClass(order.status)}`}>
                     {order.status || "Processing"}
                   </span>
                </div>
              </div>

              {/* Card Body: Items List */}
              <div className={styles.cardBody}>
                {order.items.map((item, index) => (
                  <div key={index} className={styles.itemRow}>
                    
                    {/* Item Image */}
                    <div className={styles.imageWrapper}>
                      {/* Using ProductImage component to fetch image by ID */}
                      <ProductImage productId={item.productId} />
                    </div>

                    {/* Item Details */}
                    <div className={styles.itemDetails}>
                      <span className={styles.itemName}>{item.productName}</span>
                      <div className={styles.itemMeta}>
                        Brand: {item.productBrand}
                      </div>
                    </div>

                    {/* Price & Qty */}
                    <div className={styles.itemPrice}>
                      <span className={styles.price}>₹{item.price.toFixed(2)}</span>
                      <span className={styles.qty}>Qty: {item.quantity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;