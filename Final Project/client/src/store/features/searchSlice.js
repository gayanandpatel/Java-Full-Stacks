import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  searchQuery: "",
  selectedCategory: "all",
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setInitialSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    resetSearchState: (state) => {
      state.searchQuery = "";
      state.selectedCategory = "all";
    },
    // Alias for backward compatibility if you prefer 'clearFilters'
    clearFilters: (state) => {
      state.searchQuery = "";
      state.selectedCategory = "all";
    },
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  setInitialSearchQuery,
  resetSearchState,
  clearFilters,
} = searchSlice.actions;

// --- Selectors ---
// Using selectors is better practice than state.search.searchQuery in components
export const selectSearchQuery = (state) => state.search.searchQuery;
export const selectSelectedCategory = (state) => state.search.selectedCategory;
export const selectSearchState = (state) => state.search;

export default searchSlice.reducer;