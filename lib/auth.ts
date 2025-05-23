
import {db} from "@/db/drizzle";
import {betterAuth} from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import {emailOTP, magicLink, oneTap, phoneNumber, twoFactor, username} from "better-auth/plugins";
import { headers } from "next/headers";

export const auth = betterAuth({
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
    apiUrl: '/api/auth',

    database: drizzleAdapter(db, {
        provider: "pg",
        usePlural: true,
    }),
    
    // Add session configuration with cookie caching to avoid database hits
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60 // Cache duration in seconds (5 minutes)
        },
        // Set the session expiration to 7 days
        expiresIn: 60 * 60 * 24 * 7, // 7 days
        updateAge: 60 * 60 * 24 // update session expiration every 1 day
    },

    user: {
        additionalFields: {
            firstName: {
                type: "string",
                required: false,
            },
            lastName: {
                type: "string",
                required: false,
            },
            timezone: {
                type: "string",
                required: false,
            },
        }
    },

    emailAndPassword: {
        enabled: true
    },

    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        },
        linkedin: {
            clientId: process.env.LINKEDIN_CLIENT_ID as string,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
        },

        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    appName: "IntoKit",
    plugins: [
        username(),
        emailOTP({
            async sendVerificationOTP({ email, otp, type}) {
                console.log("Sending OTP to", email, otp, type);
            },
        }),
        phoneNumber({
            sendOTP: ({ phoneNumber, code }, request) => {
                console.log("Sending OTP to", phoneNumber, code);
                console.log('request', request);
            }
        }),
        oneTap(),
        magicLink({
            sendMagicLink: async ({ email, token, url }, request) => {
               console.log(email, token, url);
                console.log('request', request);
            }
        }),
        twoFactor()
    ]
})

// Create a NextAuth-compatible getServerSession function for Better Auth
// WARNING: DEPRECATED - Use the server actions instead
// Import { getSession, getCurrentUser, isAuthenticated } from "@/actions/auth-session"
export async function getServerSession() {
  console.error("DEPRECATED: getServerSession() is deprecated - please import { getSession } from '@/actions/auth-session' instead");
  try {
    // Use the Better Auth recommended approach to get a session
    const session = await auth.api.getSession({
        headers: await headers()
    });
    
    if (!session) {
      return null;
    }
    
    // Return in a format similar to NextAuth for compatibility
    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: `${session.user.firstName || ''} ${session.user.lastName || ''}`.trim() || undefined,
        image: session.user.image || undefined,
        // Add any other needed fields
      },
      expires: new Date(session.session.expiresAt).toISOString()
    };
  } catch (error) {
    console.error("Error fetching server session:", error);
    return null;
  }
}

// DEPRECATED: This is a wrapper around the new auth-session validateRequest function
// to maintain backward compatibility with existing code
export async function validateRequest() {
  console.error("DEPRECATED: import {validateRequest} from '@/lib/auth' is deprecated - please import {validateRequest} from '@/actions/auth-session' instead");
  
  const { validateRequest: newValidateRequest } = await import("@/actions/auth-session");
  return newValidateRequest();
}