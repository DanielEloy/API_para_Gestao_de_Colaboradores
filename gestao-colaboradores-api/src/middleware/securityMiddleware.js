const { logger } = require('../utils/logger');

const securityMiddleware = {
  rateLimiter: () => {
    const requests = new Map();
    
    return (req, res, next) => {
      const ip = req.ip || req.connection.remoteAddress;
      const now = Date.now();
      const windowMs = 15 * 60 * 1000;
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
            error: 'Muitas requisições. Tente novamente mais tarde.'
          });
        }
      }

      next();
    };
  },

  sanitizeInput: (req, res, next) => {
    if (req.body) {
      Object.keys(req.body).forEach(key => {
        if (typeof req.body[key] === 'string') {
          req.body[key] = req.body[key].trim();
          req.body[key] = req.body[key].replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
        }
      });
    }

    next();
  },

  securityHeaders: (req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    next();
  }
};

module.exports = securityMiddleware;