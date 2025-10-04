const { logger } = require('../utils/logger');

const validationMiddleware = {
  // Validação de dados do colaborador
  validateColaborador: (req, res, next) => {
    const { nome, cargo, departamento, email } = req.body;
    
    const errors = [];

    if (!nome || nome.trim().length < 2) {
      errors.push('Nome é obrigatório e deve ter pelo menos 2 caracteres');
    }

    if (!cargo || cargo.trim().length < 2) {
      errors.push('Cargo é obrigatório e deve ter pelo menos 2 caracteres');
    }

    if (!departamento || departamento.trim().length < 2) {
      errors.push('Departamento é obrigatório e deve ter pelo menos 2 caracteres');
    }

    if (!email || !isValidEmail(email)) {
      errors.push('Email é obrigatório e deve ser válido');
    }

    if (req.body.telefone && !isValidPhone(req.body.telefone)) {
      errors.push('Telefone deve estar em formato válido');
    }

    if (req.body.dataAdmissao && !isValidDate(req.body.dataAdmissao)) {
      errors.push('Data de admissão deve estar no formato YYYY-MM-DD');
    }

    if (errors.length > 0) {
      logger.warn('Validação falhou:', { errors, body: req.body });
      return res.status(400).json({
        success: false,
        error: 'Dados de entrada inválidos',
        details: errors
      });
    }

    logger.debug('Validação passou para colaborador');
    next();
  },

  // Validação de ID
  validateId: (req, res, next) => {
    const { id } = req.params;
    
    if (!id || id.trim().length === 0) {
      logger.warn('ID inválido na requisição');
      return res.status(400).json({
        success: false,
        error: 'ID é obrigatório'
      });
    }

    next();
  },

  // Validação de parâmetros de query para filtros
  validateQueryParams: (req, res, next) => {
    const { page, limit, departamento } = req.query;

    if (page && (isNaN(page) || parseInt(page) < 1)) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetro "page" deve ser um número maior que 0'
      });
    }

    if (limit && (isNaN(limit) || parseInt(limit) < 1 || parseInt(limit) > 100)) {
      return res.status(400).json({
        success: false,
        error: 'Parâmetro "limit" deve ser um número entre 1 e 100'
      });
    }

    next();
  }
};

// Funções auxiliares de validação
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
  return phoneRegex.test(phone);
}

function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
}

module.exports = validationMiddleware;