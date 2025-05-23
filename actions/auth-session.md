# Authentication Sessions - Better Auth Integration

This file documents the migration from the previous authentication system to Better Auth and how to use the new authentication functions.

## Key Changes

1. Replaced `validateRequest()` from `@/lib/auth` with a new implementation in `@/actions/auth-session`
2. Added helper functions for authentication in `@/actions/auth-session`:
   - `getSession()`: Gets the current session
   - `getCurrentUser()`: Gets the current user
   - `isAuthenticated()`: Checks if the user is authenticated
   - `validateRequest()`: Compatibility function with the old API
3. Updated all references to `validateRequest` to use the new path
4. Replaced all `lucia` operations with Better Auth equivalents:
   - Session creation now uses `auth.api.createSession`
   - Session invalidation (logout) now uses `auth.api.signOut`
   - Sign in now uses `auth.api.signInEmail`

## How to Use

### Getting the Current Session

```typescript
import { getSession } from "@/actions/auth-session";

// In a server component or server action
const session = await getSession();
if (session) {
  // User is authenticated
  console.log(session.user);
} else {
  // User is not authenticated
}
```

### Getting the Current User

```typescript
import { getCurrentUser } from "@/actions/auth-session";

// In a server component or server action
const user = await getCurrentUser();
if (user) {
  // User is authenticated
  console.log(user.email);
} else {
  // User is not authenticated
}
```

### Checking Authentication Status

```typescript
import { isAuthenticated } from "@/actions/auth-session";

// In a server component or server action
const authenticated = await isAuthenticated();
if (authenticated) {
  // User is authenticated
} else {
  // User is not authenticated
}
```

### Using the Compatibility Function

If you're migrating from the old system, you can use the `validateRequest` function to maintain compatibility:

```typescript
import { validateRequest } from "@/actions/auth-session";

// In a server component or server action
const { user, session } = await validateRequest();
if (user) {
  // User is authenticated
} else {
  // User is not authenticated
}
```

## Client-Side Authentication

For client-side authentication, continue using the `authClient` from `@/lib/auth-client.ts`:

```typescript
"use client";

import { authClient } from "@/lib/auth-client";

// Get the session
const { data: session } = await authClient.getSession();

// Sign out
await authClient.signOut();
```

## Migration Path

1. Replace imports from `@/lib/auth` with imports from `@/actions/auth-session`
2. Update any server actions that use lucia directly to use the Better Auth API

See the Better Auth documentation for more details: https://www.better-auth.com/docs/basic-usage
