const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();
const clientUrl = process.env.CLIENT_URL || 'https://kohai-theta.vercel.app';

const allowedOrigins = [
  'http://localhost:5173',
  clientUrl
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

app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});

app.use(express.json());

app.get('/', (req, res) => res.redirect(302, clientUrl));

// Health check endpoint for deployment monitoring
app.get('/health', (req, res) => res.status(200).json({ status: 'healthy', timestamp: new Date() }));


// API Routes
app.use('/api/list', require('./routes/listRoutes'));

// This one line correctly creates both /api/anime and /api/drama
app.use('/api', require('./routes/mediaRoutes')); 

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));