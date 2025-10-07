import { logger } from "../utils/logger.js";

const validateColaborador = (req, res, next) => {
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

  if (errors.length > 0) {
    logger.warn('Validação falhou:', { errors, body: req.body });
    return res.status(400).json({
      success: false,
      error: 'Dados de entrada inválidos',
      details: errors,
      timestamp: new Date().toISOString()
    });
  }

  logger.debug('Validação passou para colaborador:', { nome, email });
  next();
};

const validateId = (req, res, next) => {
  const { id } = req.params;
  
  if (!id || id.trim().length === 0) {
    logger.warn('ID inválido na requisição:', { url: req.originalUrl });
    return res.status(400).json({
      success: false,
      error: 'ID é obrigatório',
      timestamp: new Date().toISOString()
    });
  }

  next();
};

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export { validateColaborador, validateId };