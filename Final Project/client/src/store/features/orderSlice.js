import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../../component/services/api";

export const placeOrder = createAsyncThunk(
  "order/placeOrder",
  async ({ userId }, { rejectWithValue }) => {
    try {
      const response = await privateApi.post(`/orders/user/${userId}/place-order`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to place order"
      );
    }
  }
);
export const fetchUserOrders = createAsyncThunk(
  "order/fetchUserOrders",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await privateApi.get(`/orders/user/${userId}/orders`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch order history"
      );
    }
  }
);

export const createPaymentIntent = createAsyncThunk(
  "order/createPaymentIntent",
  async ({ amount, currency }, { rejectWithValue }) => {
    try {
      const response = await privateApi.post("/orders/create-payment-intent", {
        amount,
        currency,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Payment initialization failed"
      );
    }
  }
);

const initialState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
  successMessage: null,
};

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearOrderSuccess: (state) => {
      state.successMessage = null;
    },
    resetOrderState: (state) => {
      state.currentOrder = null;
      state.isLoading = false;
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        
        const newOrder = action.payload.data;
        if (newOrder) {
          state.orders.push(newOrder);
          state.currentOrder = newOrder;
        }
        state.successMessage = action.payload.message;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(createPaymentIntent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderError, clearOrderSuccess, resetOrderState } = orderSlice.actions;

export default orderSlice.reducer;