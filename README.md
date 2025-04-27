# 🚀 API_REX

[![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)](https://jwt.io/)
[![Ollama](https://img.shields.io/badge/Ollama-AI-blue?style=for-the-badge)](https://ollama.ai/)

## 📋 Description

API_REX is a powerful and flexible API framework that combines the best of modern technologies:

- **Ollama Integration**: Leverage AI capabilities with a built-in Super AI Agent
- **Node.js & Express**: Fast and scalable backend architecture
- **MongoDB**: Robust and flexible NoSQL database
- **JWT Authentication**: Secure user authentication system

Perfect for building AI-enhanced applications with a solid foundation for authentication, data management, and AI integration.

## ✨ Features

- 🔐 **Secure Authentication**: JWT-based user authentication system
- 📚 **Book Model**: Ready-to-use data model for book-related applications
- 🧠 **AI Integration**: Built-in Ollama-powered AI agent
- 🔄 **RESTful API**: Clean and intuitive API endpoints
- 🛡️ **CORS Protection**: Configured security for cross-origin requests
- 📊 **Request Logging**: Comprehensive logging with Morgan

## 🛠️ Installation

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Ollama (for AI capabilities)

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/jsanchezpc/API_REX.git
   cd API_REX
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   APP_PORT=8080
   DB=mongodb://localhost:27017/rex_db # or your MongoDB connection string
   JWT_SECRET=your_jwt_secret_key
   ```

## 🚀 Usage

### Start the server

```bash
npm start
```

The server will start on the port specified in your `.env` file (default: 3000).

### API Endpoints

- `GET /`: API status check
- `/account`: User authentication endpoints
- `/agent`: AI agent interaction endpoints

## 🧠 AI Agent

API_REX comes with a built-in AI agent powered by Ollama. The agent is initialized automatically when the server starts and can be accessed through the `/agent` endpoints.

The AI agent uses the Llama3.2 model and is configured with a system prompt that makes it respond concisely.

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid JWT token in the Authorization header.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.