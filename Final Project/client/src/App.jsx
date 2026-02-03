import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import RootLayout from "./component/layout/RootLayout";

import Home from "./component/home/Home";
import Products from "./component/product/Products";
import ProductDetails from "./component/product/ProductDetails";
import Cart from "./component/cart/Cart";
import AddProduct from "./component/product/AddProduct";
import ProductUpdate from "./component/product/ProductUpdate";
import UserRegistration from "./component/user/UserRegistration";
import Login from "./component/auth/Login";
import UserProfile from "./component/user/UserProfile";
import Checkout from "./component/checkout/Checkout";
import Unauthorized from "./component/Unauthorized";

import ProtectedRoute from "./component/auth/ProtectedRoute";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      {/* --- Public Routes --- */}
      <Route index element={<Home />} />
      <Route path="register" element={<UserRegistration />} />
      <Route path="login" element={<Login />} />
      <Route path="unauthorized" element={<Unauthorized />} />

      {/* --- Product Routes --- */}
      <Route path="products" element={<Products />} />
      <Route path="products/:name" element={<Products />} />
      <Route
        path="products/category/:categoryId/products"
        element={<Products />}
      />
      <Route path="product/:productId/details" element={<ProductDetails />} />

      {/* --- Protected Routes: User & Admin --- */}
      <Route
        element={
          <ProtectedRoute
            useOutlet={true}
            allowedRoles={["ROLE_ADMIN", "ROLE_USER"]}
          />
        }
      >
        <Route path="user-profile" element={<UserProfile />} />
        <Route path="user-profile/:userId/profile" element={<UserProfile />} />
        
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
      </Route>

      <Route
        element={
          <ProtectedRoute useOutlet={true} allowedRoles={["ROLE_ADMIN"]} />
        }
      >
        <Route path="add-product" element={<AddProduct />} />
        <Route
          path="update-product/:productId/update"
          element={<ProductUpdate />}
        />
      </Route>
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;