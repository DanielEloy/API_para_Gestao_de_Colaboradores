import { logger } from "../utils/logger.js";

const notFoundHandler = (req, res) => {
  logger.warn(`Rota não encontrada: ${req.method} ${req.originalUrl}`);
  
  res.status(404).json({
    success: false,
    error: `Rota não encontrada - ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString(),
    availableEndpoints: [
      "GET /",
      "GET /health",
      "GET /api/status", 
      "GET /api/info",
      "GET /api/colaboradores",
      "POST /api/colaboradores"
    ]
  });
};

const errorHandler = (error, req, res, next) => {
  logger.error("Erro interno do servidor:", {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  res.status(500).json({
    success: false,
    error: "Erro interno do servidor",
    timestamp: new Date().toISOString()
  });
};

const jsonErrorHandler = (error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    logger.warn("JSON malformado na requisição:", {
      url: req.originalUrl,
      error: error.message
    });
    
    return res.status(400).json({
      success: false,
      error: "JSON malformado",
      message: "O corpo da requisição contém JSON malformado",
      timestamp: new Date().toISOString()
    });
  }
  next(error);
};

export { notFoundHandler, errorHandler, jsonErrorHandler };