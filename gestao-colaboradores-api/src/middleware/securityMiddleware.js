const { logger } = require('../utils/logger');

const securityMiddleware = {
  // Rate limiting simples
  rateLimiter: () => {
    const requests = new Map();
    
    return (req, res, next) => {
      const ip = req.ip || req.connection.remoteAddress;
      const now = Date.now();
      const windowMs = 15 * 60 * 1000; // 15 minutos
      const maxRequests = 100; // máximo de 100 requisições por IP por janela

      if (!requests.has(ip)) {
        requests.set(ip, { count: 1, startTime: now });
      } else {
        const ipData = requests.get(ip);
        
        // Reset se a janela de tempo expirou
        if (now - ipData.startTime > windowMs) {
          ipData.count = 1;
          ipData.startTime = now;
        } else {
          ipData.count++;
        }

        // Verifica se excedeu o limite
        if (ipData.count > maxRequests) {
          logger.warn(`Rate limit excedido para IP: ${ip}`);
          return res.status(429).json({
            success: false,
            error: 'Muitas requisições. Tente novamente mais tarde.',
            retryAfter: Math.ceil((ipData.startTime + windowMs - now) / 1000)
          });
        }
      }

      // Limpa entradas antigas periodicamente
      if (Math.random() < 0.01) { // 1% de chance a cada requisição
        const currentTime = Date.now();
        for (const [key, value] of requests.entries()) {
          if (currentTime - value.startTime > windowMs) {
            requests.delete(key);
          }
        }
      }

      next();
    };
  },

  // Sanitização básica de dados
  sanitizeInput: (req, res, next) => {
    // Sanitiza body
    if (req.body) {
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
          req.body[key] = req.body[key].trim();
          
          // Remove possíveis scripts maliciosos
          req.body[key] = req.body[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        }
      });
    }

    // Sanitiza query parameters
    if (req.query) {
      Object.keys(req.query).forEach(key => {
        if (typeof req.query[key] === 'string') {
          req.query[key] = req.query[key].trim();
        }
      });
    }

    next();
  },

  // Headers de segurança adicionais
  securityHeaders: (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    
    next();
  }
};

module.exports = securityMiddleware;