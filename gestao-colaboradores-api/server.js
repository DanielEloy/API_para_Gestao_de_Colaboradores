// server.js - API para Gestão de Colaboradores (COM LOGGER PERSONALIZADO)
import express from "express";
import cors from "cors";
import helmet from "helmet";

// Import middlewares
import { validateColaborador, validateId } from "./src/middleware/validationMiddleware.js";
import { securityHeaders, rateLimiter, sanitizeInput } from "./src/middleware/securityMiddleware.js";
import { notFoundHandler, errorHandler, jsonErrorHandler } from "./src/middleware/errorMiddleware.js";

// Import routes
import colaboradoresRoutes from "./src/routes/colaboradores.js";

// Import utils
import { logger } from "./src/utils/logger.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Detecção de ambiente
const ambiente = process.env.NODE_ENV || "development";

// Log inicial com logger personalizado
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
app.use(securityHeaders);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(rateLimiter());
app.use(sanitizeInput);

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

    if (res.statusCode >= 500) {
      logger.error("Erro no servidor:", logData);
    } else if (res.statusCode >= 400) {
      logger.warn("Requisição com erro do cliente:", logData);
    } else if (res.statusCode >= 300) {
      logger.info("Redirecionamento:", logData);
    } else {
      logger.success("Requisição processada com sucesso:", logData);
    }
  });

  next();
});

// ===== ROTAS DA API =====

// Rota raiz
app.get("/", (req, res) => {
  logger.debug("Acessando rota raiz");

  const baseUrl = `${req.protocol}://${req.get("host")}`;

  res.json({
    success: true,
    message: "🚀 API de Gestão de Colaboradores - Online!",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
    baseUrl: baseUrl,
    endpoints: {
      health: "/health",
      status: "/api/status",
      info: "/api/info",
      colaboradores: "/api/colaboradores",
    },
    environment: ambiente,
    uptime: `${process.uptime().toFixed(2)}s`,
  });
});

// Health check
app.get("/health", (req, res) => {
  logger.debug("Health check executado");

  const healthCheck = {
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: `${process.uptime().toFixed(2)}s`,
    memory: process.memoryUsage(),
    environment: ambiente,
    version: "1.0.0",
  };

  res.status(200).json(healthCheck);
});

// Status do ambiente
app.get("/api/status", (req, res) => {
  logger.debug("Acessando status da API");

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
  logger.debug("Acessando informações da API");

  res.json({
    name: "API Gestão de Colaboradores",
    version: "1.0.0",
    description: "API REST para gestão de colaboradores",
    environment: ambiente,
    endpoints: {
      root: "/",
      health: "/health",
      status: "/api/status",
      info: "/api/info",
      colaboradores: "/api/colaboradores",
    },
  });
});

// Rotas de colaboradores
app.use("/api/colaboradores", colaboradoresRoutes);

// Middleware de rotas não encontradas
app.use(notFoundHandler);

// Middleware de erro JSON
app.use(jsonErrorHandler);

// Middleware global de erro
app.use(errorHandler);

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("Recebido SIGTERM, encerrando servidor com sucesso!");
  process.exit(0);
});

process.on("SIGINT", () => {
  logger.success("Recebido SIGINT, encerrando servidor com sucesso!");
  process.exit(0);
});

// Eventos de processo para logging
process.on("uncaughtException", (error) => {
  logger.error("Exceção não capturada:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Rejeição não tratada em:", promise, "razão:", reason);
  process.exit(1);
});

// ===== INICIALIZAÇÃO DO SERVIDOR =====
let server;

// Inicia o servidor apenas se não estiver em modo teste
if (process.env.NODE_ENV !== "test") {
  server = app.listen(PORT, () => {
    logger.success(`🚀 Servidor rodando na porta ${PORT}`);
    logger.info(`📍 Health check: http://localhost:${PORT}/health`);
    logger.info(`📊 Status: http://localhost:${PORT}/api/status`);
    logger.info(`📚 Info: http://localhost:${PORT}/api/info`);
    logger.info(`👥 Colaboradores: http://localhost:${PORT}/api/colaboradores`);
  });
}

// Export para Vercel e testes
export { app };
