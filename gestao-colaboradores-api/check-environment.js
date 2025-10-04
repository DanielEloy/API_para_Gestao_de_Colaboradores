// check-environment.js
console.log('🔍 DIAGNÓSTICO DO AMBIENTE');
console.log('============================');

// Ambiente
console.log(`📍 NODE_ENV: ${process.env.NODE_ENV || 'development (padrão)'}`);

// Versões
console.log(`🟢 Node.js: ${process.version}`);
console.log(`📦 NPM: ${process.env.npm_version || 'Não disponível'}`);

// Configurações
console.log(`🔢 PORT: ${process.env.PORT || '3000 (padrão)'}`);
console.log(`🌐 CORS_ORIGIN: ${process.env.CORS_ORIGIN || '* (padrão)'}`);

// Memória
const memory = process.memoryUsage();
console.log(`💾 Memória: ${Math.round(memory.heapUsed / 1024 / 1024)}MB`);

// Platform
console.log(`💻 Platform: ${process.platform}`);
console.log(`📁 Diretório: ${process.cwd()}`);

// Script em execução
console.log(`🎯 Script: ${process.argv[1] || 'Não especificado'}`);

console.log('============================\n');

// Sugestão baseada no ambiente
const env = process.env.NODE_ENV;
if (env === 'production') {
  console.log('✅ Você está em PRODUÇÃO');
  console.log('💡 Dica: Verifique logs, monitoramento e segurança');
} else if (env === 'test') {
  console.log('🧪 Você está em TESTES');
  console.log('💡 Dica: Execute "npm test" para validar a aplicação');
} else {
  console.log('💻 Você está em DESENVOLVIMENTO');
  console.log('💡 Dica: Use "npm run dev" para desenvolvimento com hot reload');
}