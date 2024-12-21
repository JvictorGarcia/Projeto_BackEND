//Aluno: José Victor Garcia RA:2209543
//Aluno: Marcos Gustavo Lara RA:1634399

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { readData } = require('../utils/fileUtils'); 
const router = express.Router();

// Rota para login
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Validação dos dados
    if (!username || !password) {
        return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
    }

    // Ler os dados existentes dos usuários
    const users = await readData('users.json');

    // Verificar se o usuário existe
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(400).json({ message: 'Usuário não encontrado.' });
    }

    // Verificar a senha
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Senha incorreta.' });
    }

    // Gerar o token JWT
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Retornar o token
    res.status(200).json({ message: 'Login bem-sucedido!', token });
});

module.exports = router;