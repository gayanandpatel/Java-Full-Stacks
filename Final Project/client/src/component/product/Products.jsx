import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";


import {
  getAllProducts,
  getProductsByCategory,
} from "../../store/features/productSlice";
import { setTotalItems } from "../../store/features/paginationSlice";
import { 
  setInitialSearchQuery, 
  setSelectedCategory 
} from "../../store/features/searchSlice";

import ProductCard from "./ProductCard";
import SearchBar from "../search/SearchBar";
import Paginator from "../common/Paginator";
import SideBar from "../common/SideBar";
import LoadSpinner from "../common/LoadSpinner";

import styles from "./Products.module.css";

const Products = () => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const dispatch = useDispatch();
  
  const { products, selectedBrands, isLoading } = useSelector((state) => state.product);
  const { searchQuery, selectedCategory } = useSelector((state) => state.search);
  const { itemsPerPage, currentPage } = useSelector((state) => state.pagination);

  const { name, categoryId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialSearchQuery = queryParams.get("search") || name || "";

  // Fetch Products Logic
  useEffect(() => {
    if (categoryId) {
      dispatch(getProductsByCategory(categoryId));
    } else {
      dispatch(getAllProducts());
      dispatch(setSelectedCategory("all"));
    }
  }, [dispatch, categoryId]);

  // Sync Search Query from URL
  useEffect(() => {
    dispatch(setInitialSearchQuery(initialSearchQuery));
  }, [initialSearchQuery, dispatch]);

  // Filtering Logic (Client-side)
  useEffect(() => {
    if (!products) return;

    const results = products.filter((product) => {
      const matchesQuery = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" ||
        (product.category?.name && 
         product.category.name.toLowerCase() === selectedCategory.toLowerCase());
      const matchesBrand =
        selectedBrands.length === 0 ||
        selectedBrands.some((selectedBrand) =>
          product.brand.toLowerCase().includes(selectedBrand.toLowerCase())
        );

      return matchesQuery && matchesCategory && matchesBrand;
    });
    setFilteredProducts(results);
  }, [searchQuery, selectedCategory, selectedBrands, products]);

  // Update Pagination
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
      
      {/* Search Header */}
      <div className={styles.searchSection}>
        <div className={styles.searchWrapper}>
          <SearchBar />
        </div>
      </div>

      <div className={styles.layoutGrid}>
        
        {/* Left Sidebar */}
        <aside className={styles.sidebarWrapper}>
          <SideBar />
        </aside>

        {/* Right Product Grid */}
        <section className={styles.productSection}>
          {currentProducts.length > 0 ? (
            <>
              <div className={styles.resultsCount}>
                Showing {filteredProducts.length} results
              </div>
              <ProductCard products={currentProducts} />
              
              <div className={styles.paginationWrapper}>
                <Paginator />
              </div>
            </>
          ) : (
             <div className={styles.emptyState}>
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png" 
                  alt="No results" 
                  width="100" 
                  style={{opacity: 0.5, marginBottom: '20px'}}
                />
                <h4>No products found</h4>
                <p className="text-muted">Try checking your spelling or use different keywords.</p>
                <button 
                  className={styles.resetBtn}
                  onClick={() => {
                    dispatch(setInitialSearchQuery(""));
                    dispatch(setSelectedCategory("all"));
                  }}
                >
                  Clear All Filters
                </button>
             </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Products;