import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

// Styles
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

// Application
import App from "./App.jsx";
import { store } from "./store/store.js";

// Stripe Initialization
const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

if (!STRIPE_KEY) {
  console.error(
    "Stripe Public Key is missing! Please check your .env file for VITE_STRIPE_PUBLIC_KEY."
  );
}

const stripePromise = loadStripe(STRIPE_KEY);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </Provider>
  </StrictMode>
);