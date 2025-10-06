// server.js - API para Gestão de Colaboradores
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { logger } = require("./src/utils/logger");

// Import middlewares
const validationMiddleware = require("./src/middleware/validationMiddleware");
const securityMiddleware = require("./src/middleware/securityMiddleware");
const errorMiddleware = require("./src/middleware/errorMiddleware");

// Import routes
const colaboradoresRoutes = require("./src/routes/colaboradores");

const app = express();
const PORT = process.env.PORT || 3000;

// Detecção de ambiente
const ambiente = process.env.NODE_ENV || "development";

logger.info("🚀 ===== API GESTÃO DE COLABORADORES =====");
logger.info(`📍 Ambiente: ${ambiente}`);
logger.info(`🔢 Porta: ${PORT}`);
logger.info(`🕒 Iniciado em: ${new Date().toISOString()}`);
logger.info("==========================================");

// Configurações específicas por ambiente
if (ambiente === "production") {
  logger.info("🔒 MODO PRODUÇÃO: Otimizações ativadas");
} else if (ambiente === "test") {
  logger.info("🧪 MODO TESTE: Executando testes");
} else {
  logger.info("💻 MODO DESENVOLVIMENTO: Logs detalhados ativos");
}

// Middlewares de segurança
app.use(helmet());
app.use(securityMiddleware.securityHeaders);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(securityMiddleware.rateLimiter());
app.use(securityMiddleware.sanitizeInput);

// Middlewares de parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Middleware de logging personalizado
app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userAgent: req.get("User-Agent"),
    };

    if (res.statusCode >= 400) {
      logger.warn("Requisição com erro:", logData);
    } else {
      logger.info("Requisição processada:", logData);
    }
  });

  next();
});

// ===== ROTAS DA API =====

// Rota raiz - DEVE ESTAR AQUI, FORA DO BLOCO CONDICIONAL
app.get("/", (req, res) => {
  const baseUrl = `${req.protocol}://${req.get('host')}`;
  
  res.json({
    success: true,
    message: "🚀 API de Gestão de Colaboradores - Online!",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    baseUrl: baseUrl,
    endpoints: {
      health: `${baseUrl}/health`,
      status: `${baseUrl}/api/status`,
      info: `${baseUrl}/api/info`,
      colaboradores: `${baseUrl}/api/colaboradores`
    },
    documentation: "https://github.com/DanielEloy/API_para_Gestao_de_Colaboradores",
    environment: ambiente,
    uptime: `${process.uptime().toFixed(2)}s`
  });
});

// Health check
app.get("/health", (req, res) => {
  const healthCheck = {
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(2)}s`,
    memory: process.memoryUsage(),
    environment: ambiente,
    version: "1.0.0",
  };

  logger.debug("Health check executado");
  res.status(200).json(healthCheck);
});

// Status do ambiente
app.get("/api/status", (req, res) => {
  res.json({
    ambiente: ambiente,
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    plataforma: process.platform,
    memoria: process.memoryUsage(),
    uptime: `${process.uptime().toFixed(2)}s`,
    port: PORT,
    status: "API funcionando corretamente",
  });
});

// Info da API
app.get("/api/info", (req, res) => {
  res.json({
    name: "API Gestão de Colaboradores",
    version: "1.0.0",
    description: "API REST para gestão de colaboradores",
    environment: ambiente,
    endpoints: {
      root: "/",
      colaboradores: "/api/colaboradores",
      health: "/health",
      status: "/api/status",
      info: "/api/info",
    },
    contact: {
      name: "Equipe de Desenvolvimento",
      email: "suporte@empresa.com",
    },
  });
});

// Routes
app.use("/api/colaboradores", colaboradoresRoutes);

// Middleware de rotas não encontradas
app.use(errorMiddleware.notFoundHandler);

// Middleware de erro JSON
app.use(errorMiddleware.jsonErrorHandler);

// Middleware global de erro
app.use(errorMiddleware.errorHandler);

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("Recebido SIGTERM, encerrando servidor com sucesso!");
  if (server) {
    server.close(() => {
      logger.success("Processo finalizado com sucesso!");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on("SIGINT", () => {
  logger.info("Recebido SIGINT, encerrando servidor com sucesso!");
  if (server) {
    server.close(() => {
      logger.success("Processo finalizado com sucesso!");
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
    logger.info(`📍 Health check: http://localhost:${PORT}/health`);
    logger.info(`📊 Status: http://localhost:${PORT}/api/status`);
    logger.info(`📚 Info: http://localhost:${PORT}/api/info`);
    logger.info(`👥 Colaboradores: http://localhost:${PORT}/api/colaboradores`);
    logger.info(`🌐 Rota raiz: http://localhost:${PORT}/`);
  });
}

// Export para testes
module.exports = app;