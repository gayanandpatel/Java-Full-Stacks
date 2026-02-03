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

    setCurrentPage: (state, action) => {
      const page = Math.max(1, action.payload); 
      const totalPages = Math.ceil(state.totalItems / state.itemsPerPage);
      
      if (state.totalItems > 0 && page > totalPages) {
        state.currentPage = totalPages;
      } else {
        state.currentPage = page;
      }
    },
    
    setTotalItems: (state, action) => {
      state.totalItems = action.payload;
      
      const totalPages = Math.ceil(action.payload / state.itemsPerPage);
      if (totalPages > 0 && state.currentPage > totalPages) {
        state.currentPage = totalPages;
      }
    },
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
      state.currentPage = 1; 
    },

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

export const selectPagination = (state) => state.pagination;
export const selectCurrentPage = (state) => state.pagination.currentPage;

export default paginationSlice.reducer;