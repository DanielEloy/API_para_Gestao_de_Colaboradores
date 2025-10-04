const express = require('express');
const router = express.Router();
const colaboradoresController = require('../controllers/colaboradoresController');

// Rotas CRUD
router.get('/', colaboradoresController.listarTodos);
router.get('/:id', colaboradoresController.buscarPorId);
router.post('/', colaboradoresController.criar);
router.put('/:id', colaboradoresController.atualizar);
router.delete('/:id', colaboradoresController.excluir);

// Rota customizada
router.get('/departamento/:departamento', colaboradoresController.buscarPorDepartamento);

module.exports = router;