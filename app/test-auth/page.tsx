'use client';

import { useState } from 'react';

export default function TestAuthPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testAuthAPI = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const data = await response.json();
      setResult(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setResult(null);
    }
  };

  return (
    <div className="p-8">
      <h1>Auth Test Page</h1>
      <button 
        onClick={testAuthAPI}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Test Auth API
      </button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}
      
      {result && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
