// api testing
import { useState } from 'react';

export default function TestWaitlist() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState('');

  const handleTest = async () => {
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: 1,
          name: 'Test User',
          phoneNumber: '555-123-4567'
        })
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Test Waitlist Endpoint</h1>
      <button onClick={handleTest}>Send Test Request</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {response && (
        <div>
          <h2>Response:</h2>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
