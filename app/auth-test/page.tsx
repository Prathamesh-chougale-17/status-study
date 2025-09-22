import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function AuthTestPage() {
  let session = null;
  let error = null;

  try {
    session = await auth.api.getSession({
      headers: await headers()
    });
  } catch (err) {
    error = err instanceof Error ? err.message : 'Unknown error';
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Session Status:</h2>
        {session ? (
          <div className="bg-green-100 p-4 rounded">
            <p><strong>✅ Authenticated</strong></p>
            <p>User: {session.user.email}</p>
            <p>Role: {session.user.role}</p>
            <p>Name: {session.user.name}</p>
          </div>
        ) : (
          <div className="bg-red-100 p-4 rounded">
            <p><strong>❌ Not authenticated</strong></p>
            {error && <p>Error: {error}</p>}
          </div>
        )}
      </div>

      <div className="space-y-4">
        <a href="/sign-in" className="block bg-blue-500 text-white px-4 py-2 rounded text-center">
          Go to Sign In
        </a>
        <a href="/api/create-admin" className="block bg-green-500 text-white px-4 py-2 rounded text-center">
          Create Admin User (Click this first)
        </a>
        <a href="/api/auth-status" className="block bg-gray-500 text-white px-4 py-2 rounded text-center">
          Check Auth Status (API)
        </a>
      </div>
    </div>
  );
}
