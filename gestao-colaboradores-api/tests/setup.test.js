// tests/setup.test.js - VERSÃO FINAL CORRIGIDA

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
  console.log('🚀 Iniciando testes da API de Gestão de Colaboradores');
});

afterAll(() => {
  console.log('✅ Todos os testes foram concluídos');
});

// Teste dummy para evitar erro
test('Setup - Configuração do ambiente de teste', () => {
  expect(true).toBe(true);
});