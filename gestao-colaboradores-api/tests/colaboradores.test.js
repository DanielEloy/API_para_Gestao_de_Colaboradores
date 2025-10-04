// tests/colaboradores.test.js - VERSÃO FINAL CORRIGIDA
const request = require('supertest');
const { app } = require('../server'); // ⚠️ IMPORTE {app} em vez de app direto
const Colaborador = require('../src/models/Colaborador');

describe('API de Gestão de Colaboradores', () => {
  let testColaboradorId;

  // ⚠️ REMOVA o beforeAll e afterAll que gerenciam o servidor

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Health Check e Informações da API', () => {
    test('GET /health - deve retornar status 200 e informações do servidor', async () => {
      const response = await request(app) // ⚠️ USA app CORRETAMENTE
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
    });

    test('GET /api/info - deve retornar informações da API', async () => {
      const response = await request(app) // ⚠️ USA app CORRETAMENTE
        .get('/api/info')
        .expect(200);

      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('version');
    });
  });

  describe('CRUD de Colaboradores', () => {
    test('GET /api/colaboradores - deve retornar todos os colaboradores', async () => {
      const response = await request(app) // ⚠️ USA app CORRETAMENTE
        .get('/api/colaboradores')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    test('POST /api/colaboradores - deve criar um novo colaborador', async () => {
      const novoColaborador = {
        nome: 'Carlos Oliveira Teste',
        cargo: 'QA Engineer',
        departamento: 'Qualidade',
        email: 'carlos.oliveira@teste.com',
        telefone: '(11) 77777-7777',
        dataAdmissao: '2023-10-01'
      };

      const response = await request(app) // ⚠️ USA app CORRETAMENTE
        .post('/api/colaboradores')
        .send(novoColaborador)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.nome).toBe(novoColaborador.nome);
      
      testColaboradorId = response.body.data.id;
    });

    test('GET /api/colaboradores/:id - deve retornar um colaborador específico', async () => {
      const response = await request(app) // ⚠️ USA app CORRETAMENTE
        .get(`/api/colaboradores/${testColaboradorId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(testColaboradorId);
    });

    test('PUT /api/colaboradores/:id - deve atualizar um colaborador', async () => {
      const dadosAtualizacao = {
        cargo: 'Senior QA Engineer',
        telefone: '(11) 77777-0000'
      };

      const response = await request(app) // ⚠️ USA app CORRETAMENTE
        .put(`/api/colaboradores/${testColaboradorId}`)
        .send(dadosAtualizacao)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.cargo).toBe(dadosAtualizacao.cargo);
    });

    test('DELETE /api/colaboradores/:id - deve excluir um colaborador', async () => {
      const response = await request(app) // ⚠️ USA app CORRETAMENTE
        .delete(`/api/colaboradores/${testColaboradorId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });
});

describe('Model Colaborador - Testes Unitários', () => {
  beforeEach(() => {
    // Reseta os dados antes de cada teste
    Colaborador.colaboradores = [
      {
        id: '1',
        nome: 'João Silva',
        cargo: 'Desenvolvedor Backend',
        departamento: 'Tecnologia',
        email: 'joao.silva@empresa.com',
        telefone: '(11) 99999-9999',
        dataAdmissao: '2023-01-15',
        ativo: true,
        dataCriacao: new Date().toISOString(),
        dataAtualizacao: new Date().toISOString()
      }
    ];
  });

  test('listarTodos - deve retornar todos os colaboradores', () => {
    const colaboradores = Colaborador.listarTodos();
    expect(Array.isArray(colaboradores)).toBe(true);
  });

  test('buscarPorId - deve encontrar colaborador existente', () => {
    const colaborador = Colaborador.buscarPorId('1');
    expect(colaborador).toBeDefined();
    expect(colaborador.id).toBe('1');
  });
});