## Remember

An app to help you remember things about the people around you.

## Tech Stack

* Golang (backend)
* React Native with Expo (frontend)
* PostgreSQL (database)
* Docker (containerized dev environment)

## How to Build

1. Clone the repository:

   ```bash
   git clone https://github.com/KaranJayakumar/remember
   cd remember
   ```

2. Set up the frontend:

   ```bash
   cd frontend
   npm install
   npx expo start
   ```

3. Set up the backend:
   From the root directory, run:

   ```bash
   docker compose up -d
   ```

## Environment Setup

### Backend `.env`

Create a `.env` file in the server directory with the following values:

```
POSTGRES_ENT_CONN_STRING=postgres://<user>:<password>@<host>:<port>/<database>?sslmode=disable
CLERK_SECRET_KEY=<your-clerk-secret-key>
CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
```

### Frontend `.env`

Create a `.env` file in the `frontend` directory:

```
EXPO_PUBLIC_API_URL=https://<your-local-ip>:8888
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-publishable-key>
```

Note: Replace `<your-local-ip>` with your actual local network IP (e.g. `178.18.17.1231`). Your mobile device must be on the same network as your development machine for the API to work during development.
