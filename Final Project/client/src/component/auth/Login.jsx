import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../../store/features/authSlice";
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
  const [searchParams] = useSearchParams();
  
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const authErrorMessage = useSelector((state) => state.auth.error);
  
  const from = location.state?.from?.pathname || "/";

  // Handle "Session Expired" Message
  useEffect(() => {
    const message = searchParams.get("message");
    if (message === "session_expired") {
      toast.info("You Logged Out Successfully. Please login again.");
      window.history.replaceState({}, document.title, "/login");
    }
  }, [searchParams]);

  // Handle Authentication Success (FIXED)
  useEffect(() => {
    if (isAuthenticated) {
      // Show the Welcome Message
      toast.success("Login Successful! Welcome back.");

      // Add a small delay before navigating so the user sees the toast
      const timer = setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000); // 1 second delay

      // Cleanup timer if component unmounts
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate, from]);

  // Handle Auth Errors
  useEffect(() => {
    if (authErrorMessage) {
      toast.error(authErrorMessage);
      dispatch(clearError());
    }
  }, [authErrorMessage, dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!credentials.email || !credentials.password) {
      toast.error("Please enter both email and password");
      return;
    }
    dispatch(login(credentials));
  };

  return (
    <div className={styles.loginContainer}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      <div className={styles.loginCard}>
        <h2 className={styles.title}>Welcome Back</h2>

        <form onSubmit={handleLogin}>
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
          </div>

          <button type="submit" className={styles.submitBtn}>
            Login
          </button>
        </form>

        <div className={styles.registerLink}>
          {"Don't have an account?"}{" "}
          <Link to="/register" className={styles.link}>
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;