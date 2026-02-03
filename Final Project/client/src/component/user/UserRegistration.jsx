import { useState } from "react";
import { useDispatch } from "react-redux";
import { registerUser } from "../../store/features/userSlice";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import AddressForm from "../common/AddressForm";

import styles from "./UserRegistration.module.css";

const UserRegistration = () => {
  const dispatch = useDispatch();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [addresses, setAddresses] = useState([
    {
      country: "",
      state: "",
      city: "",
      street: "",
      mobileNumber: "",
      addressType: "HOME",
    },
  ]);

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAddresses = [...addresses];
    updatedAddresses[index] = { ...updatedAddresses[index], [name]: value };
    setAddresses(updatedAddresses);
  };

  const addAddress = () => {
    setAddresses([
      ...addresses,
      {
        country: "",
        state: "",
        city: "",
        street: "",
        mobileNumber: "",
        addressType: "HOME",
      },
    ]);
  };

  const removeAddress = (index) => {
    if (addresses.length === 1) {
      toast.warn("You must provide at least one address.");
      return;
    }
    const updatedAddresses = addresses.filter((_, i) => i !== index);
    setAddresses(updatedAddresses);
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    try {
      const response = await dispatch(
        registerUser({ user, addresses })
      ).unwrap();
      resetForm();
      toast.success(response.message || "Registration successful!");
    } catch (error) {
      toast.error(error.message || "Registration failed");
    }
  };

  const resetForm = () => {
    setUser({ firstName: "", lastName: "", email: "", password: "" });
    setAddresses([
      {
        country: "",
        state: "",
        city: "",
        street: "",
        mobileNumber: "",
        addressType: "HOME",
      },
    ]);
  };

  return (
    <div className={styles.container}>
      <ToastContainer position="top-right" />
      
      <div className={styles.formCard}>
        <h2 className={styles.title}>Create Account</h2>
        
        <form onSubmit={handleRegistration}>
          
          {/* User Details */}
          <div className={styles.row}>
            <div className={styles.col}>
              <div className={styles.formGroup}>
                <label htmlFor="firstName" className={styles.label}>First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className={styles.input}
                  value={user.firstName}
                  onChange={handleUserChange}
                  required
                />
              </div>
            </div>
            
            <div className={styles.col}>
              <div className={styles.formGroup}>
                <label htmlFor="lastName" className={styles.label}>Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className={styles.input}
                  value={user.lastName}
                  onChange={handleUserChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className={styles.input}
              value={user.email}
              onChange={handleUserChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className={styles.input}
              value={user.password}
              onChange={handleUserChange}
              required
            />
          </div>

          {/* Address Section */}
          <div className={styles.addressSection}>
            <h4 className={styles.sectionTitle}>Address Details</h4>
            
            {addresses.map((address, index) => (
              <div key={index} className={styles.addressCard}>
                <div className={styles.addressHeader}>
                  Address #{index + 1}
                </div>
                
                <AddressForm
                  address={address}
                  onChange={(e) => handleAddressChange(index, e)}
                  onCancel={() => removeAddress(index)}
                  showButtons={true} 
                  showCheck={false}
                  showTitle={false}
                  showAddressType={true}
                />
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className={styles.btnGroup}>
            <button 
              type="button" 
              className={styles.addAddressBtn} 
              onClick={addAddress}
            >
              + Add Another Address
            </button>
            
            <button type="submit" className={styles.submitBtn}>
              Register
            </button>
          </div>

        </form>

        <div className={styles.loginLink}>
          Already have an account?{" "}
          <Link to="/login" className={styles.link}>
            Login here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserRegistration;