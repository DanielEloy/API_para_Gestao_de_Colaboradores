# 👨‍💻 API para Gestão de Colaboradores  

API RESTful desenvolvida em **Node.js** para centralizar e automatizar o processo de cadastro e controle de colaboradores em organizações.  

---

## 📂 Estrutura do Projeto

```text
gestao-colaboradores-api/
├── jest.config.js         
├── src/
│   ├── config/
│   │   └── index.js
│   ├── controllers/
│   │   └── colaboradoresController.js
│   ├── middleware/
│   │   ├── errorMiddleware.js
│   │   ├── securityMiddleware.js
│   │   └── validationMiddleware.js
│   ├── models/
│   │   └── Colaborador.js
│   ├── routes/
│   │   └── colaboradores.js
│   └── utils/
│       └── logger.js
├── tests/
│   ├── colaboradores.test.js
│   ├── debug-api.js
│   ├── setup.test.js
│   └── test-api.js
├── package.json
├── package-lock.json
├── .env                    # ⚠️ NÃO VERSIONAR (adicionado ao .gitignore)
├── .env-example            # ✅ Template para outros desenvolvedores
├── server.js
└── .gitignore
```

---

## 🎯 Objetivos Principais

- **Centralização:** unificar dados de colaboradores em um sistema único  
- **Automatização:** reduzir processos manuais e inconsistências  
- **Escalabilidade:** arquitetura preparada para crescimento futuro  
- **Segurança:** implementação de boas práticas de segurança em APIs  

---

## 🏗️ Arquitetura Técnica

| Componente    | Tecnologia                    |
|---------------|-------------------------------|
| Runtime       | Node.js                       |
| Framework     | Express.js                    |
| Segurança     | Helmet, CORS, Rate Limiting   |
| Logging       | Logger customizado            |
| Validação     | Middlewares customizados      |
| Documentação  | OpenAPI (futuro)              |

---

## 🔐 Segurança Implementada

- **Helmet.js** → headers de segurança HTTP  
- **CORS** → controle de origens cross-origin  
- **Rate Limiting** → limite de 100 requisições/15min por IP  
- **Sanitização** → limpeza de dados de entrada  
- **Validação** → rigorosa validação de payloads  

**Exemplo de Headers de Segurança:**
```http
X-Content-Type-Options: nosniff  
X-Frame-Options: DENY  
X-XSS-Protection: 1; mode=block  
Strict-Transport-Security: max-age=31536000  
```

---

## 📊 Modelo de Dados — Colaborador

| Campo            | Tipo     | Obrigatório | Descrição                 |
|------------------|---------|-------------|---------------------------|
| id               | UUID    | ✅           | Identificador único        |
| nome             | String  | ✅           | Nome completo              |
| cargo            | String  | ✅           | Cargo/Função               |
| departamento     | String  | ✅           | Departamento               |
| email            | String  | ✅           | Email corporativo          |
| telefone         | String  | ❌           | Telefone                   |
| dataAdmissao     | Date    | ❌           | Data de admissão           |
| ativo            | Boolean | ✅           | Status (ativo/inativo)     |
| dataCriacao      | DateTime| ✅           | Timestamp criação          |
| dataAtualizacao  | DateTime| ✅           | Timestamp atualização      |

---
## 🔧 Configuração do Ambiente

1. **Copie o arquivo de exemplo:**
   ```bash
   cp .env-example .env
---

## 🚀 Endpoints da API

### 🔹 Health Check
```http
GET /health
```
**Resposta:**
```json
{
  "status": "OK",
  "timestamp": "2023-10-01T10:00:00.000Z",
  "uptime": "123.45s"
}
```

### 🔹 Listar Colaboradores
```http
GET /api/colaboradores?departamento=TI&page=1&limit=10
```

### 🔹 Buscar por ID
```http
GET /api/colaboradores/:id
```

### 🔹 Criar Colaborador
```http
POST /api/colaboradores
Content-Type: application/json
{
  "nome": "João Silva",
  "cargo": "Backend Developer",
  "departamento": "Tecnologia",
  "email": "joao.silva@empresa.com",
  "telefone": "(11) 99999-9999",
  "dataAdmissao": "2023-01-15"
}
```

### 🔹 Atualizar Colaborador
```http
PUT /api/colaboradores/:id
```

### 🔹 Excluir Colaborador
```http
DELETE /api/colaboradores/:id
```

### 🔹 Buscar por Departamento
```http
GET /api/colaboradores/departamento/:departamento
```

---

## 🛠️ Desenvolvimento

### 🔹 Pré-requisitos
- Node.js 16+  
- NPM ou Yarn  

### 🔹 Instalação
```bash
# Clone o repositório
git clone https://github.com/DanielEloy/API_para_Gestao_de_Colaboradores.git

# Instale dependências
npm install

# Ambiente de desenvolvimento
npm run dev

# Produção
npm start
```

### 🔹 Variáveis de Ambiente
```env
PORT=3000
NODE_ENV=development
LOG_LEVEL=debug
CORS_ORIGIN=*
RATE_LIMIT_MAX=100
APP_NAME="API Gestão de Colaboradores"
APP_VERSION=1.0.0
SUPPORT_EMAIL=suporte@empresa.com
```

---

## 📈 Monitoramento e Logs

**Níveis de Log:**
- `DEBUG` → informações detalhadas para dev  
- `INFO` → eventos normais da aplicação  
- `SUCCESS` → operações concluídas  
- `WARN` → situações que requerem atenção  
- `ERROR` → falhas que precisam intervenção  

**Exemplo:**
```
01/10/2023 10:00:00 [INFO] (routes/colaboradores.js:15) - Requisição processada
```

---

## 🧪 Testes

- Testes manuais com **Insomnia/Postman**  
- Exemplos:
  ```http
  GET http://localhost:3000/health
  POST http://localhost:3000/api/colaboradores
  ```

---

## 📋 Códigos de Status HTTP

| Código | Descrição              | Cenários                   |
|--------|------------------------|----------------------------|
| 200    | OK                     | Sucesso                    |
| 201    | Created                | Recurso criado             |
| 400    | Bad Request            | Dados inválidos            |
| 404    | Not Found              | Recurso não encontrado     |
| 429    | Too Many Requests      | Rate limit excedido        |
| 500    | Internal Server Error  | Erro interno do servidor   |

---

## 🔮 Roadmap

- **Fase 1 (Atual):** CRUD, segurança básica, logging  
- **Fase 2 (Próxima):** Autenticação JWT, PostgreSQL, Swagger  
- **Fase 3 (Futuro):** Cache Redis, upload de fotos, relatórios  

---
# Build completo (com testes)
npm run build

# Apenas testes
npm test

# Desenvolvimento
npm run dev

# Produção
npm start

# Testes específicos
npm run test:api
npm run test:model
npm run test:basic

# Desenvolvimento com watch
npm run test:watch

---


## ✅ Status dos Testes

- **Total de Testes:** 24
- **Testes Passando:** 24 (100%)
- **Cobertura de Código:** 51.89%
- **Ambiente de Teste:** Node.js + Jest

---

### Funcionalidades Testadas
- CRUD completo de colaboradores
- Health check da API
- Validações de entrada
- Tratamento de erros
- Middlewares de segurança

---

## 📞 Suporte

- **Email:** dans_eloy@hotmail.com  
- **Health Check:** `/health`  
- **Info:** `/api/info`  

---

## 📄 Licença

Este projeto está sob licença **MIT**. Veja o arquivo [LICENSE](./LICENSE) para mais detalhes.
