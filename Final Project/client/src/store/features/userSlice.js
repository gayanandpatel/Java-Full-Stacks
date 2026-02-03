import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api, privateApi } from "../../component/services/api";
import axios from "axios";

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

export const getCountryNames = createAsyncThunk(
  "user/getCountryNames",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("https://restcountries.com/v3.1/all");
      const countryNames = response.data.map((country) => ({
        name: country.name.common,
        code: country.cca2,
      }));
      countryNames.sort((a, b) => a.name.localeCompare(b.name));
      return countryNames;
    } catch {
      return rejectWithValue("Failed to load country list");
    }
  }
);


export const addAddress = createAsyncThunk(
  "user/addAddress",
  async ({ address, userId }, { dispatch, rejectWithValue }) => {
    try {
      const response = await privateApi.post(`/addresses/${userId}/new`, [address]);
      if (userId) {
        dispatch(getUserById(userId));
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add address");
    }
  }
);

export const updateAddress = createAsyncThunk(
  "user/updateAddress",
  async ({ id, userId, address }, { dispatch, rejectWithValue }) => {
    try {
      const addressId = encodeURIComponent(String(id).trim());
      const cleanPayload = {
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        postalCode: address.postalCode || "",
        country: address.country || "",
        mobileNumber: address.mobileNumber ? String(address.mobileNumber) : "", 
        addressType: address.addressType || "HOME",
      };

      const response = await privateApi.put(`/addresses/${addressId}/update`, cleanPayload);

      if (userId) {
        dispatch(getUserById(userId));
      }
      
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update address");
    }
  }
);

export const deleteAddress = createAsyncThunk(
  "user/deleteAddress",
  async ({ id, userId }, { dispatch, rejectWithValue }) => {
    try {
      const addressId = encodeURIComponent(String(id).trim());
      const response = await privateApi.delete(`/addresses/${addressId}/delete`);
      if (userId) {
        dispatch(getUserById(userId));
      }

      return { id, message: response.data?.message };
    } catch (error) {
      const message = 
        error.response?.data?.message || 
        "Cannot delete this address (it might be used in an order).";
      return rejectWithValue(message);
    }
  }
);

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
    setUser(state, action) {
      state.user = action.payload;
    },
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
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.successMessage = "Registration successful!";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(getCountryNames.fulfilled, (state, action) => {
        state.countryNames = action.payload;
      })
      .addCase(addAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addAddress.fulfilled, (state) => {
        state.isLoading = false;
        state.successMessage = "Address added successfully";
      })
      .addCase(addAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateAddress.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updateAddress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.message || "Address deleted";
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