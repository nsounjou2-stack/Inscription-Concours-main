# Backend API Server

This is the backend API server for the Inscription Concours application. It handles all database operations using MySQL.

## Setup

1. Install dependencies:
```bash
cd server
npm install
```

2. Configure environment variables:
Make sure the `.env` file in the root directory has the correct database credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=inscription_concours
API_PORT=3001
```

3. Create the database:
Run the SQL schema from the root directory:
```bash
mysql -u root -p < mysql_database_schema.sql
```

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will run on `http://localhost:3001` by default.

## API Endpoints

- `POST /api/registrations` - Create a new registration
- `GET /api/registrations/:id` - Get registration by ID
- `GET /api/registrations` - Get all registrations (with pagination)
- `PUT /api/registrations/:id` - Update registration
- `PUT /api/registrations/:id/payment` - Update payment status
- `DELETE /api/registrations/:id` - Delete registration
- `GET /api/registrations/stats` - Get registration statistics

## Running Both Frontend and Backend

1. Terminal 1 - Start the backend:
```bash
cd server
npm run dev
```

2. Terminal 2 - Start the frontend:
```bash
npm run dev
```

The frontend will be available at `http://localhost:8080` and will communicate with the backend at `http://localhost:3001`.
