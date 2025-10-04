// server.js - API para Gestão de Colaboradores
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { logger } = require('./src/utils/logger');

// Import middlewares
const validationMiddleware = require('./src/middleware/validationMiddleware');
const securityMiddleware = require('./src/middleware/securityMiddleware');
const errorMiddleware = require('./src/middleware/errorMiddleware');

// Import routes
const colaboradoresRoutes = require('./src/routes/colaboradores');

const app = express();
const PORT = process.env.PORT || 3000;

// Detecção de ambiente
const ambiente = process.env.NODE_ENV || 'development';

console.log('🚀 ===== API GESTÃO DE COLABORADORES =====');
console.log(`📍 Ambiente: ${ambiente}`);
console.log(`🔢 Porta: ${PORT}`);
console.log(`🕒 Iniciado em: ${new Date().toISOString()}`);
console.log('==========================================');

// Configurações específicas por ambiente
if (ambiente === 'production') {
  console.log('🔒 MODO PRODUÇÃO: Otimizações ativadas');
} else if (ambiente === 'test') {
  console.log('🧪 MODO TESTE: Executando testes');
} else {
  console.log('💻 MODO DESENVOLVIMENTO: Logs detalhados ativos');
}

// Middlewares de segurança
app.use(helmet());
app.use(securityMiddleware.securityHeaders);
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
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

// Health check
app.get('/health', (req, res) => {
  const healthCheck = {
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(2)}s`,
    memory: process.memoryUsage(),
    environment: ambiente,
    version: '1.0.0'
  };

  logger.debug('Health check executado');
  res.status(200).json(healthCheck);
});

// Status do ambiente
app.get('/api/status', (req, res) => {
  res.json({
    ambiente: ambiente,
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    plataforma: process.platform,
    memoria: process.memoryUsage(),
    uptime: `${process.uptime().toFixed(2)}s`,
    port: PORT,
    status: 'API funcionando corretamente'
  });
});

// Info da API
app.get('/api/info', (req, res) => {
  res.json({
    name: 'API Gestão de Colaboradores',
    version: '1.0.0',
    description: 'API REST para gestão de colaboradores',
    environment: ambiente,
    endpoints: {
      colaboradores: '/api/colaboradores',
      health: '/health',
      status: '/api/status',
      info: '/api/info'
    },
    contact: {
      name: 'Equipe de Desenvolvimento',
      email: 'suporte@empresa.com'
    }
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
  if (server) {
    server.close(() => {
      console.log('Processo finalizado graciosamente');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on('SIGINT', () => {
  logger.info('Recebido SIGINT, encerrando servidor graciosamente');
  if (server) {
    server.close(() => {
      console.log('Processo finalizado graciosamente');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

// Export apenas a app para testes
let server;

// Inicia o servidor apenas se executado diretamente
if (require.main === module) {
  server = app.listen(PORT, () => {
    logger.success(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`📊 Status: http://localhost:${PORT}/api/status`);
    console.log(`📚 Info: http://localhost:${PORT}/api/info`);
    console.log(`👥 Colaboradores: http://localhost:${PORT}/api/colaboradores`);
  });
}

// Export para testes
module.exports = app;