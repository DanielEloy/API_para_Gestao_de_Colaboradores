// server.js - API para Gestão de Colaboradores

require("dotenv").config(); // Carrega variáveis do .env logo no início
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { logger } = require("./src/utils/logger");

// Importa middlewares
const validationMiddleware = require("./src/middleware/validationMiddleware.js");
const securityMiddleware = require("./src/middleware/securityMiddleware.js");
const errorMiddleware = require("./src/middleware/errorMiddleware.js");

// Importa rotas
const colaboradoresRoutes = require("./src/routes/colaboradores.js");

const app = express();
const PORT = process.env.PORT || 3000;
const ambiente = process.env.NODE_ENV || "development";

// ===== LOG INICIAL =====
logger.info("🚀 ===== API GESTÃO DE COLABORADORES =====");
logger.info(`📍 Ambiente: ${ambiente}`);
logger.info(`🔢 Porta: ${PORT}`);
logger.info(`🕒 Iniciado em: ${new Date().toISOString()}`);
logger.info("==========================================");

// Configurações específicas de ambiente
switch (ambiente) {
  case "production":
    logger.info("🔒 MODO PRODUÇÃO: Otimizações ativadas");
    break;
  case "test":
    logger.info("🧪 MODO TESTE: Executando testes");
    break;
  default:
    logger.info("💻 MODO DESENVOLVIMENTO: Logs detalhados ativos");
    break;
}

// ===== MIDDLEWARES =====

// Segurança
app.use(helmet());
if (securityMiddleware?.securityHeaders) app.use(securityMiddleware.securityHeaders);
if (securityMiddleware?.rateLimiter) app.use(securityMiddleware.rateLimiter());
if (securityMiddleware?.sanitizeInput) app.use(securityMiddleware.sanitizeInput);

// CORS
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// ===== LOGGER DE REQUISIÇÕES =====
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
      logger.warn("⚠️ Requisição com erro:", logData);
    } else {
      logger.success("✅ Requisição processada com sucesso:", logData);
    }
  });

  next();
});

// ===== ROTAS PRINCIPAIS =====
app.get("/", (req, res) => {
  const baseUrl = `${req.protocol}://${req.get("host")}`;
  res.json({
    success: true,
    message: "🚀 API de Gestão de Colaboradores - Online!",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    baseUrl,
    endpoints: {
      health: `${baseUrl}/health`,
      status: `${baseUrl}/api/status`,
      info: `${baseUrl}/api/info`,
      colaboradores: `${baseUrl}/api/colaboradores`,
    },
    documentation: "https://github.com/DanielEloy/API_para_Gestao_de_Colaboradores",
    environment: ambiente,
    uptime: `${process.uptime().toFixed(2)}s`,
  });
});

// ===== HEALTH CHECK =====
app.get("/health", (req, res) => {
  const healthCheck = {
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(2)}s`,
    memory: process.memoryUsage(),
    environment: ambiente,
    version: "1.0.0",
  };

  logger.debug("🩺 Health check executado");
  res.status(200).json(healthCheck);
});

// ===== STATUS E INFO =====
app.get("/api/status", (req, res) => {
  res.json({
    ambiente,
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    plataforma: process.platform,
    memoria: process.memoryUsage(),
    uptime: `${process.uptime().toFixed(2)}s`,
    port: PORT,
    status: "API funcionando corretamente",
  });
});

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

// ===== ROTAS DE COLABORADORES =====
app.use("/api/colaboradores", colaboradoresRoutes);

// ===== TRATAMENTO DE ERROS =====
app.use(errorMiddleware.notFoundHandler);
app.use(errorMiddleware.jsonErrorHandler);
app.use(errorMiddleware.errorHandler);

// ===== FINALIZAÇÃO SEGURA =====
let server;

function shutdownHandler(signal) {
  logger.info(`🛑 Recebido ${signal}, encerrando servidor...`);
  if (server) {
    server.close(() => {
      logger.success("✅ Servidor encerrado com sucesso!");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

process.on("SIGTERM", () => shutdownHandler("SIGTERM"));
process.on("SIGINT", () => shutdownHandler("SIGINT"));

// ===== INICIALIZAÇÃO =====
if (require.main === module) {
  server = app.listen(PORT, () => {
    logger.success(`🚀 Servidor rodando na porta ${PORT}`);
    logger.info(`📍 Health: http://localhost:${PORT}/health`);
    logger.info(`📊 Status: http://localhost:${PORT}/api/status`);
    logger.info(`📚 Info: http://localhost:${PORT}/api/info`);
    logger.info(`👥 Colaboradores: http://localhost:${PORT}/api/colaboradores`);
    logger.info(`🌐 Rota raiz: http://localhost:${PORT}/`);
  });
}

module.exports = app;
