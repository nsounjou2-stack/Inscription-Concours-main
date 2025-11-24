import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";

const AdminLoginTest = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate("/simple-admin-login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <X className="h-5 w-5 text-red-600" />
            Supabase Supprimé
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-center gap-2 text-sm">
                <X className="h-4 w-4 text-red-500" />
                <span className="text-muted-foreground">Supabase Supprimé</span>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500" />
                <span className="text-muted-foreground">Authentification Simple Active</span>
              </div>
            </div>
            
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>La fonction de test d'authentification Supabase n'est plus disponible.</p>
              <p>L'application utilise maintenant :</p>
              <div className="bg-gray-50 p-3 rounded border font-mono text-xs">
                <div>Email: admin@concours.com</div>
                <div>Mot de passe: admin</div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="flex-1"
            >
              Accueil
            </Button>
            <Button
              onClick={() => navigate("/simple-admin-login")}
              className="flex-1"
            >
              Page de Connexion
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground">
            Redirection automatique dans {countdown} secondes...
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLoginTest;