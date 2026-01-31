import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getUserCart } from "../../store/features/cartSlice";
import {
  placeOrder,
  createPaymentIntent,
} from "../../store/features/orderSlice";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { toast, ToastContainer } from "react-toastify";
import { ClipLoader } from "react-spinners";

// Styles
import styles from "./Checkout.module.css";

// ISO 3166-1 alpha-2 Country Codes for Stripe
const COUNTRY_OPTIONS = [
  { code: "IN", name: "India" },
  { code: "US", name: "United States" },
  { code: "GB", name: "United Kingdom" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "DE", name: "Germany" },
  { code: "FR", name: "France" },
  { code: "JP", name: "Japan" },
  { code: "BR", name: "Brazil" },
  { code: "CN", name: "China" },
  { code: "IT", name: "Italy" },
  { code: "ES", name: "Spain" },
  { code: "MX", name: "Mexico" },
  { code: "RU", name: "Russia" },
  { code: "ZA", name: "South Africa" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "SG", name: "Singapore" },
  // You can add more countries here as needed
];

const Checkout = () => {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const navigate = useNavigate();

  // Redux State
  const cart = useSelector((state) => state.cart);

  // Stripe Hooks
  const stripe = useStripe();
  const elements = useElements();

  // Local State
  const [cardError, setCardError] = useState("");
  const [loading, setLoading] = useState(false);

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
    country: "", // This will now store the 2-letter code (e.g., "IN")
  });

  // Load Cart
  useEffect(() => {
    dispatch(getUserCart(userId));
  }, [dispatch, userId]);

  // Handlers
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleAddressChange = (event) => {
    const { name, value } = event.target;
    setBillingAddress({ ...billingAddress, [name]: value });
  };

  // Custom Stripe Element Styling
  const stripeElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#424770",
        fontFamily: "Inter, sans-serif",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#dc3545",
      },
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
      // 1. Create Payment Intent
      const { clientSecret } = await dispatch(
        createPaymentIntent({
          amount: Math.round(cart.totalAmount * 100), // Ensure amount is in cents
          currency: "usd",
        })
      ).unwrap();

      // 2. Confirm Card Payment
      // Note: We are passing billingAddress.country which now holds the code "US", "IN", etc.
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
                country: billingAddress.country, // Correct ISO code passed here
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

      // 3. Place Order on Backend
      if (paymentIntent.status === "succeeded") {
        await dispatch(placeOrder({ userId })).unwrap();
        toast.success("Order placed successfully!");
        
        setTimeout(() => {
          window.location.href = `/user-profile/${userId}/profile`;
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
            
            {/* 1. Customer Info */}
            <div className={styles.sectionHeader}>
              <span>1</span> Customer Information
            </div>
            
            <div className={styles.row}>
              <div className={styles.col}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName" className={styles.label}>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    className={styles.input}
                    value={userInfo.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className={styles.col}>
                <div className={styles.formGroup}>
                  <label htmlFor="lastName" className={styles.label}>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    className={styles.input}
                    value={userInfo.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input
                type="email"
                name="email"
                id="email"
                className={styles.input}
                value={userInfo.email}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* 2. Billing Address */}
            <div className={styles.sectionHeader} style={{marginTop: '30px'}}>
              <span>2</span> Billing Address
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Street Address</label>
              <input
                type="text"
                name="street"
                className={styles.input}
                value={billingAddress.street}
                onChange={handleAddressChange}
                required
              />
            </div>

            <div className={styles.row}>
              <div className={styles.col}>
                <label className={styles.label}>City</label>
                <input
                  type="text"
                  name="city"
                  className={styles.input}
                  value={billingAddress.city}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className={styles.col}>
                <label className={styles.label}>State / Province</label>
                <input
                  type="text"
                  name="state"
                  className={styles.input}
                  value={billingAddress.state}
                  onChange={handleAddressChange}
                  required
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.col}>
                <label className={styles.label}>Postal Code</label>
                <input
                  type="text"
                  name="postalCode"
                  className={styles.input}
                  value={billingAddress.postalCode}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div className={styles.col}>
                <label className={styles.label}>Country</label>
                {/* CHANGED: Replaced input with Select for Stripe Compatibility */}
                <select
                  name="country"
                  className={styles.input} // Reuses existing input styles
                  value={billingAddress.country}
                  onChange={handleAddressChange}
                  required
                >
                  <option value="">Select Country</option>
                  {COUNTRY_OPTIONS.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 3. Payment Details */}
            <div className={styles.sectionHeader} style={{marginTop: '30px'}}>
              <span>3</span> Payment Details
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.label}>Credit or Debit Card</label>
              <div className={styles.stripeContainer}>
                <CardElement
                  options={stripeElementOptions}
                  onChange={(event) => {
                    setCardError(event.error ? event.error.message : "");
                  }}
                />
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
            <span>${cart.totalAmount?.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Tax (Estimated)</span>
            <span>$0.00</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Shipping</span>
            <span>Free</span>
          </div>
          
          <div className={styles.totalRow}>
            <span>Total</span>
            <span>${cart.totalAmount?.toFixed(2)}</span>
          </div>

          <button
            type="button"
            className={styles.payBtn}
            disabled={!stripe || loading}
            onClick={handlePaymentAndOrder}
          >
            {loading ? (
              <ClipLoader size={20} color={"#ffffff"} />
            ) : (
              `Pay $${cart.totalAmount?.toFixed(2)}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;