import { configureStore } from "@reduxjs/toolkit";
import searchReducer from "../store/features/searchSlice";
import categoryReducer from "../store/features/categorySlice";
import productReducer from "../store/features/productSlice";
import paginationReducer from "../store/features/paginationSlice";
import cartReducer from "../store/features/cartSlice";
import orderReducer from "../store/features/orderSlice";
import imageReducer from "../store/features/imageSlice";
import userReducer from "../store/features/userSlice";
import authReducer from "../store/features/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,       // Auth usually comes first logically
    user: userReducer,
    product: productReducer,
    category: categoryReducer,
    cart: cartReducer,
    order: orderReducer,
    search: searchReducer,
    pagination: paginationReducer,
    image: imageReducer,
  },
  // Optional: explicitly enable DevTools for development only if needed
  // devTools: process.env.NODE_ENV !== 'production', 
  
  // Middleware: Default middleware is usually sufficient (includes thunk)
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Useful if you ever accidentally store non-serializable data
    }),
});