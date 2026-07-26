const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');

const path = require('path');

const corsConfig = require('./config/cors.config');
const appConfig = require('./config/app.config');
const swaggerSpec = require('./config/swagger.config');
const globalErrorHandler = require('./middleware/error.middleware');
const v1Router = require('./routes/v1');
const AppError = require('./utils/appError');

const app = express();

// Rate Limiting Guard
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

// Middleware Stack
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors(corsConfig));
app.use(compression());
app.use('/api', limiter);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads serving
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Root Swagger UI route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount Versioned API Routes (/api/v1)
app.use(`/api/${appConfig.apiVersion}`, v1Router);

// Handle 404 Unhandled Routes
app.all('*', (req, res, next) => {
  next(new AppError(`Cannot find ${req.originalUrl} on this server.`, 404));
});

// Global Error Handler Middleware
app.use(globalErrorHandler);

module.exports = app;
