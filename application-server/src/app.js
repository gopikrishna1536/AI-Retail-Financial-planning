const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const logger = require('./utils/logger');
const { requestLogger } = require('./middleware/loggerMiddleware');
const { errorHandler, notFoundHandler } = require('./middleware/errorMiddleware');
const systemController = require('./controllers/systemController');

// Routes
const authRoutes = require('./routes/authRoutes');
const organizationRoutes = require('./routes/organizationRoutes');
const storeRoutes = require('./routes/storeRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const salesRoutes = require('./routes/salesRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const financialPlanRoutes = require('./routes/financialPlanRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const varianceRoutes = require('./routes/varianceRoutes');
const riskAlertRoutes = require('./routes/riskAlertRoutes');
const recommendationRoutes = require('./routes/recommendationRoutes');
const storePathwayRoutes = require('./routes/storePathwayRoutes');
const systemRoutes = require('./routes/systemRoutes');

const app = express();

// 1. CORS Configuration
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests or allowed origins
    if (!origin || allowedOrigins.includes(origin) || env.nodeEnv === 'development') {
      callback(null, true);
    } else {
      callback(new Error('CORS policy violation: Origin not allowed'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. Middlewares
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(requestLogger);

// 3. Health check at root level
app.get('/health', systemController.getHealth);

// 4. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/organizations', organizationRoutes);
app.use('/api/stores', storeRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/sales', salesRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/financial-plans', financialPlanRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/variances', varianceRoutes);
app.use('/api/risk-alerts', riskAlertRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/store-pathway', storePathwayRoutes);
app.use('/api', systemRoutes);

// 5. 404 & Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server if run directly
if (require.main === module) {
  const PORT = env.port;
  const { db } = require('./config/database');

  const startServer = async () => {
    try {
      if (process.env.DATABASE_CLIENT === 'pg') {
        logger.info('Checking/running database migrations on PostgreSQL...');
        await db.migrate.latest();
        logger.info('Database migrations completed successfully.');
      }
    } catch (migErr) {
      logger.warn(`Migration notice: ${migErr.message}`);
    }

    app.listen(PORT, () => {
      logger.info(`Server 1 Application Server running on port ${PORT} [${env.nodeEnv}]`);
    });
  };

  startServer();
}

module.exports = app;
