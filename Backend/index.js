const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const allowedOrigins = [
  'http://localhost:5173',
  'https://realtimenus.vercel.app',
  'https://d3c0-218-144-19-223.ngrok-free.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));


// Connect to MongoDB
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('DB Connected!'))
  .catch(err => console.error('DB Connection Error:', err));

// Route Handlers
const calendarRoutes = require('./routes/calendarRoutes');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');

// Use Routes
app.use('/calendars', calendarRoutes);
app.use('/events', eventRoutes);
app.use('/auth', authRoutes);
app.use('/', userRoutes);

// Add a route handler for '/'
app.get('/', (req, res) => {
  res.send('Welcome to the backend!');
});

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).send('Healthy');
});

// Server listening on HTTP
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
