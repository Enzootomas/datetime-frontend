# 🌐 DateTime Frontend — Consumo da API de Data e Hora

Aplicação Front-end responsiva desenvolvida com **React** e **Vite** para consumir a API REST **[datetime-api-express](https://github.com/Enzootomas/datetime-api-express)** (`GET /api/data-hora`), atendendo integralmente à **Atividade 02 da Aula 04 (Consumindo APIs no Front-end)**.

---

## 🎯 Objetivo

Separar o Front-end e o Back-end em repositórios independentes e consumir, via `fetch()`, o endpoint de data e hora exposto pelo servidor **Express.js**, apresentando os dados formatados e o JSON bruto retornado pela API.

---

## ✨ Funcionalidades

- Consulta assíncrona ao endpoint `GET /api/data-hora` utilizando `fetch` e `async/await`;
- Exibição destacada da **data** e da **hora** atuais (`America/Sao_Paulo`);
- Configuração dinâmica da URL base da API (permite testar localmente em `http://localhost:3000` ou conectar diretamente à URL publicada no **Render**);
- Opção de atualização automática a cada 5 segundos com limpeza de `setInterval` no `useEffect`;
- Visualização do payload **JSON** retornado pelo servidor;
- Tratamento de estados de carregamento (`loading`) e erro de conexão (`error`);
- Layout responsivo para desktop e dispositivos móveis.

---

## 🛠️ Tecnologias Utilizadas

- React 19
- Vite 7
- JavaScript (ES Modules)
- CSS3 Responsivo (Flexbox, Grid e Media Queries)
- Fetch API / JSON

---

## 🚀 Como Executar Localmente

### 1. Iniciar a API Express (`datetime-api-express`)

Em um terminal separado, inicie o backend na porta `3000`:

```bash
npm install
npm start
```

### 2. Iniciar o Front-end (`datetime-frontend`)

```bash
npm install
npm run dev
```

Acesse o endereço exibido pelo Vite (geralmente `http://localhost:5173`).

Para gerar o build de produção:

```bash
npm run build
```

---

## ☁️ Configuração para Deploy na Vercel

1. Publique a API `datetime-api-express` no **Render** e copie a URL gerada (ex.: `https://datetime-api-express.onrender.com`).
2. Importe este repositório na **Vercel** (preset **Vite**).
3. Configure a variável de ambiente:
   - `VITE_API_BASE_URL` = URL pública do serviço no Render.
4. Realize o deploy.

---

## 🔗 Repositórios Relacionados

- **Back-end (API Express):** [Enzootomas/datetime-api-express](https://github.com/Enzootomas/datetime-api-express)
- **Central da Disciplina:** [Enzootomas/frontend-learning-hub](https://github.com/Enzootomas/frontend-learning-hub)
