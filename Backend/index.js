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
  'https://f38e-58-140-20-247.ngrok-free.app'
];

const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
};

app.use(cors(corsOptions));

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
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to the backend!');
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
