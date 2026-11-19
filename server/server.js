const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

const allowedOrigins = [
  'http://localhost:5173',
  process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, true); // Permits API calls from deployment previews
    }
  },
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  if (process.env.CLIENT_URL) {
    return res.redirect(302, process.env.CLIENT_URL);
  }

  res.type('html').send(`<!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Kohai</title>
        <style>
          body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #101014; color: #f5f2fa; font: 16px system-ui, sans-serif; }
          main { width: min(520px, calc(100% - 48px)); padding: 32px; border: 1px solid #34313c; border-radius: 20px; background: #19171f; }
          .brand { color: #c4a7ff; font-weight: 700; letter-spacing: .16em; }
          h1 { margin-bottom: 8px; }
          p { color: #b8b2c2; line-height: 1.6; }
          nav { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 24px; }
          a { color: #d7c6ff; }
        </style>
      </head>
      <body>
        <main>
          <div class="brand">KOHAI</div>
          <h1>Service is online</h1>
          <p>This service powers the Kohai website. Open the website to browse anime and dramas.</p>
          <nav>
            <a href="/health">Service status</a>
            <a href="/api/anime">Anime data</a>
            <a href="/api/drama">Drama data</a>
          </nav>
        </main>
      </body>
    </html>`);
});

// Health check endpoint for deployment monitoring
app.get('/health', (req, res) => res.status(200).json({ status: 'healthy', timestamp: new Date() }));


// API Routes
app.use('/api/list', require('./routes/listRoutes'));

// This one line correctly creates both /api/anime and /api/drama
app.use('/api', require('./routes/mediaRoutes')); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));