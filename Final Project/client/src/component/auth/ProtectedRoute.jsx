import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useLocation, Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles = [], useOutlet = false }) => {
  const location = useLocation();
  //Default roles to empty array to prevent crashes if undefined
  const { isAuthenticated, roles = [] } = useSelector((state) => state.auth);

  // Check Authentication first
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role Authorization Logic
  // If allowedRoles is empty, we assume no specific role is needed (optional, depends on your needs)
  // If allowedRoles has items, we check them.
  if (allowedRoles.length > 0) {
    const userRolesLower = roles.map((role) => role.toLowerCase());
    const allowedRolesLower = allowedRoles.map((role) => role.toLowerCase());

    const isAuthorized = userRolesLower.some((userRole) =>
      allowedRolesLower.includes(userRole)
    );

    if (!isAuthorized) {
      return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }
  }

  // Render children or Outlet
  return useOutlet ? <Outlet /> : children;
};

// Define PropTypes to fix the red squiggly lines
ProtectedRoute.propTypes = {
  children: PropTypes.node,
  allowedRoles: PropTypes.arrayOf(PropTypes.string),
  useOutlet: PropTypes.bool,
};

export default ProtectedRoute;