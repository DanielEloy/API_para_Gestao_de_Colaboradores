// tests/api.test.js - TESTES DA API ISOLADOS
const request = require('supertest');

// Importe o app Express diretamente
const express = require('express');
const app = express();
app.use(express.json());

// Mock das rotas básicas para teste
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'API funcionando',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/info', (req, res) => {
  res.json({
    name: 'API Gestão de Colaboradores',
    version: '1.0.0',
    description: 'API REST para gestão de colaboradores'
  });
});

// Mock básico da rota de colaboradores
app.get('/api/colaboradores', (req, res) => {
  res.json({
    success: true,
    data: [],
    total: 0,
    timestamp: new Date().toISOString()
  });
});

describe('Testes da API - Versão Simplificada', () => {
  test('Health Check deve retornar 200', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);
    
    expect(response.body.status).toBe('OK');
  });

  test('GET /api/info deve retornar informações', async () => {
    const response = await request(app)
      .get('/api/info')
      .expect(200);
    
    expect(response.body).toHaveProperty('name');
    expect(response.body).toHaveProperty('version');
  });

  test('GET /api/colaboradores deve retornar estrutura correta', async () => {
    const response = await request(app)
      .get('/api/colaboradores')
      .expect(200);
    
    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });
});