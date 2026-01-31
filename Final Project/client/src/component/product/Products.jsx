import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Actions
import {
  getAllProducts,
  getProductsByCategory,
} from "../../store/features/productSlice";
import { setTotalItems } from "../../store/features/paginationSlice";
import { setInitialSearchQuery } from "../../store/features/searchSlice";

// Components
import ProductCard from "./ProductCard";
import SearchBar from "../search/SearchBar";
import Paginator from "../common/Paginator";
import SideBar from "../common/SideBar";
import LoadSpinner from "../common/LoadSpinner";

// Import styles
import styles from "./Products.module.css";

const Products = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const dispatch = useDispatch();
  
  // Redux Selectors
  const { products, selectedBrands, isLoading } = useSelector((state) => state.product);
  const { searchQuery, selectedCategory } = useSelector((state) => state.search);
  const { itemsPerPage, currentPage } = useSelector((state) => state.pagination);

  const { name, categoryId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearchQuery = queryParams.get("search") || name || "";

  // Initial Fetch
  useEffect(() => {
    if (categoryId) {
      dispatch(getProductsByCategory(categoryId));
    } else {
      dispatch(getAllProducts());
    }
  }, [dispatch, categoryId]);

  // Set Search Query from URL
  useEffect(() => {
    dispatch(setInitialSearchQuery(initialSearchQuery));
  }, [initialSearchQuery, dispatch]);

  // Filtering Logic
  useEffect(() => {
    const results = products.filter((product) => {
      const matchesQuery = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" ||
        product.category.name
          .toLowerCase()
          .includes(selectedCategory.toLowerCase());

      const matchesBrand =
        selectedBrands.length === 0 ||
        selectedBrands.some((selectedBrand) =>
          product.brand.toLowerCase().includes(selectedBrand.toLowerCase())
        );
      return matchesQuery && matchesCategory && matchesBrand;
    });
    setFilteredProducts(results);
  }, [searchQuery, selectedCategory, selectedBrands, products]);

  // Update Pagination Total
  useEffect(() => {
    dispatch(setTotalItems(filteredProducts.length));
  }, [filteredProducts, dispatch]);

  // Pagination Slicing
  const indexOfLastProduct = currentPage * itemsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - itemsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  if (isLoading) {
    return <LoadSpinner />;
  }

  return (
    <div className={styles.pageContainer}>
      <ToastContainer position="bottom-right" />
      
      {/* Search Bar Area */}
      <div className={styles.searchSection}>
        <div className={styles.searchWrapper}>
          <SearchBar />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className={styles.layoutGrid}>
        
        {/* Left Sidebar */}
        <aside className={styles.sidebarWrapper}>
          <SideBar />
        </aside>

        {/* Right Product Grid */}
        <section className={styles.productSection}>
          {currentProducts.length > 0 ? (
            <ProductCard products={currentProducts} />
          ) : (
             <div className="text-center py-5">
                <h4>No products found</h4>
                <p className="text-muted">Try adjusting your filters.</p>
             </div>
          )}
          
          <div className="mt-4">
            <Paginator />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Products;