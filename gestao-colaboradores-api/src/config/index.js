const { logger } = require('../utils/logger');

const config = {
  // Configurações do servidor
  server: {
    port: process.env.PORT || 3000,
    environment: process.env.NODE_ENV || 'development',
    name: process.env.APP_NAME || 'API Gestão de Colaboradores'
  },

  // Configurações de segurança
  security: {
    cors: {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization']
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000, // 15 minutos
      max: process.env.RATE_LIMIT_MAX || 100 // limite por IP
    }
  },

  // Configurações de logging
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
    file: {
      enabled: process.env.LOG_TO_FILE === 'true',
      path: process.env.LOG_PATH || './logs'
    }
  },

  // Configurações da aplicação
  application: {
    version: process.env.APP_VERSION || '1.0.0',
    description: 'API REST para gestão de colaboradores',
    contact: {
      name: 'Equipe de Desenvolvimento',
      email: process.env.SUPPORT_EMAIL || 'suporte@empresa.com'
    }
  },

  // Validações
  validation: {
    maxNameLength: 100,
    maxEmailLength: 255,
    maxDepartmentLength: 50,
    maxPositionLength: 100,
    phoneRegex: /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/
  }
};

// Valida configurações ao iniciar
const validateConfig = () => {
  const requiredEnvVars = [];
  
  requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      logger.warn(`Variável de ambiente ${envVar} não está definida`);
    }
  });

  logger.info('Configurações validadas com sucesso');
};

module.exports = {
  config,
  validateConfig
};