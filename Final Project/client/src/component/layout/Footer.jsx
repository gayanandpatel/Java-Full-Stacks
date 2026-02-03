import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAllCategories } from "../../store/features/categorySlice";


import { 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaMapMarkerAlt, 
  FaPhoneAlt, 
  FaEnvelope,
  FaCcVisa,
  FaCcMastercard,
  FaCcPaypal
} from "react-icons/fa";


import styles from "./Footer.module.css";

const Footer = () => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.categories) || [];

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  // Limit categories to 5 to prevent the footer from getting too long vertically
  const displayedCategories = categories.slice(0, 5);

  return (
    <footer className={styles.footer}>
      
      {/* Newsletter Section - Modern Touch */}
      <div className={styles.newsletterSection}>
        <div className={styles.newsletterContent}>
          <div className={styles.newsletterText}>
            <h3>Join our newsletter</h3>
            <p>We&apos;ll send you a nice letter once per week. No spam.</p>
          </div>
          <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className={styles.input} 
            />
            <button type="submit" className={styles.subscribeBtn}>
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className={styles.mainContent}>
        
        {/* Brand Column */}
        <div className={styles.column}>
          <h4 style={{ fontSize: '1.5rem', color: '#fff' }}>Shopifyy</h4>
          <p className={styles.brandDesc}>
            Your one-stop destination for premium products. We pride ourselves on 
            quality, transparency, and speed.
          </p>
          <div className={styles.socialIcons}>
            <a href="#" className={styles.iconLink}><FaFacebookF /></a>
            <a href="#" className={styles.iconLink}><FaTwitter /></a>
            <a href="#" className={styles.iconLink}><FaInstagram /></a>
            <a href="#" className={styles.iconLink}><FaLinkedinIn /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className={styles.column}>
          <h4>Company</h4>
          <ul className={styles.linkList}>
            <li><Link to="/about" className={styles.link}>About Us</Link></li>
            <li><Link to="/careers" className={styles.link}>Careers</Link></li>
            <li><Link to="/blog" className={styles.link}>Our Blog</Link></li>
            <li><Link to="/terms" className={styles.link}>Terms & Service</Link></li>
          </ul>
        </div>

        {/* Dynamic Categories */}
        <div className={styles.column}>
          <h4>Shop</h4>
          <ul className={styles.linkList}>
            {displayedCategories.map((category) => (
              <li key={category.id}>
                <Link 
                  to={`/products/category/${category.id}/products`} 
                  className={styles.link}
                >
                  {category.name}
                </Link>
              </li>
            ))}
            <li><Link to="/products" className={styles.link}>All Products</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className={styles.column}>
          <h4>Contact Us</h4>
          <div className={styles.contactItem}>
            <FaMapMarkerAlt style={{ color: 'var(--search-button-color, #c38212)' }} />
            <span>123 Commerce St, Bengaluru, India</span>
          </div>
          <div className={styles.contactItem}>
            <FaPhoneAlt style={{ color: 'var(--search-button-color, #c38212)' }} />
            <span>(123) 456-7890</span>
          </div>
          <div className={styles.contactItem}>
            <FaEnvelope style={{ color: 'var(--search-button-color, #c38212)' }} />
            <span>support@shopifyy.com</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar with Payment Icons */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomContent}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} Shopifyy. All rights reserved.
          </p>
          <div className={styles.paymentMethods}>
             <FaCcVisa className={styles.paymentIcon} />
             <FaCcMastercard className={styles.paymentIcon} />
             <FaCcPaypal className={styles.paymentIcon} />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;