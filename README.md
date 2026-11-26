# PendakiLog

Expo React Native app for managing personal mountain logs with Supabase Auth and Postgres.

## Setup

1. Install the project dependencies:

   ```bash
   npm install
   ```

2. Create a Supabase project and copy `.env.example` to `.env.local`. Set
   `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY` using the
   project URL and public anon key from the Supabase dashboard. Never use a
   `service_role` key in the app.

3. Run the SQL in
   [`supabase/migrations/20260501000000_create_mountain_logs.sql`](./supabase/migrations/20260501000000_create_mountain_logs.sql)
   once in the Supabase SQL Editor. It creates the `mountain_logs` table and
   enables row-level security so each signed-in user can access only their own
   records.

4. Start Expo:

   ```bash
   npx expo start
   ```

The app supports email sign-up with a callsign, email/password sign-in, session
restoration, sign-out, and protected app routes. Native sessions are persisted
with `expo-secure-store`. On web, session storage is memory-only because
SecureStore is not supported there.

Mountain records are stored in Supabase and support listing, pull-to-refresh,
create, update, and delete. The detail screen also loads current weather from
Open-Meteo.
