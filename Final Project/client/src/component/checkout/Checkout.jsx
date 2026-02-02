import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom"; 
import { getUserCart } from "../../store/features/cartSlice";
import { getUserById } from "../../store/features/userSlice"; 
import {
  placeOrder,
  createPaymentIntent,
} from "../../store/features/orderSlice";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { toast, ToastContainer } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { FaCheckCircle, FaRegCircle } from "react-icons/fa"; 


import styles from "./Checkout.module.css";


const COUNTRY_OPTIONS = [
  { code: "IN", name: "India" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
];

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { userId } = useSelector((state) => state.auth);

  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user.user); 

  const stripe = useStripe();
  const elements = useElements();

  const [cardError, setCardError] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null); 

  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [billingAddress, setBillingAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  // Load Cart AND User Data
  useEffect(() => {
    if (userId) {
      dispatch(getUserCart(userId));
      dispatch(getUserById(userId)); 
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (user) {
      setUserInfo({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setBillingAddress({ ...billingAddress, [name]: value });
    setSelectedAddressId(null); 
  };

  const handleSelectSavedAddress = (address) => {
    setBillingAddress({
      street: address.street,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode || address.zipCode,
      country: address.country,
    });
    setSelectedAddressId(address.id);
  };

  const stripeElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        fontFamily: "Inter, sans-serif",
        "::placeholder": { color: "#aab7c4" },
      },
      invalid: { color: "#dc3545" },
    },
  };

  const handlePaymentAndOrder = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (!stripe || !elements) {
      toast.error("Payment system not ready. Please try again.");
      setLoading(false);
      return;
    }

    const cardElement = elements.getElement(CardElement);

    try {
      const { clientSecret } = await dispatch(
        createPaymentIntent({
          amount: Math.round(cart.totalAmount), 
          currency: "inr",
        })
      ).unwrap();

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: cardElement,
            billing_details: {
              name: `${userInfo.firstName} ${userInfo.lastName}`,
              email: userInfo.email,
              address: {
                line1: billingAddress.street,
                city: billingAddress.city,
                state: billingAddress.state,
                country: billingAddress.country,
                postal_code: billingAddress.postalCode,
              },
            },
          },
        }
      );

      if (error) {
        setCardError(error.message);
        toast.error(error.message);
        setLoading(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        await dispatch(placeOrder({ userId })).unwrap();
        toast.success("Order placed successfully!");
        setTimeout(() => {
          navigate(`/user-profile/${userId}/profile`);
        }, 2000);
      }
    } catch (error) {
      toast.error(`Error: ${error.message || "Something went wrong"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.checkoutContainer}>
      <ToastContainer position="top-center" />
      <h2 className={styles.pageTitle}>Secure Checkout</h2>

      <div className={styles.layoutGrid}>
        {/* --- LEFT COLUMN: Input Forms --- */}
        <div className={styles.formSection}>
          <form onSubmit={handlePaymentAndOrder}>
            
            {/* Customer Information */}
            <div className={styles.sectionHeader}>
              <span>1</span> Customer Information
            </div>
            
            <div className={styles.row}>
              <div className={styles.col}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>First Name</label>
                  <input type="text" name="firstName" className={styles.input} value={userInfo.firstName} onChange={handleInputChange} required />
                </div>
              </div>
              <div className={styles.col}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Last Name</label>
                  <input type="text" name="lastName" className={styles.input} value={userInfo.lastName} onChange={handleInputChange} required />
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input type="email" name="email" className={styles.input} value={userInfo.email} onChange={handleInputChange} required />
            </div>

            {/* Billing Address */}
            <div className={styles.sectionHeader} style={{marginTop: '30px'}}>
              <span>2</span> Billing / Shipping Address
            </div>

            {/* Saved Address Selector */}
            {user?.addressList?.length > 0 && (
              <div className={styles.savedAddressContainer}>
                <p className={styles.subLabel}>Select a saved address:</p>
                <div className={styles.addressGrid}>
                  {user.addressList.map((addr) => (
                    <div 
                      key={addr.id} 
                      className={`${styles.addressCard} ${selectedAddressId === addr.id ? styles.activeCard : ''}`}
                      onClick={() => handleSelectSavedAddress(addr)}
                    >
                      <div className={styles.cardHeader}>
                        <span className={styles.addrType}>{addr.addressType || "Address"}</span>
                        {selectedAddressId === addr.id ? <FaCheckCircle color="#c38212"/> : <FaRegCircle color="#ccc"/>}
                      </div>
                      <div className={styles.addrText}>
                        {addr.street}<br/>
                        {addr.city}, {addr.state} {addr.postalCode}<br/>
                        {addr.country}
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.dividerText}><span>OR ENTER NEW</span></div>
              </div>
            )}

            {/* Manual Address Form */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Street Address</label>
              <input type="text" name="street" className={styles.input} value={billingAddress.street} onChange={handleAddressChange} required />
            </div>

            <div className={styles.row}>
              <div className={styles.col}>
                <label className={styles.label}>City</label>
                <input type="text" name="city" className={styles.input} value={billingAddress.city} onChange={handleAddressChange} required />
              </div>
              <div className={styles.col}>
                <label className={styles.label}>State / Province</label>
                <input type="text" name="state" className={styles.input} value={billingAddress.state} onChange={handleAddressChange} required />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.col}>
                <label className={styles.label}>Postal Code</label>
                <input type="text" name="postalCode" className={styles.input} value={billingAddress.postalCode} onChange={handleAddressChange} required />
              </div>
              <div className={styles.col}>
                <label className={styles.label}>Country</label>
                <select name="country" className={styles.input} value={billingAddress.country} onChange={handleAddressChange} required>
                  <option value="">Select Country</option>
                  {COUNTRY_OPTIONS.map((country) => (
                    <option key={country.code} value={country.code}>{country.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Payment Details */}
            <div className={styles.sectionHeader} style={{marginTop: '30px'}}>
              <span>3</span> Payment Details
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Credit or Debit Card</label>
              <div className={styles.stripeContainer}>
                <CardElement options={stripeElementOptions} onChange={(e) => setCardError(e.error ? e.error.message : "")} />
              </div>
              {cardError && <div className={styles.cardError}>{cardError}</div>}
            </div>
          </form>
        </div>

        {/* --- RIGHT COLUMN: Summary --- */}
        <div className={styles.summaryCard}>
          <h3 className={styles.summaryTitle}>Order Summary</h3>
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>₹{cart.totalAmount?.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Tax (Estimated)</span>
            <span>₹0.00</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping</span>
            <span>Free</span>
          </div>
          <div className={styles.totalRow}>
            <span>Total</span>
            <span>₹{cart.totalAmount?.toFixed(2)}</span>
          </div>

          <button
            type="button"
            className={styles.payBtn}
            disabled={!stripe || loading}
            onClick={handlePaymentAndOrder}
          >
            {loading ? <ClipLoader size={20} color={"#ffffff"} /> : `Pay ₹${cart.totalAmount?.toFixed(2)}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;