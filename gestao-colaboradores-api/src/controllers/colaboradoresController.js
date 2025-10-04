const Colaborador = require('../models/Colaborador');

const colaboradoresController = {
  // Listar todos os colaboradores
  listarTodos: (req, res) => {
    try {
      const colaboradores = Colaborador.listarTodos();
      res.json({
        success: true,
        data: colaboradores,
        total: colaboradores.length,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erro ao listar colaboradores',
        message: error.message
      });
    }
  },

  // Buscar colaborador por ID
  buscarPorId: (req, res) => {
    try {
      const { id } = req.params;
      const colaborador = Colaborador.buscarPorId(id);

      if (!colaborador) {
        return res.status(404).json({
          success: false,
          error: 'Colaborador não encontrado',
          message: `Colaborador com ID ${id} não existe`
        });
      }

      res.json({
        success: true,
        data: colaborador
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erro ao buscar colaborador',
        message: error.message
      });
    }
  },

  // Criar novo colaborador
  criar: (req, res) => {
    try {
      const { nome, cargo, departamento, email, telefone, dataAdmissao } = req.body;

      // Validação básica
      if (!nome || !cargo || !departamento || !email) {
        return res.status(400).json({
          success: false,
          error: 'Dados incompletos',
          message: 'Nome, cargo, departamento e email são obrigatórios'
        });
      }

      const novoColaborador = Colaborador.criar({
        nome,
        cargo,
        departamento,
        email,
        telefone,
        dataAdmissao
      });

      res.status(201).json({
        success: true,
        message: 'Colaborador criado com sucesso',
        data: novoColaborador
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erro ao criar colaborador',
        message: error.message
      });
    }
  },

  // Atualizar colaborador
  atualizar: (req, res) => {
    try {
      const { id } = req.params;
      const dadosAtualizacao = req.body;

      const colaboradorAtualizado = Colaborador.atualizar(id, dadosAtualizacao);

      if (!colaboradorAtualizado) {
        return res.status(404).json({
          success: false,
          error: 'Colaborador não encontrado',
          message: `Colaborador com ID ${id} não existe`
        });
      }

      res.json({
        success: true,
        message: 'Colaborador atualizado com sucesso',
        data: colaboradorAtualizado
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erro ao atualizar colaborador',
        message: error.message
      });
    }
  },

  // Excluir colaborador
  excluir: (req, res) => {
    try {
      const { id } = req.params;
      const excluido = Colaborador.excluir(id);

      if (!excluido) {
        return res.status(404).json({
          success: false,
          error: 'Colaborador não encontrado',
          message: `Colaborador com ID ${id} não existe`
        });
      }

      res.json({
        success: true,
        message: 'Colaborador excluído com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erro ao excluir colaborador',
        message: error.message
      });
    }
  },

  // Buscar por departamento
  buscarPorDepartamento: (req, res) => {
    try {
      const { departamento } = req.params;
      const colaboradores = Colaborador.buscarPorDepartamento(departamento);

      res.json({
        success: true,
        data: colaboradores,
        total: colaboradores.length,
        departamento,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Erro ao buscar colaboradores por departamento',
        message: error.message
      });
    }
  }
};

module.exports = colaboradoresController;