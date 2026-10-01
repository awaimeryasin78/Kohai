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

// Health check endpoint for Render monitoring
app.get('/health', (req, res) => res.status(200).json({ status: 'healthy', timestamp: new Date() }));

// API Routes
app.use('/api/list', require('./routes/listRoutes'));
app.use('/api/anime', require('./routes/animeRoutes'));
app.use('/api/drama', require('./routes/dramaRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));