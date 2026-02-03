import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCheck, FaFilter, FaUndo } from "react-icons/fa";


import {
  getAllBrands,
  filterByBrands,
} from "../../store/features/productSlice";

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


  const handleClearBrands = () => {

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
    </div>
  );
};

export default SideBar;