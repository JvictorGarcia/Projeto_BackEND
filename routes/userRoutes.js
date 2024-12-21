//Aluno: José Victor Garcia RA:2209543
//Aluno: Marcos Gustavo Lara RA:1634399

const express = require('express');
const fs = require('fs').promises; 
const path = require('path');
const { sendResponse } = require('../utils/responseUtils');
const { validateUser  } = require('../utils/validation');
const { authenticateToken, isAdmin } = require('../authMiddleware'); 
const bcrypt = require('bcrypt'); 

const router = express.Router();
const usersFile = path.join(__dirname, '../data/users.json');

// Função utilitária para ler os dados dos usuários
const readUsersData = async () => {
  try {
    const data = await fs.readFile(usersFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler os dados dos usuários:', error);
    return [];
  }
};

// Função utilitária para escrever os dados dos usuários
const writeUsersData = async (data) => {
  try {
    await fs.writeFile(usersFile, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Erro ao escrever os dados dos usuários:', error);
  }
};
// Rota para instalar o sistema e criar um usuário administrador padrão
router.get('/install', async (req, res) => {
  const adminUser  = {
      id: Date.now(),
      username: 'admin',
      password: await bcrypt.hash('admin123', 10), // Senha padrão
      role: 'admin',
  };

  const users = await readUsersData();
  const userExists = users.some(user => user.username === adminUser .username);

  if (!userExists) {
      users.push(adminUser );
      await writeUsersData(users);
      return sendResponse(res, 201, 'Usuário administrador padrão criado com sucesso.', { username: adminUser .username });
  }

  sendResponse(res, 400, 'Usuário administrador já existe.');
});

// Rota para registrar um novo usuário comum
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  // Validação dos dados
  const validationError = validateUser (req.body);
  if (validationError) {
      return sendResponse(res, 400, validationError);
  }

  const users = await readUsersData();

  // Verificar se o usuário já existe
  const userExists = users.some(user => user.username === username);
  if (userExists) {
      return sendResponse(res, 400, 'Usuário já existe.');
  }

  // Hash da senha antes de armazenar
  const hashedPassword = await bcrypt.hash(password, 10);

  // Criar novo usuário
  const newUser  = {
      id: Date.now(),
      username,
      password: hashedPassword, // Armazenar a senha hash
      role: 'user', // Definindo o papel como 'user'
  };

  users.push(newUser );
  await writeUsersData(users);
  sendResponse(res, 201, 'Usuário cadastrado com sucesso.', { id: newUser .id, username });
});

// Rota para criar um novo administrador
router.post('/admin', authenticateToken, isAdmin, async (req, res) => {
  const { username, password } = req.body;

  // Validação dos dados
  const validationError = validateUser (req.body);
  if (validationError) {
    return sendResponse(res, 400, validationError);
  }

  const users = await readUsersData();

  // Verificar se o usuário já existe
  const userExists = users.some(user => user.username === username);
  if (userExists) {
    return sendResponse(res, 400, 'Usuário já existe.');
  }

  // Criar novo administrador
  const newAdmin = {
    id: Date.now(),
    username,
    password: await bcrypt.hash(password, 10), 
    role: 'admin',
  };

  users.push(newAdmin);
  await writeUsersData(users);
  sendResponse(res, 201, 'Administrador criado com sucesso.', { id: newAdmin.id, username });
});
// Rota para alterar dados pessoais do usuário
router.put('/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { username, password } = req.body;

  // Verificar se o usuário está tentando alterar seus próprios dados
  if (req.user.id !== parseInt(id)) {
      return sendResponse(res, 403, 'Você não pode alterar dados de outros usuários.');
  }

  const users = await readUsersData();
  const userIndex = users.findIndex(user => user.id === parseInt(id));

  if (userIndex === -1) {
      return sendResponse(res, 404, 'Usuário não encontrado.');
  }

  // Atualizar os dados do usuário
  if (username) users[userIndex].username = username;
  if (password) users[userIndex].password = await bcrypt.hash(password, 10); // Hash da nova senha

  await writeUsersData(users);
  sendResponse(res, 200, 'Dados do usuário atualizados com sucesso.', users[userIndex]);
});
// Rota para excluir um usuário não administrador
router.delete('/:id', authenticateToken, isAdmin, async (req, res) => {
  const { id } = req.params;

  // Ler os dados dos usuários
  const users = await readUsersData();

  // Encontrar o índice do usuário a ser excluído
  const userIndex = users.findIndex(user => user.id === parseInt(id));

  // Verificar se o usuário existe
  if (userIndex === -1) {
    return sendResponse(res, 404, 'Usuário não encontrado.');
  }

  // Verificar se o usuário a ser excluído é um administrador
  if (users[userIndex].role === 'admin') {
    return sendResponse(res, 403, 'Não é permitido excluir um usuário administrador.');
  }

  // Excluir o usuário
  users.splice(userIndex, 1);
  await writeUsersData(users);
  sendResponse(res, 200, 'Usuário excluído com sucesso.');
});

// Rota para listar todos os usuários 
router.get('/', authenticateToken, isAdmin, async (req, res) => {
  const users = await readUsersData();
  sendResponse(res, 200, 'Usuários listados com sucesso.', users);
});


module.exports = router;