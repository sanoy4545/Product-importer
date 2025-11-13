import React, { useEffect, useState } from 'react'

export default function App() {
  const [msg, setMsg] = useState('Loading...')

  useEffect(() => {
    fetch('/api/hello')
      .then((r) => r.json())
      .then((d) => setMsg(d.message))
      .catch(() => setMsg('Could not reach backend'))
  }, [])

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: 20 }}>
      <h1>Product Frontend</h1>
      <p>Backend says: {msg}</p>
      <p>
        Note: If the frontend is served on a different port than the backend,
        configure a proxy (or run both on same origin) or enable CORS on the
        backend.
      </p>
    </div>
  )
}
