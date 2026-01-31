
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

// Layouts
import RootLayout from "./component/layout/RootLayout";

// Components
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

// Auth
import ProtectedRoute from "./component/auth/ProtectedRoute";

// Define router outside the component for better performance and stability
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
        <Route path="user/:userId/my-cart" element={<Cart />} />
        <Route path="checkout/:userId/checkout" element={<Checkout />} />
      </Route>

      {/* --- Protected Routes: Admin Only --- */}
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