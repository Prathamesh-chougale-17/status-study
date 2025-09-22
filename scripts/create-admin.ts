import { auth } from "../lib/auth";

async function createAdminUser() {
  const email = process.env.ADMIN_EMAIL || "admin@yourdomain.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";

  try {
    
    const result = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: "Admin"
      }
    });

    // Check if the result contains a token; if not, treat as error
    if (!("token" in result) || !result.token) {
      console.error("Error creating admin user: Unknown error or user already exists.");
      process.exit(1);
    }

  } catch (error) {
    console.error("Failed to create admin user:", error);
    process.exit(1);
  }
}

createAdminUser();
