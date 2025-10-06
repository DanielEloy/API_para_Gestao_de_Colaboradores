// src/routes/colaboradores.js - CORRIGIDO
import express from "express";
import { 
  listarTodos, 
  buscarPorId, 
  criar, 
  atualizar,  // ✅ Nome correto
  excluir, 
  buscarPorDepartamento 
} from "../controllers/colaboradoresController.js";

const router = express.Router();

// Rotas CRUD
router.get("/", listarTodos);
router.get("/:id", buscarPorId);
router.post("/", criar);
router.put("/:id", atualizar); 
router.delete("/:id", excluir);

// Rota customizada
router.get("/departamento/:departamento", buscarPorDepartamento);

export default router;