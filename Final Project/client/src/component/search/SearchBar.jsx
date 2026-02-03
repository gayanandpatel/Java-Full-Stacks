import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FaSearch, FaTimes, FaCaretDown } from "react-icons/fa";

import { getAllCategories } from "../../store/features/categorySlice";
import {
  setSearchQuery,
  setSelectedCategory,
  clearFilters,
} from "../../store/features/searchSlice";
import styles from "./SearchBar.module.css";

const SearchBar = () => {
  const dispatch = useDispatch();
  const { categoryId } = useParams(); 
  
  const categories = useSelector((state) => state.category.categories);
  const { searchQuery, selectedCategory } = useSelector(
    (state) => state.search
  );

  useEffect(() => {
    if (categoryId && categories.length > 0) {
      const currentCategory = categories.find(
        (category) => category.id === parseInt(categoryId, 10)
      );

      if (currentCategory) {
        dispatch(setSelectedCategory(currentCategory.name));
      } else {
        dispatch(setSelectedCategory("all"));
      }
    }
  }, [categoryId, categories, dispatch]);

  const handleCategoryChange = (e) => {
    dispatch(setSelectedCategory(e.target.value));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handleSearchQueryChange = (e) => {
    dispatch(setSearchQuery(e.target.value));
  };

  useEffect(() => {
    dispatch(getAllCategories());
  }, [dispatch]);

  return (
    <div className={styles.container}>
      
      {/* Category Dropdown */}
      <div className={styles.categoryWrapper}>
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className={styles.select}
          aria-label="Select Category"
        >
          <option value="all">All Categories</option>
          {categories.map((category, index) => (
            <option key={index} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        
        <FaCaretDown className={styles.caretIcon} />
      </div>

      {/* Search Input */}
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchQueryChange}
        className={styles.input}
        placeholder="Search for products (e.g. watch, laptop...)"
        aria-label="Search"
      />

      {/* Actions */}
      <div className={styles.actions}>
        {(searchQuery || selectedCategory !== "all") && (
          <button 
            className={styles.clearBtn} 
            onClick={handleClearFilters}
            title="Clear all filters"
          >
            Clear <FaTimes style={{marginLeft: '4px', verticalAlign: 'middle'}}/>
          </button>
        )}
        
        <div className={styles.searchIconWrapper}>
          <FaSearch />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;