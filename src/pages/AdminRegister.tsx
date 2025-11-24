import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";

const AdminRegister = () => {
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
            Configuration Terminée
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              L'application utilise maintenant l'authentification simple.
            </p>
            <p className="text-sm text-muted-foreground">
              Aucun enregistrement de compte n'est nécessaire.
            </p>
            <p className="text-sm font-medium">
              Utilisation : admin@concours.com / admin
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/simple-admin-login")}
              className="flex-1"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Page de Connexion
            </Button>
            <Button
              onClick={() => navigate("/simple-admin-login")}
              className="flex-1"
            >
              Accéder à l'Admin
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            Redirection automatique dans quelques secondes...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRegister;