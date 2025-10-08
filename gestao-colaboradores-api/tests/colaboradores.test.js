// tests/colaboradores.test.js
import request from 'supertest';
import app from '../server.js';
import Colaborador from '../src/models/Colaborador.js';

describe('API de Gestão de Colaboradores', () => {
  beforeEach(() => {
    // Resetar dados para testes
    if (Colaborador.colaboradores) {
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
    }
  });

  describe('Health Check', () => {
    test('GET /health - deve retornar status 200', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
    });

    test('GET /api/info - deve retornar informações da API', async () => {
      const response = await request(app)
        .get('/api/info')
        .expect(200);

      expect(response.body).toHaveProperty('name');
      expect(response.body).toHaveProperty('version');
    });
  });

  describe('CRUD de Colaboradores', () => {
    test('GET /api/colaboradores - deve retornar todos os colaboradores', async () => {
      const response = await request(app)
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

      const response = await request(app)
        .post('/api/colaboradores')
        .send(novoColaborador)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.nome).toBe(novoColaborador.nome);
    });

    test('POST /api/colaboradores - deve falhar com dados inválidos', async () => {
      const response = await request(app)
        .post('/api/colaboradores')
        .send({ cargo: 'Só cargo' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    test('GET /api/colaboradores/:id - deve retornar colaborador específico', async () => {
      const response = await request(app)
        .get('/api/colaboradores/1')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe('1');
    });

    test('GET /api/colaboradores/:id - deve retornar 404 para não encontrado', async () => {
      const response = await request(app)
        .get('/api/colaboradores/999')
        .expect(404);

      expect(response.body.success).toBe(false);
    });

    test('PUT /api/colaboradores/:id - deve atualizar colaborador', async () => {
      const dadosAtualizacao = {
        cargo: 'Senior QA Engineer',
        telefone: '(11) 77777-0000'
      };

      const response = await request(app)
        .put('/api/colaboradores/1')
        .send(dadosAtualizacao)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.cargo).toBe(dadosAtualizacao.cargo);
    });

    test('DELETE /api/colaboradores/:id - deve excluir colaborador', async () => {
      const response = await request(app)
        .delete('/api/colaboradores/1')
        .expect(200);

      expect(response.body.success).toBe(true);
    });
  });

  describe('Model Colaborador - Testes Unitários', () => {
    test('listarTodos - deve retornar todos os colaboradores', () => {
      const colaboradores = Colaborador.listarTodos();
      expect(Array.isArray(colaboradores)).toBe(true);
    });

    test('buscarPorId - deve encontrar colaborador existente', () => {
      const colaborador = Colaborador.buscarPorId('1');
      expect(colaborador).toBeDefined();
      expect(colaborador.id).toBe('1');
    });

    test('buscarPorId - deve retornar undefined para ID inexistente', () => {
      const colaborador = Colaborador.buscarPorId('id-inexistente');
      expect(colaborador).toBeUndefined();
    });

    test('criar - deve adicionar novo colaborador', () => {
      const novoColaborador = {
        nome: 'Novo Colaborador',
        cargo: 'Analista',
        departamento: 'RH',
        email: 'novo@empresa.com'
      };

      const resultado = Colaborador.criar(novoColaborador);
      
      expect(resultado).toHaveProperty('id');
      expect(resultado.nome).toBe(novoColaborador.nome);
      
      const colaboradores = Colaborador.listarTodos();
      expect(colaboradores.length).toBe(2);
    });
  });
});