import React from "react";
import { Navigate } from "react-router-dom";

/**
 * A wrapper component that checks for authentication token.
 * If no token is found, redirects to the login page.
 */
const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        // Redirect to login if user is not authenticated
        return <Navigate to="/login" replace />;
    }

    // Render protected children if authenticated
    return children;
};

export default ProtectedRoute;
