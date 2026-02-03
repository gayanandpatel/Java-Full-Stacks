import { useEffect } from "react";
import PropTypes from "prop-types";
import { useSelector, useDispatch } from "react-redux";
import { getAllBrands, addBrand } from "../../store/features/productSlice";

import styles from "./BrandSelector.module.css";

const BrandSelector = ({
  selectedBrand,
  onBrandChange,
  newBrand,
  showNewBrandInput,
  setNewBrand,
  setShowNewBrandInput,
}) => {
  const dispatch = useDispatch();
  const brands = useSelector((state) => state.product.brands);

  useEffect(() => {
    dispatch(getAllBrands());
  }, [dispatch]);

  const handleAddNewBrand = () => {
    if (newBrand !== "") {
      dispatch(addBrand(newBrand));
      onBrandChange(newBrand);
      setNewBrand("");
      setShowNewBrandInput(false);
    }
  };

  const handleBrandChange = (e) => {
    if (e.target.value === "New") {
      setShowNewBrandInput(true);
    } else {
      onBrandChange(e.target.value);
    }
  };

  const handleNewBrandChange = (e) => {
    setNewBrand(e.target.value);
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>Brand</label>
      <select
        className={styles.select}
        required
        value={selectedBrand}
        onChange={handleBrandChange}
      >
        <option value="">All Brands</option>
        {brands.map((brand, index) => (
          <option key={index} value={brand}>
            {brand}
          </option>
        ))}
        <option value="New">+ Add New Brand</option>
      </select>

      {showNewBrandInput && (
        <div className={styles.inputGroup}>
          <input
            type="text"
            className={styles.input}
            value={newBrand}
            placeholder="Enter new brand name"
            onChange={handleNewBrandChange}
          />
          <button
            className={styles.addButton}
            type="button"
            onClick={handleAddNewBrand}
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
};

BrandSelector.propTypes = {
  selectedBrand: PropTypes.string,
  onBrandChange: PropTypes.func.isRequired,
  newBrand: PropTypes.string,
  showNewBrandInput: PropTypes.bool,
  setNewBrand: PropTypes.func.isRequired,
  setShowNewBrandInput: PropTypes.func.isRequired,
};

export default BrandSelector;