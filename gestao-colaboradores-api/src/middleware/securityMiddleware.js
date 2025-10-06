import { logger } from "../utils/logger.js";

const securityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
};

const rateLimiter = () => {
  const requests = new Map();
  
  return (req, res, next) => {
    const ip = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutos
    const maxRequests = 100;

    if (!requests.has(ip)) {
      requests.set(ip, { count: 1, startTime: now });
    } else {
      const ipData = requests.get(ip);
      
      if (now - ipData.startTime > windowMs) {
        ipData.count = 1;
        ipData.startTime = now;
      } else {
        ipData.count++;
      }

      if (ipData.count > maxRequests) {
        logger.warn(`Rate limit excedido para IP: ${ip}`);
        return res.status(429).json({
          success: false,
          error: 'Muitas requisições. Tente novamente mais tarde.',
          timestamp: new Date().toISOString()
        });
      }
    }

    logger.debug(`Rate limit: IP ${ip} - ${requests.get(ip).count}/${maxRequests} requests`);
    next();
  };
};

const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
        // Remove scripts maliciosos básicos
        req.body[key] = req.body[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
      }
    });
    
    logger.debug("Input sanitizado para requisição:", {
      url: req.originalUrl,
      bodyKeys: Object.keys(req.body)
    });
  }

  next();
};

export { securityHeaders, rateLimiter, sanitizeInput };