export const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#111111", // Darker, sharper text
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif", // Matches your app font
      fontSmoothing: "antialiased",
      "::placeholder": {
        color: "#888888", // Subtle placeholder
      },
      iconColor: "#c38212", // Your Brand Orange
    },
    invalid: {
      color: "#dc2626", // Standard Error Red
      iconColor: "#dc2626",
    },
    complete: {
      color: "#2e7d32", // Success Green
      iconColor: "#2e7d32",
    },
  },
  hidePostalCode: true,
};