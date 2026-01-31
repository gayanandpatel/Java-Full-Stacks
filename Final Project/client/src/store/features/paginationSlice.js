import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentPage: 1,
  itemsPerPage: 18,
  totalItems: 0,
};

const paginationSlice = createSlice({
  name: "pagination",
  initialState,
  reducers: {
    // Set exact page with bounds checking
    setCurrentPage: (state, action) => {
      const page = Math.max(1, action.payload); // Prevent going below 1
      const totalPages = Math.ceil(state.totalItems / state.itemsPerPage);
      
      // Prevent going above max pages (if totalItems is loaded)
      if (state.totalItems > 0 && page > totalPages) {
        state.currentPage = totalPages;
      } else {
        state.currentPage = page;
      }
    },
    
    // Set total items and adjust current page if out of bounds
    setTotalItems: (state, action) => {
      state.totalItems = action.payload;
      
      // If we are on page 5 but new data only has 2 pages, snap back to page 2
      const totalPages = Math.ceil(action.payload / state.itemsPerPage);
      if (totalPages > 0 && state.currentPage > totalPages) {
        state.currentPage = totalPages;
      }
    },

    // Changing page size should usually reset to page 1 to avoid confusion
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1; 
    },

    // Navigation Helpers
    nextPage: (state) => {
      const totalPages = Math.ceil(state.totalItems / state.itemsPerPage);
      if (state.currentPage < totalPages) {
        state.currentPage += 1;
      }
    },
    previousPage: (state) => {
      if (state.currentPage > 1) {
        state.currentPage -= 1;
      }
    },
    resetPagination: (state) => {
      state.currentPage = 1;
      state.totalItems = 0;
    }
  },
});

export const {
  setItemsPerPage,
  setCurrentPage,
  setTotalItems,
  nextPage,
  previousPage,
  resetPagination
} = paginationSlice.actions;

// --- Selectors ---
export const selectPagination = (state) => state.pagination;
export const selectCurrentPage = (state) => state.pagination.currentPage;

export default paginationSlice.reducer;