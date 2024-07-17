const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const https = require('https');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'https://realtimenus.vercel.app'
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
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Middleware to redirect HTTP to HTTPS (optional, if needed)
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
      return res.redirect(`https://${req.headers.host}${req.url}`);
    }
    next();
  });
}

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
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

// Health Check Route
app.get('/health', (req, res) => {
  res.status(200).send('Healthy');
});

// Server listening on HTTP
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`HTTP Server is running on port ${port}`);
});

// Optional: HTTPS server setup
if (process.env.NODE_ENV === 'production') {
  const httpsOptions = {
    key: fs.readFileSync('./certs/private.key'),
    cert: fs.readFileSync('./certs/certificate.crt')
  };

  https.createServer(httpsOptions, app).listen(443, () => {
    console.log('HTTPS Server is running on port 443');
  });
}
