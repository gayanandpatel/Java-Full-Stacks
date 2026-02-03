import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, privateApi } from "../../component/services/api";

export const getAllProducts = createAsyncThunk(
  "product/getAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/products/all");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const addNewProduct = createAsyncThunk(
  "product/addNewProduct",
  async (product, { rejectWithValue }) => {
    try {
      const response = await privateApi.post("/products/add", product);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ productId, updatedProduct }, { rejectWithValue }) => {
    try {
      const response = await privateApi.put(
        `/products/product/${productId}/update`,
        updatedProduct
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await privateApi.delete(
        `/products/product/${productId}/delete`
      );
      return { id: productId, message: response.data?.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAllBrands = createAsyncThunk(
  "product/getAllBrands",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/products/distinct/brands");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const getDistinctProductsByName = createAsyncThunk(
  "product/getDistinctProductsByName",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/products/distinct/products");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getProductById = createAsyncThunk(
  "product/getProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/product/${productId}/product`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);
export const getProductsByCategory = createAsyncThunk(
  "product/getProductsByCategory",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/category/${categoryId}/products`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  products: [],
  product: null,
  distinctProducts: [],
  brands: [],
  selectedBrands: [],
  quantity: 1,
  isLoading: false,
  error: null,
  successMessage: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    filterByBrands: (state, action) => {
      const { brand, isChecked } = action.payload;
      if (isChecked) {
        state.selectedBrands.push(brand);
      } else {
        state.selectedBrands = state.selectedBrands.filter((b) => b !== brand);
      }
    },
    setQuantity: (state, action) => {
      state.quantity = action.payload;
    },
    addBrand: (state, action) => {
      state.brands.push(action.payload);
    },
    clearProductError: (state) => {
      state.error = null;
    },
    clearProductSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getAllProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload;
      })
      .addCase(getProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(addNewProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addNewProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products.push(action.payload);
        state.successMessage = "Product added successfully";
      })
      .addCase(addNewProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(updateProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.product = action.payload.data;
        const index = state.products.findIndex(p => p.id === action.payload.data.id);
        if (index !== -1) state.products[index] = action.payload.data;
        state.successMessage = "Product updated successfully";
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(deleteProduct.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = state.products.filter(
          (product) => product.id !== action.payload.id
        );
        state.successMessage = action.payload.message;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(getAllBrands.fulfilled, (state, action) => {
        state.brands = action.payload;
      })
      .addCase(getDistinctProductsByName.fulfilled, (state, action) => {
        state.distinctProducts = action.payload;
      })
      .addCase(getProductsByCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getProductsByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload;
      })
      .addCase(getProductsByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  filterByBrands, 
  setQuantity, 
  addBrand, 
  clearProductError, 
  clearProductSuccess 
} = productSlice.actions;

export default productSlice.reducer;