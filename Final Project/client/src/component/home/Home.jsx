import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";


import Hero from "../hero/Hero";
import Paginator from "../common/Paginator";
import ProductImage from "../utils/ProductImage";
import LoadSpinner from "../common/LoadSpinner";

import { setTotalItems } from "../../store/features/paginationSlice";
import { getDistinctProductsByName } from "../../store/features/productSlice";
import { resetSearchState } from "../../store/features/searchSlice"; 

import styles from "./Home.module.css";

const Home = () => {
  const dispatch = useDispatch();
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  const products = useSelector((state) => state.product.distinctProducts);
  const { searchQuery, selectedCategory } = useSelector((state) => state.search);
  const { itemsPerPage, currentPage } = useSelector((state) => state.pagination);
  const isLoading = useSelector((state) => state.product.isLoading);

  // Initial Fetch & Reset Filters
  useEffect(() => {
    dispatch(resetSearchState());
    dispatch(getDistinctProductsByName());
  }, [dispatch]);

  // Filtering Logic (Client-side)
  useEffect(() => {
    if (!products) return;

    const results = products.filter((product) => {
      const matchesQuery = product.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" ||
        product.category.name
          .toLowerCase()
          .includes(selectedCategory.toLowerCase());

      return matchesQuery && matchesCategory;
    });
    setFilteredProducts(results);
  }, [searchQuery, selectedCategory, products]);

  // Pagination Logic
  useEffect(() => {
    dispatch(setTotalItems(filteredProducts.length));
  }, [filteredProducts, dispatch]);

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
    <>
      <Hero />
      
      <div className={styles.container}>
        <ToastContainer />
        
        <div className={styles.sectionHeader}>
            <h2>Featured Products</h2>
            <p>Check out our latest collections</p>
        </div>

        {currentProducts.length === 0 ? (
          <div className={styles.emptyState}>
             <img 
               src="https://cdn-icons-png.flaticon.com/512/4076/4076432.png" 
               alt="No results" 
               width="80" 
               style={{opacity: 0.5, marginBottom: '20px'}}
             />
             <h3>No products found.</h3>
             <p className="text-muted">We couldn&apos;t find what you&apos;re looking for.</p>
             <button 
                className={styles.resetBtn}
                onClick={() => dispatch(resetSearchState())}
             >
                Show All Products
             </button>
          </div>
        ) : (
          <div className={styles.grid}>
            {currentProducts.map((product) => (
              <div key={product.id} className={styles.card}>
                
                {/* Image Section */}
                <Link to={`/product/${product.id}/details`} className={styles.imageWrapper}>
                  {product.images.length > 0 ? (
                    <ProductImage productId={product.images[0].id} />
                  ) : (
                    <div className="text-muted">No Image</div>
                  )}
                  {/* Overlay Action */}
                  <div className={styles.overlay}>
                      <span>View Details</span>
                  </div>
                </Link>

                {/* Details Section */}
                <div className={styles.cardBody}>
                  <div>
                    {/* Name Link */}
                    <Link to={`/product/${product.id}/details`} className={styles.productName}>
                      {product.name}
                    </Link>
                    <p className={styles.productDesc}>
                      {product.description}
                    </p>
                    
                    {/* Stock Status Shows text only (In Stock / Out of Stock) */}
                    <div className={styles.stockWrapper}>
                        {product.inventory > 0 ? (
                          <span style={{ color: "#28a745", fontWeight: "600", fontSize: "0.85rem" }}>
                            In Stock
                          </span>
                        ) : (
                          <span style={{ color: "#dc3545", fontWeight: "600", fontSize: "0.85rem" }}>
                            Out of Stock
                          </span>
                        )}
                    </div>
                  </div>

                  {/* Footer (Price & Action) */}
                  <div className={styles.cardFooter}>
                    <span className={styles.price}>₹{product.price?.toFixed(2)}</span>
                    <Link
                      to={`/product/${product.id}/details`}
                      className={styles.shopBtn}
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className={styles.paginationWrapper}>
         <Paginator />
      </div>
    </>
  );
};

export default Home;