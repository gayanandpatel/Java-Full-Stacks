import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, privateApi } from "../../component/services/api";

// Fix: Use Query Params instead of FormData for simple fields
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await privateApi.post("/cartItems/item/add", null, {
        params: { productId, quantity },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

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

export const updateQuantity = createAsyncThunk(
  "cart/updateQuantity",
  async ({ cartId, itemId, newQuantity }, { rejectWithValue }) => {
    try {
      await api.put(
        `/cartItems/cart/${cartId}/item/${itemId}/update`, 
        null, 
        { params: { quantity: newQuantity } }
      );
      return { itemId, newQuantity };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

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

const initialState = {
  items: [],
  cartId: null,
  totalAmount: 0,
  isLoading: false,
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
      state.error = null;
      state.successMessage = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Add to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        // Optimistic update: You might want to refetch the cart or just push if backend returns item
        // Assuming backend returns success message:
        state.successMessage = "Item added to cart successfully";
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Get User Cart
      .addCase(getUserCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.cartId = action.payload.cartId;
        state.totalAmount = action.payload.totalAmount;
        state.isLoading = false;
      })
      .addCase(getUserCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Update Quantity
      .addCase(updateQuantity.fulfilled, (state, action) => {
        const { itemId, newQuantity } = action.payload;
        const item = state.items.find((item) => item.product.id === itemId);
        if (item) {
          item.quantity = newQuantity;
          item.totalPrice = item.product.price * newQuantity;
        }
        // Recalculate Total
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.totalPrice,
          0
        );
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.error = action.payload;
      })

      // Remove Item
      .addCase(removeItemFromCart.fulfilled, (state, action) => {
        const itemId = action.payload;
        state.items = state.items.filter((item) => item.product.id !== itemId);
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.totalPrice,
          0
        );
      });
  },
});

export const { clearCart, clearCartMessages } = cartSlice.actions;
export default cartSlice.reducer;