import { setCurrentPage } from "../../store/features/paginationSlice";
import { useDispatch, useSelector } from "react-redux";

import styles from "./Paginator.module.css";

const Paginator = () => {
  const dispatch = useDispatch();

  const { itemsPerPage, totalItems, currentPage } = useSelector(
    (state) => state.pagination
  );

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // If there's only one page (or zero), don't show pagination
  if (totalPages <= 1) return null;

  const paginate = (pageNumber) => {
    // Scroll to top when changing page for better UX
    window.scrollTo({ top: 0, behavior: 'smooth' });
    dispatch(setCurrentPage(pageNumber));
  };

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={styles.container}>
      
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`${styles.pageBtn} ${
            currentPage === number ? styles.active : ""
          }`}
          aria-current={currentPage === number ? "page" : undefined}
          aria-label={`Go to page ${number}`}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default Paginator;