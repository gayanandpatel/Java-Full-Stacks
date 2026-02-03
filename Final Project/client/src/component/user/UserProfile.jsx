import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { nanoid } from "nanoid";

import { 
  FaTrash, FaEdit, FaPlus, FaMapMarkerAlt, 
  FaSortAmountDown, FaSortAmountUp, FaBoxOpen, FaShoppingBag,
  FaExclamationCircle
} from "react-icons/fa";

import { fetchUserOrders } from "../../store/features/orderSlice";
import {
  updateAddress,
  addAddress,
  deleteAddress,
  setUserAddresses,
  getUserById,
} from "../../store/features/userSlice";

import AddressForm from "../common/AddressForm";
import LoadSpinner from "../common/LoadSpinner";
import ProductImage from "../utils/ProductImage"; 
import placeholder from "../../assets/images/placeholder.png";

import styles from "./UserProfile.module.css";

const UserProfile = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  
  const user = useSelector((state) => state.user.user);
  const loading = useSelector((state) => state.order.loading);
  const orders = useSelector((state) => state.order.orders);

  const [isEditing, setIsEditing] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [sortOrder, setSortOrder] = useState("desc");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState(null);

  const [newAddress, setNewAddress] = useState({
    addressType: "",
    street: "",
    city: "",
    state: "",
    country: "",
    mobileNumber: "",
  });

  const sortedOrders = [...(orders || [])].sort((a, b) => {
    if (!a || !b) return 0;
    const dateA = new Date(a.orderDate);
    const dateB = new Date(b.orderDate);
    const diff = dateA - dateB;
    if (diff !== 0) return sortOrder === "asc" ? diff : -diff;
    return sortOrder === "asc" ? parseInt(a.id) - parseInt(b.id) : parseInt(b.id) - parseInt(a.id);
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
    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleAddAddress = async () => {
    const updatedAddressList = [ ...user.addressList, { ...newAddress, id: nanoid() } ];
    dispatch(setUserAddresses(updatedAddressList));
    try {
      const response = await dispatch(addAddress({ address: newAddress, userId })).unwrap();
      toast.success(response.message);
      resetForm();
    } catch (error) {
      console.error(error);
      dispatch(setUserAddresses(user.addressList));
    }
  };

  const handleUpdateAddress = async (id) => {
    const updatedAddressList = user.addressList.map((address) =>
      address.id === id ? { ...newAddress, id } : address
    );
    dispatch(setUserAddresses(updatedAddressList));
    try {
      const response = await dispatch(updateAddress({ id, userId, address: newAddress })).unwrap();
      toast.success(response.message);
      resetForm();
    } catch (error) {
      toast.error(error.message);
      dispatch(setUserAddresses(user.addressList));
    }
  };


  //  Opens the modal
  const openDeleteModal = (id) => {
    setAddressToDelete(id);
    setShowDeleteModal(true);
  };

  // Closes the modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setAddressToDelete(null);
  };

  // Performs the actual delete (Async)
  const confirmDelete = async () => {
    if (!addressToDelete) return;

    // Close modal immediately for UX responsiveness
    setShowDeleteModal(false);

    // Optimistic UI Update
    const updatedAddressList = user.addressList.filter(
      (address) => address.id !== addressToDelete
    );
    dispatch(setUserAddresses(updatedAddressList));

    try {
      // Pass userId so the slice can re-fetch profile
      const response = await dispatch(deleteAddress({ id: addressToDelete, userId })).unwrap();
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message || "Failed to delete");
      dispatch(getUserById(userId)); 
    } finally {
      setAddressToDelete(null);
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

  useEffect(() => {
    if (userId) dispatch(getUserById(userId));
    dispatch(fetchUserOrders(userId));
  }, [userId, dispatch]);

  const getStatusClass = (status) => {
    const key = status ? status.toUpperCase() : "PENDING";
    return styles[`status_${key}`] || styles.status_PENDING;
  };

  if (loading) return <LoadSpinner />;

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" />
      
      {/* --- DELETE CONFIRMATION MODAL --- */}
      {showDeleteModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <FaExclamationCircle className={styles.modalIcon} />
            <h3 className={styles.modalTitle}>Delete Address?</h3>
            <p className={styles.modalText}>
              Are you sure you want to delete this address? This action cannot be undone.
            </p>
            <div className={styles.modalActions}>
              <button 
                className={`${styles.modalBtn} ${styles.cancelBtn}`}
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button 
                className={`${styles.modalBtn} ${styles.confirmBtn}`}
                onClick={confirmDelete}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <h2 className={styles.pageTitle}>My Dashboard</h2>

      {user ? (
        <div className={styles.dashboardGrid}>
          
          <aside className={styles.profileCard}>
            <img src={user.photo || placeholder} alt="User" className={styles.avatar} />
            <h3 className={styles.userName}>{user.firstName} {user.lastName}</h3>
            <p className={styles.userEmail}>{user.email}</p>
            <div className={styles.divider}></div>
            <div style={{color: '#888', fontSize: '0.9rem'}}>
              Member since {new Date().getFullYear()}
            </div>
          </aside>

          <main className={styles.mainContent}>
            
            <section className={styles.contentSection}>
              <div className={styles.sectionHeader}>
                <h4 className={styles.sectionTitle}>My Addresses</h4>
                <button 
                  className={styles.addAddressBtn}
                  onClick={() => { resetForm(); setShowForm(!showForm); }}
                >
                  <FaPlus /> {showForm ? "Close Form" : "Add New"}
                </button>
              </div>

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
                          onClick={() => openDeleteModal(address.id)}
                          title="Delete Address"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No addresses saved yet.</p>
                )}
              </div>
            </section>

            <section className={styles.contentSection}>
               <div className={styles.sectionHeader}>
                <h4 className={styles.sectionTitle}>Order History</h4>
                   {orders && orders.length > 0 && (
                  <div className={styles.sortControls}>
                    <button 
                      className={`${styles.sortBtn} ${sortOrder === 'desc' ? styles.activeSort : ''}`}
                      onClick={() => setSortOrder('desc')}
                    >
                      Newest <FaSortAmountDown />
                    </button>
                    <button 
                      className={`${styles.sortBtn} ${sortOrder === 'asc' ? styles.activeSort : ''}`}
                      onClick={() => setSortOrder('asc')}
                    >
                      Oldest <FaSortAmountUp />
                    </button>
                  </div>
                )}
              </div>

              <div className={styles.ordersList}>
                {sortedOrders && sortedOrders.length > 0 ? (
                  sortedOrders.map((order, index) => {
                    if (!order) return null;
                    return (
                      <div key={order.id || index} className={styles.orderCard}>
                         {/* Order Header */}
                        <div className={styles.orderHeader}>
                          <div className={styles.orderMeta}>
                            <div className={styles.metaGroup}>
                              <span className={styles.metaLabel}>Order Placed</span>
                              <span className={styles.metaValue}>
                                {new Date(order.orderDate).toLocaleDateString("en-US", {
                                  year: 'numeric', month: 'short', day: 'numeric'
                                })}
                              </span>
                            </div>
                            <div className={styles.metaGroup}>
                              <span className={styles.metaLabel}>Total</span>
                              <span className={styles.metaValue}>
                                ₹{order.totalAmount?.toFixed(2)}
                              </span>
                            </div>
                            <div className={styles.metaGroup}>
                              <span className={styles.metaLabel}>Order ID</span>
                              <span className={styles.orderId}>#{order.id}</span>
                            </div>
                          </div>
                          
                          <div className={styles.orderStatusWrapper}>
                             <span className={`${styles.statusBadge} ${getStatusClass(order.orderStatus)}`}>
                               {order.orderStatus || "Processing"}
                             </span>
                          </div>
                        </div>

                        {/* Order Items */}
                        <div className={styles.itemsContainer}>
                          {Array.isArray(order.items) && order.items.map((item, i) => (
                            <div key={i} className={styles.itemRow}>
                              <div className={styles.itemImage}>
                                <ProductImage 
                                  productId={item.productId} 
                                />
                              </div>
                              <div className={styles.itemDetails}>
                                <Link to={`/product/${item.productId}/details`} className={styles.productLink}>
                                  {item.productName}
                                </Link>
                                <div className={styles.itemSubDetail}>
                                  <span>{item.productBrand}</span>
                                  <span className={styles.separator}>|</span>
                                  <span>Qty: {item.quantity}</span>
                                </div>
                              </div>
                              <div className={styles.itemPrice}>
                                ₹{item.price?.toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>

                      </div>
                    );
                  })
                ) : (
                  <div className={styles.emptyOrders}>
                    <FaBoxOpen className={styles.emptyIcon} />
                    <p>No orders found yet.</p>
                    <Link to="/products" className={styles.shopBtn}>
                      Start Shopping <FaShoppingBag style={{marginLeft: '8px'}}/>
                    </Link>
                  </div>
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