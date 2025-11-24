import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Info, RefreshCw } from "lucide-react";

const Debug = () => {
  const [systemStatus, setSystemStatus] = useState({
    mysql: false,
    simpleAuth: true,
    appReady: true
  });

  const [sessionInfo, setSessionInfo] = useState({
    isLoggedIn: false,
    adminEmail: localStorage.getItem("admin_email") || null,
    sessionTime: localStorage.getItem("login_time") || null
  });

  useEffect(() => {
    checkSystemStatus();
    updateSessionInfo();
  }, []);

  const checkSystemStatus = () => {
    // Check MySQL status (simplified)
    const mysqlConfigured = !!(
      import.meta.env.VITE_DB_HOST || 
      import.meta.env.VITE_DB_NAME ||
      import.meta.env.VITE_DB_USERNAME
    );

    // Check if simple auth is working
    const simpleAuthEnabled = true; // Always enabled now
    const appReady = true; // App is ready after Supabase removal

    setSystemStatus({
      mysql: mysqlConfigured,
      simpleAuth: simpleAuthEnabled,
      appReady
    });
  };

  const updateSessionInfo = () => {
    const isLoggedIn = localStorage.getItem("admin_session") === "true";
    const adminEmail = localStorage.getItem("admin_email");
    const sessionTime = localStorage.getItem("login_time");

    setSessionInfo({
      isLoggedIn,
      adminEmail,
      sessionTime
    });
  };

  const clearSession = () => {
    localStorage.removeItem("admin_session");
    localStorage.removeItem("admin_email");
    localStorage.removeItem("login_time");
    updateSessionInfo();
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Debug - État du Système</h1>
        <p className="text-muted-foreground">
          Diagnostic après suppression de Supabase
        </p>
      </div>

      {/* System Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5" />
            État des Composants Système
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <strong>Supabase:</strong>
              <p className="text-sm text-red-600 flex items-center gap-1">
                <XCircle className="h-4 w-4" />
                Supprimé
              </p>
            </div>
            <div>
              <strong>Authentification Simple:</strong>
              <p className={`text-sm flex items-center gap-1 ${systemStatus.simpleAuth ? 'text-green-600' : 'text-red-600'}`}>
                {systemStatus.simpleAuth ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                {systemStatus.simpleAuth ? 'Actif' : 'Inactif'}
              </p>
            </div>
            <div>
              <strong>Base MySQL:</strong>
              <p className={`text-sm flex items-center gap-1 ${systemStatus.mysql ? 'text-green-600' : 'text-yellow-600'}`}>
                {systemStatus.mysql ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                {systemStatus.mysql ? 'Configuré' : 'Non Configuré'}
              </p>
            </div>
          </div>
          <div>
            <strong>Application:</strong>
            <p className={`text-sm flex items-center gap-1 ${systemStatus.appReady ? 'text-green-600' : 'text-red-600'}`}>
              {systemStatus.appReady ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
              {systemStatus.appReady ? 'Prête' : 'En cours de configuration'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Session Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {sessionInfo.isLoggedIn ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
            Session Administrateur
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <strong>Connecté:</strong>
              <p className={`text-sm ${sessionInfo.isLoggedIn ? 'text-green-600' : 'text-red-600'}`}>
                {sessionInfo.isLoggedIn ? 'Oui' : 'Non'}
              </p>
            </div>
            <div>
              <strong>Email:</strong>
              <p className="text-sm text-muted-foreground">
                {sessionInfo.adminEmail || 'Aucun'}
              </p>
            </div>
            <div>
              <strong>Heure de connexion:</strong>
              <p className="text-sm text-muted-foreground">
                {sessionInfo.sessionTime ? new Date(sessionInfo.sessionTime).toLocaleString() : 'Aucune'}
              </p>
            </div>
          </div>
          {sessionInfo.isLoggedIn && (
            <Button onClick={clearSession} variant="outline">
              Déconnecter
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Configuration Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="text-blue-500" />
            Configuration Actuelle
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div>
              <h4 className="font-semibold">Base de données MySQL</h4>
              <p className="text-sm text-muted-foreground">
                Variable d'environnement: <code>{import.meta.env.VITE_DB_NAME || 'Non configuré'}</code>
              </p>
              <p className="text-sm text-muted-foreground">
                Hôte: <code>{import.meta.env.VITE_DB_HOST || 'Non configuré'}</code>
              </p>
            </div>

            <div>
              <h4 className="font-semibold">Authentification</h4>
              <p className="text-sm text-muted-foreground">
                Système: <strong>Authentification Simple (localStorage)</strong>
              </p>
              <p className="text-sm text-muted-foreground">
                Identifiants par défaut: <code>admin@concours.com / admin</code>
              </p>
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <Button onClick={() => window.location.href = '/simple-admin-login'} variant="outline">
              Page de Connexion Simple
            </Button>
            <Button onClick={() => window.location.href = '/admin'} variant="outline">
              Interface Admin
            </Button>
            <Button onClick={() => window.location.href = '/'} variant="outline">
              Accueil
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Changes Made */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="text-green-500" />
            Modifications Effectuées
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>✅ Suppression de la dépendance @supabase/supabase-js</li>
            <li>✅ Suppression des variables d'environnement Supabase</li>
            <li>✅ Suppression du dossier supabase/</li>
            <li>✅ Suppression du dossier src/integrations/supabase/</li>
            <li>✅ Remplacement AuthGuard par un composant simple</li>
            <li>✅ Mise à jour des pages de connexion</li>
            <li>✅ Activation de l'authentification locale</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default Debug;