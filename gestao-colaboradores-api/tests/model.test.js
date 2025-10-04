// tests/model.test.js - VERSÃO FINAL CORRIGIDA
const Colaborador = require('../src/models/Colaborador');

describe('Model Colaborador - Testes Unitários', () => {
  beforeEach(() => {
    // ⚠️ USA O NOVO MÉTODO PARA RESETAR
    Colaborador.resetarParaTestes();
  });

  test('listarTodos - deve retornar todos os colaboradores', () => {
    const colaboradores = Colaborador.listarTodos();
    expect(Array.isArray(colaboradores)).toBe(true);
    expect(colaboradores.length).toBe(1); // ✅ AGORA SEMPRE 1
  });

  test('buscarPorId - deve encontrar colaborador existente', () => {
    const colaborador = Colaborador.buscarPorId('1');
    expect(colaborador).toBeDefined();
    expect(colaborador.id).toBe('1');
    expect(colaborador.nome).toBe('João Silva');
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
    expect(resultado.ativo).toBe(true);
    
    const colaboradores = Colaborador.listarTodos();
    expect(colaboradores.length).toBe(2); // 
  });
});