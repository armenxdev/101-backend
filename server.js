require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');

const { connectDB } = require('./config/database');
const { connectRedis } = require('./config/redis');
require('./models');

const { generalLimiter, authLimiter } = require('./middlewares/rateLimiter');
const errorHandler = require('./middlewares/errorHandler');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const paypalRoutes = require('./routes/paypalRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

app.set('trust proxy', 1);

const allowedOrigins = [
  'http://localhost:3000',
  'onehundredone.vercel.app',
  'https://onehundredone.vercel.app',
];

app.use(helmet());
app.use(generalLimiter);
app.use('/api/auth', authLimiter);

app.use(cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    const allowed = allowedOrigins.some((o) => origin.startsWith(o));
    if (allowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use('/api/reviews', reviewRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/user', userRoutes);
app.use('/api/paypal', paypalRoutes);
app.use('/api/orders', orderRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

app.use(errorHandler);

const startServer = async () => {
  await connectDB();
  await connectRedis();

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = app;
