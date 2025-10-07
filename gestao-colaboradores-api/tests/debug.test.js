// tests/debug.test.js
import { logger } from '../src/utils/logger.js';
import { jest } from '@jest/globals';

describe('Ferramentas de Debug', () => {
  beforeEach(() => {
    jest.spyOn(logger, 'info').mockImplementation(() => {});
    jest.spyOn(logger, 'debug').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('Verificar ambiente', () => {
    console.log('🔧 Ambiente de Teste:');
    console.log('NODE_ENV:', process.env.NODE_ENV);
    
    expect(process.env.NODE_ENV).toBe('test');
  });

  test('Logger deve funcionar', () => {
    logger.info('📝 Teste de log INFO');
    logger.debug('🔍 Teste de log DEBUG');
    
    expect(logger.info).toHaveBeenCalled();
    expect(logger.debug).toHaveBeenCalled();
  });
});
