import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../component/services/api";
import { jwtDecode } from "jwt-decode";

// Helper to safely parse JSON from localStorage
const getStoredJSON = (key) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error(`Error parsing ${key} from localStorage`, error);
    return null;
  }
};

// Async Thunk for Login
export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      return response.data;
    } catch (error) {
      // Capture backend specific error message if available
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message || "Login failed");
      }
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  isAuthenticated: !!localStorage.getItem("authToken"),
  token: localStorage.getItem("authToken") || null,
  roles: getStoredJSON("userRoles") || [],
  userId: localStorage.getItem("userId") || null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Synchronous logout action
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.roles = [];
      state.userId = null;
      state.error = null;

      // Clear local storage
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRoles");
      localStorage.removeItem("userId");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login Pending
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Login Success
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.token = action.payload.accessToken;

        try {
          const decodedToken = jwtDecode(action.payload.accessToken);
          state.roles = decodedToken.roles || [];
          state.userId = decodedToken.id;

          localStorage.setItem("authToken", action.payload.accessToken);
          localStorage.setItem("userRoles", JSON.stringify(state.roles));
          localStorage.setItem("userId", decodedToken.id);
        } catch (error) {
          console.error("Token decoding failed:", error);
          state.error = "Invalid token received from server";
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.error = action.payload || "An error occurred during login";
      });
  },
});

export const { logout, clearError } = authSlice.actions;

export default authSlice.reducer;