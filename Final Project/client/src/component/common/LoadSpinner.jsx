import styles from "./LoadSpinner.module.css";

const LoadSpinner = () => {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner} aria-label="Loading..."></div>
    </div>
  );
};

export default LoadSpinner;