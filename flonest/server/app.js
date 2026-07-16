const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middleware/errorMiddleware');

const app = express();

// Security Headers Middleware
app.use(helmet());

// HTTP Request Logger Middleware (Morgan)
if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
  app.use(morgan('dev'));
}

// Body Parsers Middleware
app.use(express.json());

// Cookie Parser Middleware
app.use(cookieParser());

// CORS Configuration supporting Credential-cookies
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Route Files
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const periodRoutes = require('./routes/periodRoutes');
const symptomRoutes = require('./routes/symptomRoutes');
const predictionRoutes = require('./routes/predictionRoutes');

// Mount Routers
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/periods', periodRoutes);
app.use('/api/symptoms', symptomRoutes);
app.use('/api/predictions', predictionRoutes);

// Catch-all (404 Resource Not Found) handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: 'Resource not found',
    errors: [`Route ${req.originalUrl} not found`]
  });
});

// Global Error Handler Middleware
app.use(errorHandler);

module.exports = app;
