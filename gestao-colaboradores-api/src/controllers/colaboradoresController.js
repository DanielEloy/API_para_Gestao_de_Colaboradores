import { logger } from "../utils/logger.js";

// Mock data
let colaboradores = [
  {
    id: '1',
    nome: 'João Silva',
    cargo: 'Desenvolvedor Backend',
    departamento: 'Tecnologia',
    email: 'joao.silva@empresa.com',
    ativo: true,
    dataCriacao: new Date().toISOString()
  }
];

export const listarTodos = (req, res) => {
  try {
    logger.info("Listando todos os colaboradores");
    
    res.json({
      success: true,
      data: colaboradores,
      total: colaboradores.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error("Erro ao listar colaboradores:", error);
    res.status(500).json({
      success: false,
      error: 'Erro ao listar colaboradores',
      timestamp: new Date().toISOString()
    });
  }
};

export const buscarPorId = (req, res) => {
  try {
    const { id } = req.params;
    logger.debug(`Buscando colaborador por ID: ${id}`);
    
    const colaborador = colaboradores.find(colab => colab.id === id);

    if (!colaborador) {
      logger.warn(`Colaborador não encontrado: ${id}`);
      return res.status(404).json({
        success: false,
        error: 'Colaborador não encontrado',
        timestamp: new Date().toISOString()
      });
    }

    logger.debug(`Colaborador encontrado: ${colaborador.nome}`);
    res.json({
      success: true,
      data: colaborador
    });
  } catch (error) {
    logger.error(`Erro ao buscar colaborador ${id}:`, error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar colaborador',
      timestamp: new Date().toISOString()
    });
  }
};

export const criar = (req, res) => {
  try {
    const { nome, cargo, departamento, email } = req.body;
    logger.debug("Tentando criar novo colaborador:", { nome, email });

    if (!nome || !cargo || !departamento || !email) {
      logger.warn("Dados incompletos para criar colaborador:", req.body);
      return res.status(400).json({
        success: false,
        error: 'Nome, cargo, departamento e email são obrigatórios',
        timestamp: new Date().toISOString()
      });
    }

    const novoColaborador = {
      id: (colaboradores.length + 1).toString(),
      nome,
      cargo,
      departamento,
      email,
      ativo: true,
      dataCriacao: new Date().toISOString()
    };

    colaboradores.push(novoColaborador);
    logger.success(`Colaborador criado com sucesso: ${nome} (ID: ${novoColaborador.id})`);

    res.status(201).json({
      success: true,
      message: 'Colaborador criado com sucesso',
      data: novoColaborador
    });
  } catch (error) {
    logger.error("Erro ao criar colaborador:", error);
    res.status(500).json({
      success: false,
      error: 'Erro ao criar colaborador',
      timestamp: new Date().toISOString()
    });
  }
};

export const atualizar = (req, res) => {
  try {
    const { id } = req.params;
    logger.debug(`Atualizando colaborador: ${id}`, req.body);

    const index = colaboradores.findIndex(colab => colab.id === id);

    if (index === -1) {
      logger.warn(`Tentativa de atualizar colaborador inexistente: ${id}`);
      return res.status(404).json({
        success: false,
        error: 'Colaborador não encontrado',
        timestamp: new Date().toISOString()
      });
    }

    colaboradores[index] = {
      ...colaboradores[index],
      ...req.body,
      dataAtualizacao: new Date().toISOString()
    };

    logger.success(`Colaborador atualizado: ${colaboradores[index].nome} (ID: ${id})`);

    res.json({
      success: true,
      message: 'Colaborador atualizado com sucesso',
      data: colaboradores[index]
    });
  } catch (error) {
    logger.error(`Erro ao atualizar colaborador ${id}:`, error);
    res.status(500).json({
      success: false,
      error: 'Erro ao atualizar colaborador',
      timestamp: new Date().toISOString()
    });
  }
};

export const excluir = (req, res) => {
  try {
    const { id } = req.params;
    logger.debug(`Excluindo colaborador: ${id}`);

    const index = colaboradores.findIndex(colab => colab.id === id);

    if (index === -1) {
      logger.warn(`Tentativa de excluir colaborador inexistente: ${id}`);
      return res.status(404).json({
        success: false,
        error: 'Colaborador não encontrado',
        timestamp: new Date().toISOString()
      });
    }

    const colaboradorExcluido = colaboradores[index];
    colaboradores.splice(index, 1);

    logger.success(`Colaborador excluído: ${colaboradorExcluido.nome} (ID: ${id})`);

    res.json({
      success: true,
      message: 'Colaborador excluído com sucesso'
    });
  } catch (error) {
    logger.error(`Erro ao excluir colaborador ${id}:`, error);
    res.status(500).json({
      success: false,
      error: 'Erro ao excluir colaborador',
      timestamp: new Date().toISOString()
    });
  }
};

export const buscarPorDepartamento = (req, res) => {
  try {
    const { departamento } = req.params;
    logger.debug(`Buscando colaboradores por departamento: ${departamento}`);

    const colaboradoresFiltrados = colaboradores.filter(
      colab => colab.departamento.toLowerCase() === departamento.toLowerCase()
    );

    logger.info(`Encontrados ${colaboradoresFiltrados.length} colaboradores no departamento ${departamento}`);

    res.json({
      success: true,
      data: colaboradoresFiltrados,
      total: colaboradoresFiltrados.length,
      departamento,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    logger.error(`Erro ao buscar colaboradores por departamento ${departamento}:`, error);
    res.status(500).json({
      success: false,
      error: 'Erro ao buscar colaboradores por departamento',
      timestamp: new Date().toISOString()
    });
  }
};