import React from "react";

const ProtectedRoute = ({ children, currentUser }) => {
  if (!currentUser || currentUser.role !== "Admin") {
    return <p>Access denied. Vous n'êtes pas autorisé à voir cette page.</p>;
  }
  return <>{children}</>;
};

export default ProtectedRoute;