const { runAllTests } = require('./test-api');

// Configurar variáveis de ambiente para debug
process.env.DEBUG = 'true';
process.env.LOG_LEVEL = 'debug';

console.log('🔍 MODO DEBUG ATIVADO');
console.log('📝 Logs detalhados serão exibidos\n');

runAllTests().catch(console.error);