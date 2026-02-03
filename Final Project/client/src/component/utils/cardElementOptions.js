export const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#111111",
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#888888", 
      },
      iconColor: "#c38212",
    },
    invalid: {
      color: "#dc2626",
      iconColor: "#dc2626",
    },
    complete: {
      color: "#2e7d32",
      iconColor: "#2e7d32",
    },
  },
  hidePostalCode: true,
};