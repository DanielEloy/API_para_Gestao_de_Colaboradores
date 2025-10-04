// setup-env.js - Script para configurar ambiente
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🚀 CONFIGURAÇÃO DO AMBIENTE - API Gestão de Colaboradores');
console.log('=========================================================\n');

const questions = [
  {
    name: 'NODE_ENV',
    question: 'Ambiente (development/production/test): ',
    default: 'development'
  },
  {
    name: 'PORT', 
    question: 'Porta do servidor: ',
    default: '3000'
  },
  {
    name: 'APP_NAME',
    question: 'Nome da aplicação: ',
    default: 'API Gestão de Colaboradores'
  },
  {
    name: 'CORS_ORIGIN',
    question: 'Origem CORS (* para todas): ',
    default: '*'
  },
  {
    name: 'SUPPORT_EMAIL',
    question: 'Email de suporte: ',
    default: 'suporte@empresa.com'
  }
];

const answers = {};

function askQuestion(index) {
  if (index >= questions.length) {
    generateEnvFile();
    return;
  }

  const q = questions[index];
  rl.question(q.question, (answer) => {
    answers[q.name] = answer || q.default;
    askQuestion(index + 1);
  });
}

function generateEnvFile() {
  let envContent = `# Configuração gerada automaticamente em ${new Date().toISOString()}\n\n`;
  
  Object.keys(answers).forEach(key => {
    envContent += `${key}=${answers[key]}\n`;
  });

  envContent += '\n# Configurações adicionais\n';
  envContent += 'LOG_LEVEL=debug\n';
  envContent += 'RATE_LIMIT_MAX=100\n';
  envContent += 'APP_VERSION=1.0.0\n';

  fs.writeFileSync('.env', envContent);
  
  console.log('\n✅ Arquivo .env criado com sucesso!');
  console.log('📁 Configurações salvas em: .env');
  console.log('\n🎯 Próximos passos:');
  console.log('1. Revise o arquivo .env');
  console.log('2. Execute: npm run dev');
  console.log('3. Acesse: http://localhost:' + answers.PORT + '/health');
  
  rl.close();
}

// Verifica se .env já existe
if (fs.existsSync('.env')) {
  rl.question('Arquivo .env já existe. Deseja sobrescrever? (s/N): ', (answer) => {
    if (answer.toLowerCase() === 's') {
      askQuestion(0);
    } else {
      console.log('Operação cancelada.');
      rl.close();
    }
  });
} else {
  askQuestion(0);
}