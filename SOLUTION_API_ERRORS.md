# SOLUTION: Fix API Errors (500 & 404)

## Problem Analysis
The 500 error on `/api/registrations` and 404 error on `/api/registrations/stats` occur because:

1. **Backend server is not running** - Your frontend is trying to connect to `localhost:3001/api` but the server isn't started
2. **Database may not be set up** - The MySQL database `inscription_concours` needs to be created

## Step-by-Step Solution

## SQL Parameter Binding Issue - FIXED ✅

**Issue Found:** The backend was using `pool.execute()` for LIMIT/OFFSET queries, which caused MySQL parameter binding errors.

**Fix Applied:** Changed the pagination query to use `pool.query()` instead, which properly handles LIMIT and OFFSET parameters.

## Updated Quick Fix

The servers you started are working, but need to restart the backend with the fix:

### Option A: Manual Restart
```bash
# In your backend terminal, stop it (Ctrl+C) and restart:
cd server && npm start
```

### Option B: Using the restart script
```bash
chmod +x restart-backend.sh
./restart-backend.sh
```

### Option C: Quick Fix (if you can access the backend terminal)
Just stop your current backend process (Ctrl+C) and run:
```bash
cd server && npm start
```

## Verification After Restart

Once the backend restarts, test these endpoints:

1. **Registrations endpoint:**
   ```bash
   curl http://localhost:3001/api/registrations
   ```
   Should return: `{"data":[],...}` (empty array is normal)

2. **Stats endpoint:**
   ```bash
   curl http://localhost:3001/api/registrations/stats
   ```
   Should return: `{"total_registrations":0,...}`

3. **Frontend Admin section:**
   - Visit: `http://localhost:8080`
   - Navigate to Admin section
   - Should load without errors

## What Was Fixed

- ✅ **SQL parameter binding** for LIMIT/OFFSET queries
- ✅ **MySQL compatibility** for pagination
- ✅ **Database query execution** method

## Expected Results

After restarting the backend:
- ✅ No more "Incorrect arguments to mysqld_stmt_execute" errors
- ✅ API endpoints return proper JSON responses
- ✅ Admin section loads registration data
- ✅ Statistics display correctly