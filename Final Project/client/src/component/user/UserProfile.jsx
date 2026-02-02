import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { nanoid } from "nanoid";

// Icons
import { FaTrash, FaEdit, FaPlus, FaMapMarkerAlt } from "react-icons/fa";

// Actions
import { fetchUserOrders } from "../../store/features/orderSlice";
import {
  updateAddress,
  addAddress,
  deleteAddress,
  setUserAddresses,
  getUserById,
} from "../../store/features/userSlice";

// Components
import AddressForm from "../common/AddressForm";
import LoadSpinner from "../common/LoadSpinner";
import placeholder from "../../assets/images/placeholder.png";

// Import Styles
import styles from "./UserProfile.module.css";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  
  // Redux Selectors
  const user = useSelector((state) => state.user.user);
  const loading = useSelector((state) => state.order.loading);
  const orders = useSelector((state) => state.order.orders);

  // Local State
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [newAddress, setNewAddress] = useState({
    addressType: "",
    street: "",
    city: "",
    state: "",
    country: "",
    mobileNumber: "",
  });

  // --- Address Handlers ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleEditClick = (address) => {
    setNewAddress(address);
    setIsEditing(true);
    setEditingAddressId(address.id);
    setShowForm(true);
    // Scroll to form for better UX
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleAddAddress = async () => {
    const updatedAddressList = [
      ...user.addressList,
      { ...newAddress, id: nanoid() },
    ];

    dispatch(setUserAddresses(updatedAddressList));
    try {
      const response = await dispatch(
        addAddress({ address: newAddress, userId })
      ).unwrap();
      toast.success(response.message);
      resetForm();
    } catch (error) {
      console.error(error);
      dispatch(setUserAddresses(user.addressList)); // Revert on error
    }
  };

  const handleUpdateAddress = async (id) => {
    const updatedAddressList = user.addressList.map((address) =>
      address.id === id ? { ...newAddress, id } : address
    );

    dispatch(setUserAddresses(updatedAddressList));

    try {
      const response = await dispatch(
        updateAddress({ id, address: newAddress })
      ).unwrap();
      toast.success(response.message);
      resetForm();
    } catch (error) {
      toast.error(error.message);
      dispatch(setUserAddresses(user.addressList));
    }
  };

  const handleDeleteAddress = async (id) => {
    if(!window.confirm("Are you sure you want to delete this address?")) return;

    const updatedAddressList = user.addressList.filter(
      (address) => address.id !== id
    );
    dispatch(setUserAddresses(updatedAddressList));

    try {
      const response = await dispatch(deleteAddress({ id })).unwrap();
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
      dispatch(setUserAddresses(user.addressList));
    }
  };

  const resetForm = () => {
    setNewAddress({
      addressType: "",
      street: "",
      city: "",
      state: "",
      country: "",
      mobileNumber: "",
    });
    setShowForm(false);
    setIsEditing(false);
    setEditingAddressId(null);
  };

  // --- Effects ---
  useEffect(() => {
    const fetchUser = async () => {
      if (userId) {
        try {
          await dispatch(getUserById(userId)).unwrap();
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchUser();
  }, [userId, dispatch]);

  useEffect(() => {
    dispatch(fetchUserOrders(userId));
  }, [dispatch, userId]);

  if (loading) return <LoadSpinner />;

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" />
      
      <h2 className={styles.pageTitle}>My Dashboard</h2>

      {user ? (
        <div className={styles.dashboardGrid}>
          
          {/* --- LEFT: Profile Sidebar --- */}
          <aside className={styles.profileCard}>
            <img
              src={user.photo || placeholder}
              alt="User"
              className={styles.avatar}
            />
            <h3 className={styles.userName}>
              {user.firstName} {user.lastName}
            </h3>
            <p className={styles.userEmail}>{user.email}</p>
            
            <div className={styles.divider}></div>
            
            <div style={{color: '#888', fontSize: '0.9rem'}}>
              Member since {new Date().getFullYear()}
            </div>
          </aside>

          {/* --- RIGHT: Main Content --- */}
          <main className={styles.mainContent}>
            
            {/* 1. Address Section */}
            <section>
              <div className={styles.sectionHeader}>
                <h4 className={styles.sectionTitle}>My Addresses</h4>
                <button 
                  className={styles.addAddressBtn}
                  onClick={() => {
                    resetForm();
                    setShowForm(!showForm);
                  }}
                >
                  <FaPlus /> {showForm ? "Close Form" : "Add New"}
                </button>
              </div>

              {/* Add/Edit Form */}
              {showForm && (
                <div className={styles.formWrapper}>
                  <AddressForm
                    address={newAddress}
                    onChange={handleInputChange}
                    onSubmit={
                      isEditing
                        ? () => handleUpdateAddress(editingAddressId)
                        : handleAddAddress
                    }
                    isEditing={isEditing}
                    onCancel={resetForm}
                    showButtons={true}
                    showCheck={true}
                    showTitle={true}
                    showAddressType={true}
                  />
                </div>
              )}

              {/* Address List Grid */}
              <div className={styles.addressGrid}>
                {user.addressList && user.addressList.length > 0 ? (
                  user.addressList.map((address) => (
                    <div key={address.id} className={styles.addressCard}>
                      <span className={styles.addressType}>
                        <FaMapMarkerAlt style={{marginRight: '5px'}}/> 
                        {address.addressType}
                      </span>
                      
                      <div className={styles.addressText}>
                        {address.street}<br />
                        {address.city}, {address.state} {address.country}<br />
                        {address.mobileNumber && <span>Phone: {address.mobileNumber}</span>}
                      </div>

                      <div className={styles.cardActions}>
                        <button 
                          className={`${styles.iconBtn} ${styles.editIcon}`}
                          onClick={() => handleEditClick(address)}
                          title="Edit Address"
                        >
                          <FaEdit />
                        </button>
                        <button 
                          className={`${styles.iconBtn} ${styles.deleteIcon}`}
                          onClick={() => handleDeleteAddress(address.id)}
                          title="Delete Address"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No addresses found. Please add one.</p>
                )}
              </div>
            </section>

            {/* 2. Order History Section */}
            <section>
              <div className={styles.sectionHeader}>
                <h4 className={styles.sectionTitle}>Recent Orders</h4>
                <Link to="/products" style={{fontSize: '0.9rem', color: '#c38212', textDecoration: 'none'}}>
                  Start Shopping
                </Link>
              </div>

              <div className={styles.ordersList}>
                {Array.isArray(orders) && orders.length > 0 ? (
                  orders.map((order, index) => {
                    // FIX: Safety check to skip null/undefined orders
                    if (!order) return null;

                    return (
                      <div key={order.id || index} className={styles.orderCard}>
                        
                        {/* Order Summary Header */}
                        <div className={styles.orderHeader}>
                          <div className={styles.orderMeta}>
                            <div className={styles.metaGroup}>
                              <span className={styles.metaLabel}>Order ID</span>
                              <span className={styles.metaValue}>#{order.id}</span>
                            </div>
                            <div className={styles.metaGroup}>
                              <span className={styles.metaLabel}>Date</span>
                              <span className={styles.metaValue}>
                                {new Date(order.orderDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className={styles.metaGroup}>
                              <span className={styles.metaLabel}>Total</span>
                              <span className={styles.metaValue}>
                                ₹{order.totalAmount?.toFixed(2)}
                              </span>
                            </div>
                          </div>
                          
                          <span className={styles.statusBadge}>
                            {order.orderStatus || "Processing"}
                          </span>
                        </div>

                        {/* Order Items Table */}
                        <div className={styles.orderTableWrapper}>
                          <table className={styles.orderTable}>
                            <thead>
                              <tr>
                                <th>Product</th>
                                <th>Brand</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th style={{textAlign: 'right'}}>Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Array.isArray(order.items) && order.items.map((item, i) => (
                                <tr key={i}>
                                  <td>{item.productName}</td>
                                  <td>{item.productBrand}</td>
                                  <td>{item.quantity}</td>
                                  <td>₹{item.price?.toFixed(2)}</td>
                                  <td style={{textAlign: 'right', fontWeight: '600'}}>
                                    ₹{(item.quantity * item.price).toFixed(2)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-muted">No orders found.</p>
                )}
              </div>
            </section>

          </main>
        </div>
      ) : (
        <div className="text-center py-5">
          <p>Loading user information...</p>
        </div>
      )}
    </div>
  );
};

export default UserProfile;