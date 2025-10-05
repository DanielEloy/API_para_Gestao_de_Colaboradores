const { runAllTests } = require('./test-api');
import { logger } from '../src/utils/logger.js';

// Configurar variáveis de ambiente para debug
process.env.DEBUG = 'true';
process.env.LOG_LEVEL = 'debug';

logger.info('🔍 MODO DEBUG ATIVADO');
logger.info('📝 Logs detalhados serão exibidos\n');

runAllTests().catch(logger.error);     