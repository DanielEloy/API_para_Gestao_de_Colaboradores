// tests/setup.test.js
import { jest } from '@jest/globals';

// ⚠️ Mock do logger deve vir antes do import real
jest.unstable_mockModule('../src/utils/logger.js', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn(),
    success: jest.fn(),
  },
}));

// Agora importa o logger (mock aplicado)
const { logger } = await import('../src/utils/logger.js');

// Configuração global
beforeAll(() => {
  logger.info('🚀 Iniciando testes da API de Gestão de Colaboradores');
   // Silenciar logs no modo teste
  console.log = jest.fn();
  console.info = jest.fn();
  console.warn = jest.fn();
  console.error = jest.fn();
  console.debug = jest.fn();
  process.env.NODE_ENV = 'test';
});

beforeEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  logger.success('✅ Todos os testes foram concluídos');
});

test('Setup - Configuração do ambiente de teste', () => {
  expect(process.env.NODE_ENV).toBe('test');
});
