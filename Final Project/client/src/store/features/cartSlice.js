import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, privateApi } from "../../component/services/api";

// --- Async Thunks ---

// Add Item to Cart
// Changed from FormData to Query Params to prevent 500 Internal Server Errors
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      // Sending as query params (common for Spring Boot: ?productId=1&quantity=1)
      const response = await privateApi.post("/cartItems/item/add", null, {
        params: { productId, quantity },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Get User Cart
export const getUserCart = createAsyncThunk(
  "cart/getUserCart",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/carts/user/${userId}/cart`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Update Item Quantity
export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ cartId, itemId, newQuantity }, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `/cartItems/cart/${cartId}/item/${itemId}/update`,
        null, // No body
        { params: { quantity: newQuantity } } // Send quantity as param
      );
      return { itemId, newQuantity };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Remove Item from Cart
export const removeItemFromCart = createAsyncThunk(
  "cart/removeItemFromCart",
  async ({ cartId, itemId }, { rejectWithValue }) => {
    try {
      await api.delete(`/cartItems/cart/${cartId}/item/${itemId}/remove`);
      return itemId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// --- Helper to Recalculate Totals ---
const recalculateCart = (state) => {
  state.totalAmount = state.items.reduce(
    (total, item) => total + item.totalPrice,
    0
  );
};

// --- Slice ---

const initialState = {
  items: [],
  cartId: null,
  totalAmount: 0,
  isLoading: false, // General loading state
  error: null,
  successMessage: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.cartId = null;
    },
    clearCartMessages: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Add to Cart ---
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false;
        // Depending on backend response, you might need to push to items or re-fetch
        // For now, assuming backend returns success message only, we might trigger a refetch in UI
        state.successMessage = "Item added to cart successfully";
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to add item to cart";
      })

      // --- Get User Cart ---
      .addCase(getUserCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.cartId = action.payload.cartId;
        state.totalAmount = action.payload.totalAmount;
      })
      .addCase(getUserCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to load cart";
      })

      // --- Update Quantity ---
      .addCase(updateQuantity.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.isLoading = false;
        const { itemId, newQuantity } = action.payload;
        const item = state.items.find((item) => item.product.id === itemId);
        if (item) {
          item.quantity = newQuantity;
          item.totalPrice = item.product.price * newQuantity;
        }
        recalculateCart(state);
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to update quantity";
      })

      // --- Remove Item ---
      .addCase(removeItemFromCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter(
          (item) => item.product.id !== action.payload
        );
        recalculateCart(state);
        state.successMessage = "Item removed from cart";
      })
      .addCase(removeItemFromCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || "Failed to remove item";
      });
  },
});

export const { clearCart, clearCartMessages } = cartSlice.actions;

export default cartSlice.reducer;