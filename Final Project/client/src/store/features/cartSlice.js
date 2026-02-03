import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../../component/services/api"; // Only import privateApi

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { rejectWithValue, dispatch, getState }) => {
    try {
      const response = await privateApi.post("/cartItems/item/add", null, {
        params: { productId, quantity },
      });
      const { userId } = getState().auth; 
      if (userId) {
        dispatch(getUserCart(userId));
      }

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
      const response = await privateApi.get(`/carts/user/${userId}/cart`);
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
      await privateApi.put(
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
      await privateApi.delete(`/cartItems/cart/${cartId}/item/${itemId}/remove`);
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
      .addCase(addToCart.fulfilled, (state) => {
        state.successMessage = "Item added to cart successfully";
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(getUserCart.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserCart.fulfilled, (state, action) => {
        if (action.payload) {
            state.items = action.payload.items;
            state.cartId = action.payload.cartId;
            state.totalAmount = action.payload.totalAmount;
        }
        state.isLoading = false;
      })
      .addCase(getUserCart.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(updateQuantity.fulfilled, (state, action) => {
        const { itemId, newQuantity } = action.payload;
        const item = state.items.find((item) => item.product.id === itemId);
        if (item) {
          item.quantity = newQuantity;
          item.totalPrice = item.product.price * newQuantity;
        }
        state.totalAmount = state.items.reduce(
          (total, item) => total + item.totalPrice,
          0
        );
      })
      .addCase(updateQuantity.rejected, (state, action) => {
        state.error = action.payload;
      })

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