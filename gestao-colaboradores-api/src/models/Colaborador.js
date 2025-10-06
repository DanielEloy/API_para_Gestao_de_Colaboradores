// src/models/Colaborador.js
const { v4: uuidv4 } = require('uuid');

// Array inicial de colaboradores
let colaboradores = [
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
  },
  {
    id: '2', 
    nome: 'Maria Santos',
    cargo: 'Desenvolvedor Frontend',
    departamento: 'Tecnologia',
    email: 'maria.santos@empresa.com',
    telefone: '(11) 88888-8888',
    dataAdmissao: '2023-03-20',
    ativo: true,
    dataCriacao: new Date().toISOString(),
    dataAtualizacao: new Date().toISOString()
  }
];

class Colaborador {
  static listarTodos() {
    return colaboradores;
  }

  static buscarPorId(id) {
    return colaboradores.find(colab => colab.id === id);
  }

  static criar(dados) {
    const novoColaborador = {
      id: uuidv4(),
      ...dados,
      ativo: true,
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString()
    };

    colaboradores.push(novoColaborador);
    return novoColaborador;
  }

  static atualizar(id, dados) {
    const index = colaboradores.findIndex(colab => colab.id === id);
    
    if (index === -1) return null;

    colaboradores[index] = {
      ...colaboradores[index],
      ...dados,
      dataAtualizacao: new Date().toISOString()
    };

    return colaboradores[index];
  }

  static excluir(id) {
    const index = colaboradores.findIndex(colab => colab.id === id);
    
    if (index === -1) return false;

    colaboradores.splice(index, 1);
    return true;
  }

  static buscarPorDepartamento(departamento) {
    return colaboradores.filter(colab => 
      colab.departamento.toLowerCase() === departamento.toLowerCase()
    );
  }

  // ⚠️ MÉTODO NOVO PARA TESTES - RESETA O ARRAY
  static resetarParaTestes() {
    colaboradores = [
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
}

module.exports = Colaborador;