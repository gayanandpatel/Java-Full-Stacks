import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { privateApi } from "../../component/services/api";

// --- Async Thunks ---

// Place Order
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

// Fetch User Order History
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

// Create Payment Intent (Stripe)
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

// --- Slice ---

const initialState = {
  orders: [],
  currentOrder: null, // Useful if you need to show details of the just-placed order
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
      // --- Place Order ---
      .addCase(placeOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders.push(action.payload.order);
        state.currentOrder = action.payload.order;
        state.successMessage = action.payload.message;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // --- Fetch User Orders ---
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

      // --- Create Payment Intent ---
      .addCase(createPaymentIntent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPaymentIntent.fulfilled, (state) => {
        state.isLoading = false;
        // Note: Payment intent secret is usually returned to the component, 
        // but we track success state here.
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderError, clearOrderSuccess, resetOrderState } = orderSlice.actions;

export default orderSlice.reducer;