import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/Lasiru/ToastProvider";

export const useLogout = () => {
    const navigate = useNavigate();
    const { showToast } = useToast();

    const handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            // Clear authentication data
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            
            // Optional: Clear additional session data if any
            // sessionStorage.clear();

            // Show success message
            showToast("success", "Logged out successfully. See you again!");

            // Redirect to login page
            navigate("/login");
        }
    };

    return { handleLogout };
};
