import React from 'react'

import { Navigate } from "react-router-dom";
import { isAuthenticated, getRole } from "../utils/auth";

const ProtectedRoute = ({ children, allowedRoles }) => {

  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  console.log("Allowed Roles:", allowedRoles);
console.log("Role from getRole():", `"${getRole()}"`);
console.log("Type:", typeof getRole());

  if (allowedRoles && !allowedRoles.includes(getRole())) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute
