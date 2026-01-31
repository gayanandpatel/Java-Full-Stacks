import React from "react";
import { useSelector } from "react-redux";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [], useOutlet = false }) => {
  const location = useLocation();
  const { isAuthenticated, roles } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    // Redirect them to the login page, but save the current location they were
    // trying to go to when they were redirected. This allows us to send them
    // along to that page after they login, which is a nicer user experience.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Normalize roles to lowercase for safe comparison
  const userRolesLower = roles.map((role) => role.toLowerCase());
  const allowedRolesLower = allowedRoles.map((role) => role.toLowerCase());

  // Check if user has at least one of the allowed roles
  const isAuthorized = userRolesLower.some((userRole) =>
    allowedRolesLower.includes(userRole)
  );

  if (isAuthorized) {
    return useOutlet ? <Outlet /> : children;
  } else {
    // User is logged in but doesn't have permission
    return <Navigate to="/unauthorized" state={{ from: location }} replace />;
  }
};

export default ProtectedRoute;