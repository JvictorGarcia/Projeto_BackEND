//Aluno: José Victor Garcia RA:2209543
//Aluno: Marcos Gustavo Lara RA:1634399

const jwt = require('jsonwebtoken');
const { sendResponse } = require('./utils/responseUtils');

// Middleware para autenticar o token JWT
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  console.log('Token recebido:', token); // Log do token recebido
  if (!token) return sendResponse(res, 401, 'Acesso negado.');

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error('Erro na verificação do token:', err); // Log de erro na verificação do token
      return sendResponse(res, 403, 'Token inválido.');
    }
    req.user = user;
    next();
  });
};

// Middleware para verificar se o usuário é um administrador
const isAdmin = (req, res, next) => {
  console.log('Papel do usuário:', req.user.role); // Log do papel do usuário
  if (req.user.role !== 'admin') {
    return sendResponse(res, 403, 'Acesso negado. Somente administradores podem acessar esta rota.');
  }
  next();
};

// Exportando os middlewares
module.exports = { authenticateToken, isAdmin };