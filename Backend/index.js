const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const allowedOrigins = [
  'http://localhost:5173',
  'https://realtimenus.vercel.app',
  'https://f38e-58-140-20-247.ngrok-free.app'
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin like mobile apps, Postman, etc.
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
};

app.use(cors(corsOptions));

// Apply logging middleware for debugging
app.use((req, res, next) => {
  console.log('Request Headers:', req.headers);
  const originalSend = res.send;
  res.send = function (body) {
    console.log('Response Headers:', res.getHeaders());
    return originalSend.call(this, body);
  };
  next();
});

// Handle preflight requests
app.options('*', cors(corsOptions));

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('DB Connected!'))
  .catch(err => console.error('DB Connection Error:', err));

// Import and use routes
const calendarRoutes = require('./routes/calendarRoutes');
const eventRoutes = require('./routes/eventRoutes');
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const moduleRoutes = require('./routes/moduleRoutes');

app.use('/calendars', calendarRoutes);
app.use('/events', eventRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/modules', moduleRoutes); // Use the new module route

// Example route to set a cookie
app.get('/set-cookie', (req, res) => {
  res.cookie('exampleCookie', 'cookieValue', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // Ensure this is true if SameSite=None
    sameSite: 'None',
  });
  res.send('Cookie set');
});

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the backend!');
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
