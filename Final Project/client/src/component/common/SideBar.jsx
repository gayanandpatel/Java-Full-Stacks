import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllBrands,
  filterByBrands,
} from "../../store/features/productSlice";
import { FaCheck } from "react-icons/fa";

// Import styles
import styles from "./SideBar.module.css";

const SideBar = () => {
  const dispatch = useDispatch();
  const { brands, selectedBrands } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getAllBrands());
  }, [dispatch]);

  const handleBrandChange = (brand, isChecked) => {
    dispatch(filterByBrands({ brand, isChecked }));
  };

  return (
    <aside className={styles.sidebarContainer}>
      <div className={styles.header}>
        <h3 className={styles.title}>Filter by Brand</h3>
      </div>

      <ul className={styles.brandList}>
        {brands.map((brand, index) => (
          <li key={index} className={styles.brandItem}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.hiddenInput}
                checked={selectedBrands.includes(brand)}
                onChange={(e) => handleBrandChange(brand, e.target.checked)}
              />
              
              {/* Custom Checkbox UI */}
              <span className={styles.customCheckbox}>
                <FaCheck className={styles.checkIcon} />
              </span>
              
              <span className={styles.brandName}>{brand}</span>
            </label>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SideBar;