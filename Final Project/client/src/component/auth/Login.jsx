import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../store/features/authSlice";
import { BsPersonFill, BsLockFill } from "react-icons/bs";
import { toast, ToastContainer } from "react-toastify";
import styles from "./Login.module.css";

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const [errorMessage, setErrorMessage] = useState(null);
  
  // Redux state
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const authErrorMessage = useSelector((state) => state.auth.errorMessage);
  
  // Redirect path
  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
      window.location.reload();
    }
  }, [isAuthenticated, navigate, from]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // Clear local error when user types
    if (errorMessage) setErrorMessage(null);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      const msg = "Please enter both email and password";
      toast.error(msg);
      setErrorMessage(msg);
      return;
    }
    
    try {
      await dispatch(login(credentials)).unwrap();
      // Navigation is handled by the useEffect above upon success
    } catch (error) {
      toast.error(authErrorMessage || "Login failed");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className={styles.loginCard}>
        <h2 className={styles.title}>Welcome Back</h2>
        
        {authErrorMessage && (
          <div className={styles.authError}>
            {authErrorMessage}
          </div>
        )}

        <form onSubmit={handleLogin}>
          
          {/* Email Field */}
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email Address</label>
            <div className={styles.inputWrapper}>
              <BsPersonFill className={styles.icon} />
              <input
                type="text"
                id="email"
                name="email"
                className={styles.input}
                placeholder="Enter your email"
                value={credentials.email}
                onChange={handleInputChange}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password Field */}
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <div className={styles.inputWrapper}>
              <BsLockFill className={styles.icon} />
              <input
                type="password"
                id="password"
                name="password"
                className={styles.input}
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleInputChange}
                autoComplete="current-password"
              />
            </div>
            {errorMessage && <p className={styles.errorText}>{errorMessage}</p>}
          </div>

          <button type="submit" className={styles.submitBtn}>
            Login
          </button>
        </form>

        <div className={styles.registerLink}>
          Don't have an account?{" "}
          <Link to="/register" className={styles.link}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;