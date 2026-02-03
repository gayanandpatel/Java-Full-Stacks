import { useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllCategories,
  addCategory,
} from "../../store/features/categorySlice";


import styles from "./CategorySelector.module.css";

const CategorySelector = ({
  selectedCategory,
  onCategoryChange,
  newCategory,
  showNewCategoryInput,
  setNewCategory,
  setShowNewCategoryInput,
}) => {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.category.categories);

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  const handleAddNewCategory = () => {
    if (newCategory !== "") {
      
      dispatch(addCategory({ name: newCategory }));
      onCategoryChange(newCategory);
      setNewCategory("");
      setShowNewCategoryInput(false);
    }
  };

  const handleCategoryChange = (e) => {
    if (e.target.value === "New") {
      setShowNewCategoryInput(true);
    } else {
      onCategoryChange(e.target.value);
    }
  };

  const handleNewCategoryChange = (e) => {
    setNewCategory(e.target.value);
  };

  return (
    <div className={styles.container}>
      <label className={styles.label}>Category</label>
      <select
        className={styles.select}
        required
        value={selectedCategory}
        onChange={handleCategoryChange}
      >
        <option value="">All Categories</option>
        {categories.map((category, index) => (
          <option key={index} value={category.name}>
            {category.name}
          </option>
        ))}
        <option value="New">+ Add New Category</option>
      </select>

      {showNewCategoryInput && (
        <div className={styles.inputGroup}>
          <input
            type="text"
            className={styles.input}
            value={newCategory}
            placeholder="Enter new category name"
            onChange={handleNewCategoryChange}
          />
          <button
            className={styles.addButton}
            type="button"
            onClick={handleAddNewCategory}
          >
            Add
          </button>
        </div>
      )}
    </div>
  );
};


CategorySelector.propTypes = {
  selectedCategory: PropTypes.string.isRequired,
  onCategoryChange: PropTypes.func.isRequired,
  newCategory: PropTypes.string.isRequired,
  showNewCategoryInput: PropTypes.bool.isRequired,
  setNewCategory: PropTypes.func.isRequired,
  setShowNewCategoryInput: PropTypes.func.isRequired,
};

export default CategorySelector;