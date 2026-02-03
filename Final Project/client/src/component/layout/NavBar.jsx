import { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getUserCart } from "../../store/features/cartSlice";
import { logoutUser } from "../services/authService";

import { FaShoppingCart, FaUser, FaChevronDown } from "react-icons/fa";

import styles from "./NavBar.module.css";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const userRoles = useSelector((state) => state.auth.roles);
  const userId = localStorage.getItem("userId");
  const cart = useSelector((state) => state.cart);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Cart
  useEffect(() => {
    if (userId) {
      dispatch(getUserCart(userId));
    }
  }, [dispatch, userId]);

  const handleLogout = () => {
    logoutUser();
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/login");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        
        {/* Brand Logo */}
        <Link to="/" className={styles.brand}>
          Shop<span className={styles.brandHighlight}>ifyy</span>
        </Link>

        {/* Navigation Links (Desktop + Mobile) */}
        <ul className={`${styles.navLinks} ${isMobileMenuOpen ? styles.navActive : ""}`}>
          <li className={styles.navItem}>
            <Link to="/products" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>
              All Products
            </Link>
          </li>
          
          {userRoles.includes("ROLE_ADMIN") && (
            <li className={styles.navItem}>
              <Link to="/add-product" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>
                Manage Shop
              </Link>
            </li>
          )}

          {/* Mobile Only: Login link if not logged in (to save space on desktop) */}
          {isMobileMenuOpen && !userId && (
             <li className={styles.navItem}>
               <Link to="/login" className={styles.navLink} onClick={() => setIsMobileMenuOpen(false)}>
                 Register/Login
               </Link>
             </li>
          )}
        </ul>

        {/* Right Side Actions */}
        <div className={styles.navActions}>
          
          {/* Cart Icon */}
          {userId && (
            <Link to="/cart"  className={styles.cartContainer}>
              <FaShoppingCart />
              {cart.items.length > 0 && (
                <span className={styles.cartBadge}>{cart.items.length}</span>
              )}
            </Link>
          )}

          {/* User Account Dropdown (Desktop) */}
          {userId ? (
            <div className={styles.profileDropdown} ref={dropdownRef}>
              <div 
                className={styles.profileTrigger} 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <FaUser className={styles.userIcon} />
                <FaChevronDown className={`${styles.chevron} ${isDropdownOpen ? styles.rotate : ''}`} />
              </div>

              <div className={`${styles.dropdownMenu} ${isDropdownOpen ? styles.showDropdown : ''}`}>
                <Link 
                  to={`/user-profile/${userId}/profile`} 
                  className={styles.dropdownItem}
                  onClick={() => setIsDropdownOpen(false)}
                >
                  My Profile
                </Link>
                <div className={styles.divider}></div>
                <div 
                  className={styles.dropdownItem} 
                  onClick={handleLogout}
                >
                  Logout
                </div>
              </div>
            </div>
          ) : (
            !isMobileMenuOpen && (
              <Link to="/login" className={styles.navLink} style={{marginRight: '10px'}}>
                Register/Login
              </Link>
            )
          )}

          {/* Mobile Menu Toggle (Hamburger) */}
          <div 
            className={`${styles.mobileToggle} ${isMobileMenuOpen ? styles.open : ""}`} 
            onClick={toggleMobileMenu}
          >
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
            <span className={styles.bar}></span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;