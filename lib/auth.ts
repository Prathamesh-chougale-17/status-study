import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import client from "./mongodb";

export const auth = betterAuth({
  database: mongodbAdapter(client.db("study-dashboard"), {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client
  }),
  
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // Simplified for single user
    minPasswordLength: 6, // Shorter for testing
    maxPasswordLength: 128,
  },
  
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
      },
    },
  },
  
  plugins: [
    nextCookies() // This must be the last plugin
  ],
  
  // Advanced security settings
  advanced: {
    generateId: () => crypto.randomUUID(),
    crossSubDomainCookies: {
      enabled: false,
    },
  },
  
  // Only allow admin email to register/sign in
  callbacks: {
    user: {
      create: {
        before: async (user: { email: string; }) => {
          // Only allow your admin email
          const adminEmail = process.env.ADMIN_EMAIL || "admin@yourdomain.com";
          if (user.email !== adminEmail) {
            throw new Error("Registration is restricted to authorized users only");
          }
          return {
            ...user,
            role: "admin"
          };
        }
      },
      signIn: {
        before: async (user: { email: string; }) => {
          // Only allow your admin email
          const adminEmail = process.env.ADMIN_EMAIL || "admin@yourdomain.com";
          if (user.email !== adminEmail) {
            throw new Error("Access is restricted to authorized users only");
          }
        }
      }
    }
  }
});
