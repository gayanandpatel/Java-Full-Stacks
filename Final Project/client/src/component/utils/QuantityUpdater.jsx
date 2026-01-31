import React from "react";
import { BsDash, BsPlus } from "react-icons/bs";

// Import styles
import styles from "./QuantityUpdater.module.css";

const QuantityUpdater = ({ disabled, quantity, onIncrease, onDecrease }) => {
  return (
    <div className={`${styles.wrapper} ${disabled ? styles.disabledWrapper : ''}`}>
      <button
        onClick={onDecrease}
        className={styles.btn}
        disabled={disabled || quantity <= 1} // Disable minus if quantity is 1
        aria-label="Decrease quantity"
        type="button"
      >
        <BsDash size={18} />
      </button>

      <input
        name="quantity"
        type="number"
        value={quantity}
        readOnly
        disabled={disabled}
        className={styles.input}
        aria-label="Quantity"
      />

      <button
        onClick={onIncrease}
        className={styles.btn}
        disabled={disabled}
        aria-label="Increase quantity"
        type="button"
      >
        <BsPlus size={18} />
      </button>
    </div>
  );
};

export default QuantityUpdater;