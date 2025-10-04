const http = require('http');

const BASE_URL = 'http://localhost:3000';
let createdColaboradorId = '';

const tests = {
  // Teste 1: Health Check
  healthCheck: () => {
    return makeRequest('/health', 'GET')
      .then(response => {
        console.log('✅ Health Check - API está online');
        return true;
      })
      .catch(error => {
        console.log('❌ Health Check - API offline');
        throw error;
      });
  },

  // Teste 2: Listar colaboradores
  listColaboradores: () => {
    return makeRequest('/api/colaboradores', 'GET')
      .then(response => {
        console.log('✅ Listar Colaboradores - Sucesso');
        console.log(`   Total: ${response.total} colaboradores`);
        return true;
      })
      .catch(error => {
        console.log('❌ Listar Colaboradores - Erro');
        throw error;
      });
  },

  // Teste 3: Criar colaborador
  createColaborador: () => {
    const colaboradorData = {
      nome: 'Maria Santos Teste',
      cargo: 'Product Manager',
      departamento: 'Produto',
      email: 'maria.santos@teste.com',
      telefone: '(11) 88888-8888',
      dataAdmissao: '2023-03-20'
    };

    return makeRequest('/api/colaboradores', 'POST', colaboradorData)
      .then(response => {
        console.log('✅ Criar Colaborador - Sucesso');
        console.log(`   ID: ${response.data.id}`);
        console.log(`   Nome: ${response.data.nome}`);
        createdColaboradorId = response.data.id;
        return true;
      })
      .catch(error => {
        console.log('❌ Criar Colaborador - Erro');
        throw error;
      });
  },

  // Teste 4: Buscar colaborador por ID
  getColaboradorById: () => {
    if (!createdColaboradorId) {
      return Promise.reject('ID do colaborador não disponível');
    }

    return makeRequest(`/api/colaboradores/${createdColaboradorId}`, 'GET')
      .then(response => {
        console.log('✅ Buscar Colaborador por ID - Sucesso');
        console.log(`   Nome: ${response.data.nome}`);
        return true;
      })
      .catch(error => {
        console.log('❌ Buscar Colaborador por ID - Erro');
        throw error;
      });
  },

  // Teste 5: Atualizar colaborador
  updateColaborador: () => {
    if (!createdColaboradorId) {
      return Promise.reject('ID do colaborador não disponível');
    }

    const updateData = {
      cargo: 'Senior Product Manager',
      telefone: '(11) 88888-0000'
    };

    return makeRequest(`/api/colaboradores/${createdColaboradorId}`, 'PUT', updateData)
      .then(response => {
        console.log('✅ Atualizar Colaborador - Sucesso');
        console.log(`   Novo cargo: ${response.data.cargo}`);
        return true;
      })
      .catch(error => {
        console.log('❌ Atualizar Colaborador - Erro');
        throw error;
      });
  },

  // Teste 6: Buscar por departamento
  getByDepartamento: () => {
    return makeRequest('/api/colaboradores/departamento/Tecnologia', 'GET')
      .then(response => {
        console.log('✅ Buscar por Departamento - Sucesso');
        console.log(`   Departamento: ${response.departamento}`);
        console.log(`   Total: ${response.total} colaboradores`);
        return true;
      })
      .catch(error => {
        console.log('❌ Buscar por Departamento - Erro');
        throw error;
      });
  },

  // Teste 7: Deletar colaborador
  deleteColaborador: () => {
    if (!createdColaboradorId) {
      return Promise.reject('ID do colaborador não disponível');
    }

    return makeRequest(`/api/colaboradores/${createdColaboradorId}`, 'DELETE')
      .then(response => {
        console.log('✅ Deletar Colaborador - Sucesso');
        console.log('   Colaborador removido do sistema');
        return true;
      })
      .catch(error => {
        console.log('❌ Deletar Colaborador - Erro');
        throw error;
      });
  }
};

// Função auxiliar para fazer requisições HTTP
function makeRequest(path, method, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsedData = JSON.parse(responseData);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(parsedData);
          } else {
            reject({
              statusCode: res.statusCode,
              message: parsedData.error || 'Erro na requisição'
            });
          }
        } catch (error) {
          reject({
            statusCode: res.statusCode,
            message: 'Erro ao parsear resposta'
          });
        }
      });
    });

    req.on('error', (error) => {
      reject({
        statusCode: 0,
        message: `Erro de conexão: ${error.message}`
      });
    });

    if (data && (method === 'POST' || method === 'PUT')) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Executar todos os testes
async function runAllTests() {
  console.log('🧪 INICIANDO TESTES DA API\n');
  
  try {
    await tests.healthCheck();
    await tests.listColaboradores();
    await tests.createColaborador();
    await tests.getColaboradorById();
    await tests.updateColaborador();
    await tests.getByDepartamento();
    await tests.deleteColaborador();
    
    console.log('\n🎉 TODOS OS TESTES PASSARAM!');
    console.log('✅ API está funcionando corretamente');
  } catch (error) {
    console.log('\n💥 ALGUNS TESTES FALHARAM!');
    console.log(`❌ Erro: ${error.message || error}`);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  runAllTests();
}

module.exports = { tests, runAllTests };