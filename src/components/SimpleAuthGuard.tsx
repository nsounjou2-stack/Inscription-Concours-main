import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";

interface SimpleAuthGuardProps {
  children: React.ReactNode;
}

const SimpleAuthGuard = ({ children }: SimpleAuthGuardProps) => {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      // Check for simple admin session
      const adminSession = localStorage.getItem("admin_session");
      const adminEmail = localStorage.getItem("admin_email");

      if (adminSession === "true" && adminEmail === "admin@concours.com") {
        setIsAuthenticated(true);
      } else {
        navigate("/simple-admin-login");
      }

      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default SimpleAuthGuard;