import PropTypes from "prop-types";
import { FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";


import styles from "./StockStatus.module.css";

const StockStatus = ({ inventory }) => {

  let statusClass = styles.inStock;
  let icon = <FaCheckCircle className={styles.icon} />;
  let text = `${inventory} In Stock`;

  if (inventory <= 0) {
    statusClass = styles.outOfStock;
    icon = <FaTimesCircle className={styles.icon} />;
    text = "Out of Stock";
  } else if (inventory < 10) {
    statusClass = styles.lowStock;
    icon = <FaExclamationTriangle className={styles.icon} />;
    text = `Only ${inventory} Left`;
  }

  return (
    <div className={`${styles.badge} ${statusClass}`}>
      {icon}
      <span>{text}</span>
    </div>
  );
};

StockStatus.propTypes = {
  inventory: PropTypes.number.isRequired,
};

export default StockStatus;