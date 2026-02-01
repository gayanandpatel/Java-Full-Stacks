import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCheck, FaFilter, FaUndo } from "react-icons/fa";

// Actions
import {
  getAllBrands,
  filterByBrands,
} from "../../store/features/productSlice";

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

  // Helper to clear only brand filters
  const handleClearBrands = () => {
    // You might need to add a 'clearBrands' action to your slice, 
    // or manually uncheck all. For now, we can loop or just reload.
    // Assuming you implement a clear action, otherwise this button 
    // can just uncheck purely locally if the slice supports it.
    // Ideally: dispatch(clearBrandFilters());
    brands.forEach(brand => {
        if(selectedBrands.includes(brand)) {
            dispatch(filterByBrands({ brand, isChecked: false }));
        }
    });
  };

  return (
    <div className={styles.sidebarCard}>
      
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleWrapper}>
          <FaFilter className={styles.filterIcon} />
          <h3 className={styles.title}>Filters</h3>
        </div>
        
        {selectedBrands.length > 0 && (
          <button onClick={handleClearBrands} className={styles.resetBtn}>
            <FaUndo size={10} style={{marginRight: '4px'}}/> Reset
          </button>
        )}
      </div>

      {/* Brand Section */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Brand</h4>
        <div className={styles.brandList}>
          {brands.map((brand, index) => (
            <label key={index} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                className={styles.hiddenInput}
                checked={selectedBrands.includes(brand)}
                onChange={(e) => handleBrandChange(brand, e.target.checked)}
              />
              
              <span className={styles.customCheckbox}>
                <FaCheck className={styles.checkIcon} />
              </span>
              
              <span className={styles.brandName}>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Placeholder for future filters (Price, Rating, etc.) */}
      {/* <div className={styles.section}>
         <h4 className={styles.sectionTitle}>Price Range</h4>
         ...
      </div> */}
      
    </div>
  );
};

export default SideBar;