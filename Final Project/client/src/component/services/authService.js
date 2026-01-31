/**
 * Clears all user authentication data and redirects to login.
 * This is isolated to prevent circular dependencies in API setups.
 */
export const logoutUser = () => {
  try {
    // Clear all auth-related items
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRoles");
    
    // Optional: Clear any other app-specific state here
    
    // Force redirect to home/login to reset application state
    window.location.href = "/login"; 
  } catch (error) {
    console.error("Error during logout:", error);
    // Fallback redirect even if storage fails
    window.location.href = "/";
  }
};