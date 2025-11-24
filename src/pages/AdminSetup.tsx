import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const AdminSetup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-redirect after 3 seconds
    const timer = setTimeout(() => {
      navigate("/simple-admin-login");
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <Check className="h-5 w-5 text-green-600" />
            Configuration Supprimée
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Supabase a été supprimé de l'application.
            </p>
            <p className="text-sm text-muted-foreground">
              L'application utilise maintenant l'authentification simple.
            </p>
            <p className="text-sm font-medium">
              Connectez-vous avec : admin@concours.com / admin
            </p>
          </div>
          
          <Button
            onClick={() => navigate("/simple-admin-login")}
            className="w-full"
          >
            Accéder à la Page de Connexion
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            Redirection automatique dans quelques secondes...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetup;