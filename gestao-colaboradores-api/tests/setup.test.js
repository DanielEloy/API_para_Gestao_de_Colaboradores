// tests/setup.test.js

import { logger } from "../src/utils/logger.js";

// Mock do logger - APENAS ISSO, NADA MAIS!
jest.mock('../src/utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    success: jest.fn()
  },
  LogLevel: {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3,
    NONE: 4,
    SUCCESS: 5
  }
}));

beforeAll(() => {
  logger.info('🚀 Iniciando testes da API de Gestão de Colaboradores');
});

afterAll(() => {
  logger.success('✅ Todos os testes foram concluídos');
});

// Teste dummy para evitar erro
test('Setup - Configuração do ambiente de teste', () => {
  expect(true).toBe(true);
});