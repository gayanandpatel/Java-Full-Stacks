import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, privateApi } from "../../component/services/api";
import axios from "axios";

// --- Async Thunks ---

// Get User Profile
export const getUserById = createAsyncThunk(
  "user/getUserById",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await privateApi.get(`/users/user/${userId}/user`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch user profile"
      );
    }
  }
);

// Register User
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async ({ user, addresses }, { rejectWithValue }) => {
    try {
      const payload = {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        addressList: addresses,
      };
      const response = await api.post("/users/add", payload);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Registration failed"
      );
    }
  }
);

// Get Country Names (External API)
export const getCountryNames = createAsyncThunk(
  "user/getCountryNames",
  async (_, { rejectWithValue }) => {
    try {
      // Use plain axios to avoid sending app credentials to external API
      const response = await axios.get("https://restcountries.com/v3.1/all");
      const countryNames = response.data.map((country) => ({
        name: country.name.common,
        code: country.cca2,
      }));
      // Sort alphabetically
      countryNames.sort((a, b) => a.name.localeCompare(b.name));
      return countryNames;
    } catch (error) {
      return rejectWithValue("Failed to load country list");
    }
  }
);

// --- Address Management Thunks ---

export const addAddress = createAsyncThunk(
  "user/addAddress",
  async ({ address, userId }, { rejectWithValue }) => {
    try {
      // Note: Backend seems to expect an array based on previous code
      const response = await privateApi.post(`/addresses/${userId}/new`, [address]);
      return response.data; // Expecting the added address or updated list
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add address");
    }
  }
);

export const updateAddress = createAsyncThunk(
  "user/updateAddress",
  async ({ id, address }, { rejectWithValue }) => {
    try {
      const response = await privateApi.put(`/addresses/${id}/update`, address);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update address");
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "user/deleteAddress",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await privateApi.delete(`/addresses/${id}/delete`);
      return { id, message: response.data?.message };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to delete address");
    }
  }
);

// --- Slice ---

const initialState = {
  user: null,
  countryNames: [],
  isLoading: false,
  error: null,
  successMessage: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Manual setters if needed
    setUser(state, action) {
      state.user = action.payload;
    },
    // Helper to manually update address list in store without refetching
    setUserAddresses(state, action) {
      if (state.user) {
        state.user.addressList = action.payload;
      }
    },
    clearUserError: (state) => {
      state.error = null;
    },
    clearUserSuccess: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- Get User ---
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // --- Register User ---
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload; // Assuming backend returns user object on register
        state.successMessage = "Registration successful!";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // --- Get Countries ---
      .addCase(getCountryNames.fulfilled, (state, action) => {
        state.countryNames = action.payload;
      })

      // --- Add Address ---
      .addCase(addAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = "Address added successfully";
        // If backend returns the specific added address, push it. 
        // If backend returns generic success, you might need to refetch or rely on component to update list.
        // Assuming optimistic update logic is handled via setUserAddresses in component or here:
        // Ideally, backend returns the new address object.
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // --- Update Address ---
      .addCase(updateAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = "Address updated successfully";
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // --- Delete Address ---
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message || "Address deleted";
        // Remove from local state immediately
        if (state.user && state.user.addressList) {
          state.user.addressList = state.user.addressList.filter(
            (addr) => addr.id !== action.payload.id
          );
        }
      })
      .addCase(deleteAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  setUser, 
  setUserAddresses, 
  clearUserError, 
  clearUserSuccess 
} = userSlice.actions;

export default userSlice.reducer;