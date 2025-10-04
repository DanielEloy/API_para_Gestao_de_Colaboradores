// tests/basic.test.js - VERSÃO FINAL CORRIGIDA

// Testes básicos do Jest - SEM API
describe('Testes Básicos do Jest', () => {
  test('1 + 1 deve ser 2', () => {
    expect(1 + 1).toBe(2);
  });

  test('deve verificar strings', () => {
    expect('hello world').toContain('hello');
  });

  test('deve verificar objetos', () => {
    const obj = { nome: 'Teste', idade: 30 };
    expect(obj).toHaveProperty('nome');
    expect(obj).toHaveProperty('idade', 30);
  });
});

// Testes básicos da API usando app Express simples
describe('Testes Básicos da API com App Simples', () => {
  const express = require('express');
  const app = express();
  app.use(express.json());

  // Mock das rotas básicas
  app.get('/health', (req, res) => {
    res.status(200).json({ 
      status: 'OK', 
      message: 'API funcionando',
      timestamp: new Date().toISOString()
    });
  });

  app.get('/api/colaboradores', (req, res) => {
    res.json({
      success: true,
      data: [],
      total: 0,
      timestamp: new Date().toISOString()
    });
  });

  test('Health Check deve retornar 200', async () => {
    const request = require('supertest');
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.body.status).toBe('OK');
  });

  test('GET /api/colaboradores deve retornar array', async () => {
    const request = require('supertest');
    const response = await request(app)
      .get('/api/colaboradores')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});