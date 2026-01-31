import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

// Components
import Hero from "../hero/Hero";
import Paginator from "../common/Paginator";
import ProductImage from "../utils/ProductImage";
import LoadSpinner from "../common/LoadSpinner";
import StockStatus from "../utils/StockStatus";

// State Actions
import { setTotalItems } from "../../store/features/paginationSlice";
import { getDistinctProductsByName } from "../../store/features/productSlice";

// Styling
import styles from "./Home.module.css";

const Home = () => {
  const dispatch = useDispatch();
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Redux Selectors
  const products = useSelector((state) => state.product.distinctProducts);
  const { searchQuery, selectedCategory } = useSelector((state) => state.search);
  const { itemsPerPage, currentPage } = useSelector((state) => state.pagination);
  const isLoading = useSelector((state) => state.product.isLoading);

  useEffect(() => {
    dispatch(getDistinctProductsByName());
  }, [dispatch]);

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
        
        {currentProducts.length === 0 ? (
          <div className="text-center mt-5">
             <h3>No products found.</h3>
          </div>
        ) : (
          <div className={styles.grid}>
            {currentProducts.map((product) => (
              <div key={product.id} className={styles.card}>
                
                {/* Image Section */}
                <Link to={`/products/${product.name}`} className={styles.imageWrapper}>
                  {product.images.length > 0 ? (
                     // Assuming ProductImage renders an <img> tag, the CSS will handle it
                    <ProductImage productId={product.images[0].id} />
                  ) : (
                    <div className="text-muted">No Image</div>
                  )}
                </Link>

                {/* Details Section */}
                <div className={styles.cardBody}>
                  <div>
                    <Link to={`/products/${product.name}`} className={styles.productName}>
                      {product.name}
                    </Link>
                    <p className={styles.productDesc}>
                      {product.description}
                    </p>
                    <div className={styles.stockStatus}>
                        <StockStatus inventory={product.inventory} />
                    </div>
                  </div>

                  {/* Footer (Price & Action) */}
                  <div className={styles.cardFooter}>
                    <span className={styles.price}>${product.price}</span>
                    <Link
                      to={`/products/${product.name}`}
                      className={styles.shopBtn}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Paginator />
    </>
  );
};

export default Home;