const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { config, validateConfig } = require('./src/config');
const { logger } = require('./src/utils/logger');

// Import middlewares
const validationMiddleware = require('./src/middleware/validationMiddleware');
const securityMiddleware = require('./src/middleware/securityMiddleware');
const errorMiddleware = require('./src/middleware/errorMiddleware');

const colaboradoresRoutes = require('./src/routes/colaboradores');

const app = express();
const PORT = config.server.port;

// Valida configurações
validateConfig();

// Middlewares de segurança
app.use(helmet());
app.use(securityMiddleware.securityHeaders);
app.use(cors(config.security.cors));
app.use(securityMiddleware.rateLimiter());
app.use(securityMiddleware.sanitizeInput);

// Middlewares de parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging personalizado
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get('User-Agent')
    };

    if (res.statusCode >= 400) {
      logger.warn('Requisição com erro:', logData);
    } else {
      logger.info('Requisição processada:', logData);
    }
  });

  next();
});

// Routes
app.use('/api/colaboradores', colaboradoresRoutes);

// Health check detalhado
app.get('/health', (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(2)}s`,
    memory: process.memoryUsage(),
    environment: config.server.environment,
    version: config.application.version
  };

  logger.debug('Health check executado');
  res.status(200).json(healthCheck);
});

// Info da API
app.get('/api/info', (req, res) => {
  res.json({
    name: config.server.name,
    version: config.application.version,
    description: config.application.description,
    environment: config.server.environment,
    endpoints: {
      colaboradores: '/api/colaboradores',
      health: '/health'
    },
    contact: config.application.contact
  });
});

// Middleware de rotas não encontradas
app.use(errorMiddleware.notFoundHandler);

// Middleware de erro JSON
app.use(errorMiddleware.jsonErrorHandler);

// Middleware global de erro
app.use(errorMiddleware.errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('Recebido SIGTERM, encerrando servidor graciosamente');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('Recebido SIGINT, encerrando servidor graciosamente');
  process.exit(0);
});

const server = app.listen(PORT, () => {
  logger.success(`🚀 Servidor ${config.server.name} rodando na porta ${PORT}`);
  logger.info(`🌍 Ambiente: ${config.server.environment}`);
  logger.info(`📊 Versão: ${config.application.version}`);
  logger.info(`📍 Health check: http://localhost:${PORT}/health`);
  logger.info(`📚 Documentação: http://localhost:${PORT}/api/info`);
});

module.exports = { app, server };