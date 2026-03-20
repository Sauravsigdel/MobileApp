# SchoolOS

SchoolOS has:

- Frontend: Expo React Native app in the project root
- Backend: Node.js + Express + Prisma API in schoolos-backend

## Run the Project (Manual)

Open two terminals from this folder:

- C:\Users\saura\OneDrive\Desktop\MobileApp

1. Start backend

```powershell
npm --prefix ".\SchoolOS\schoolos-backend" run dev
```

2. Start frontend

```powershell
npm --prefix ".\SchoolOS" run start
```

Optional frontend targets:

```powershell
npm --prefix ".\SchoolOS" run web
npm --prefix ".\SchoolOS" run android
```

## If There Is a Conflict (Windows)

### 1) Port conflict (8081, 8082, 3000)

Check who is using a port:

```powershell
Get-NetTCPConnection -State Listen -LocalPort 8081,8082,3000 | Select-Object LocalAddress,LocalPort,OwningProcess
```

Stop a specific process id:

```powershell
Stop-Process -Id <PID> -Force
```

Or stop all Node processes (quick reset):

```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

Then start services again with the run commands above.

### 2) Prisma EPERM rename / backend startup lock

If backend shows EPERM for query_engine-windows.dll.node:

```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
npm --prefix ".\SchoolOS\schoolos-backend" run dev
```

### 3) Table does not exist (Prisma database schema missing)

If backend says table public.User does not exist:

```powershell
npm --prefix ".\SchoolOS\schoolos-backend" exec prisma db push
```

Then restart backend:

```powershell
npm --prefix ".\SchoolOS\schoolos-backend" run dev
```

## Quick Health Checks

Backend health:

```powershell
Invoke-WebRequest -UseBasicParsing http://localhost:3000/ | Select-Object -ExpandProperty Content
```

Check frontend port:

```powershell
Get-NetTCPConnection -State Listen -LocalPort 8081,8082 -ErrorAction SilentlyContinue | Select-Object LocalAddress,LocalPort,OwningProcess
```
