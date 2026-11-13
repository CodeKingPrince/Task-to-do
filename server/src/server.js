import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  // Keep-alive self-ping for free tier hosting (runs every 10 minutes)
  const serverUrl =
    process.env.RENDER_EXTERNAL_URL ||
    process.env.SERVER_URL ||
    (process.env.NODE_ENV === 'production'
      ? 'https://task-to-do-3yw8.onrender.com'
      : null);

  if (serverUrl) {
    const PING_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes
    console.log(`Keep-alive self-ping configured for: ${serverUrl}/api/health`);

    setInterval(async () => {
      try {
        const response = await fetch(`${serverUrl}/api/health`);
        if (response.ok) {
          console.log(
            `[Keep-Alive] Pinged ${serverUrl}/api/health successfully at ${new Date().toISOString()}`
          );
        }
      } catch (err) {
        console.error('[Keep-Alive] Failed to ping health endpoint:', err.message);
      }
    }, PING_INTERVAL_MS);
  }
});
