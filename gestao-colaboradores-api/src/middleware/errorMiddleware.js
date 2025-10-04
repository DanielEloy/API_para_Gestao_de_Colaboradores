const { logger } = require('../utils/logger');

const errorMiddleware = {
  notFoundHandler: (req, res, next) => {
    const error = new Error(`Rota não encontrada - ${req.method} ${req.originalUrl}`);
    error.status = 404;
    
    logger.warn(`Rota não encontrada: ${req.method} ${req.originalUrl}`);
    
    next(error);
  },

  errorHandler: (error, req, res, next) => {
    const statusCode = error.status || 500;
    
    if (statusCode >= 500) {
      logger.error('Erro interno do servidor:', {
        message: error.message,
        stack: error.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip
      });
    } else {
      logger.warn('Erro do cliente:', {
        message: error.message,
        status: statusCode,
        url: req.originalUrl,
        method: req.method
      });
    }

    const errorResponse = {
      success: false,
      error: error.message || 'Erro interno do servidor',
      timestamp: new Date().toISOString(),
      path: req.originalUrl
    };

    if (process.env.NODE_ENV === 'development') {
      errorResponse.stack = error.stack;
    }

    res.status(statusCode).json(errorResponse);
  },

  jsonErrorHandler: (error, req, res, next) => {
    if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
      logger.warn('Erro de sintaxe JSON na requisição:', {
        error: error.message,
        url: req.originalUrl
      });
      
      return res.status(400).json({
        success: false,
        error: 'JSON malformado',
        message: 'O corpo da requisição contém JSON malformado'
      });
    }
    
    next(error);
  }
};

module.exports = errorMiddleware;