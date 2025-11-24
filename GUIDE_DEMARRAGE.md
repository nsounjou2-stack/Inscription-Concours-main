# Guide de Démarrage - Inscription Concours

## Étapes pour enregistrer les étudiants dans la base de données:

### 1. Installer les dépendances du serveur backend

Ouvrez un terminal et exécutez:
```bash
cd server
npm install
```

### 2. Vérifier que la base de données existe

Connectez-vous à MySQL et créez la base de données si nécessaire:
```bash
mysql -u Nexus -p
```

Puis dans MySQL:
```sql
CREATE DATABASE IF NOT EXISTS inscription_concours;
USE inscription_concours;
SOURCE ../mysql_database_schema.sql;
```

### 3. Démarrer le serveur backend

Dans le terminal (depuis le dossier `server`):
```bash
npm start
```

Vous devriez voir: `API Server running on http://localhost:3001`

### 4. Démarrer le frontend

Dans un NOUVEAU terminal (depuis le dossier racine):
```bash
npm run dev
```

### 5. Utiliser l'application

1. Ouvrez votre navigateur à `http://localhost:8080`
2. Remplissez le formulaire d'inscription
3. Cliquez sur "Soumettre"
4. Les données seront envoyées au serveur backend
5. Le serveur enregistrera les données dans MySQL
6. Vous serez redirigé vers la page de paiement

## Vérifier que les données sont enregistrées

Dans MySQL:
```sql
USE inscription_concours;
SELECT * FROM registrations;
```

## Résolution de problèmes

Si vous voyez "Failed to fetch" dans la console:
- Vérifiez que le serveur backend est démarré sur le port 3001
- Vérifiez que MySQL est en cours d'exécution
- Vérifiez les identifiants dans le fichier `.env`

## Architecture

```
Frontend (Port 8080) → HTTP Request → Backend API (Port 3001) → MySQL Database
```

Le frontend ne se connecte JAMAIS directement à MySQL. Toutes les opérations passent par l'API backend.
