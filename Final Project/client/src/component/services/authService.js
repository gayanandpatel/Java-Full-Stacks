export const logoutUser = () => {
  try {
    // Clear all auth-related items from storage
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRoles");
    
    // Redirect to login with a specific message query parameter
    // This allows the Login component to display a toast notification
    window.location.href = "/login?message=session_expired"; 
    
  } catch (error) {
    console.error("Error during logout:", error);
    window.location.href = "/login?message=session_expired";
  }
};