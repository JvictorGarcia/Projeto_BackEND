//Aluno: José Victor Garcia RA:2209543
//Aluno: Marcos Gustavo Lara RA:1634399

const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const { sendResponse } = require('../utils/responseUtils');
const { authenticateToken } = require('../authMiddleware');

const router = express.Router();
const motosFile = path.join(__dirname, '../data/motos.json');

// Função utilitária para ler os dados do arquivo JSON
const readMotosData = async () => {
    try {
        const data = await fs.readFile(motosFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro ao ler os dados das motos:', error);
        return [];
    }
};

// Rota POST - Adicionar uma nova moto (requer autenticação)
router.post('/', authenticateToken, async (req, res) => {
    const { modelo, ano, renavam, placa, cor, preco, kilometragem } = req.body;

    // Validação dos dados
    if (!modelo || !ano || !renavam || !placa || !cor || !preco || !kilometragem) {
        return sendResponse(res, 400, 'Todos os campos são obrigatórios.');
    }

    const newMoto = {
        id: Date.now(),
        modelo,
        ano,
        renavam,
        placa,
        cor,
        preco,
        kilometragem,
        proprietarioId: req.user.id
    };

    const motos = await readMotosData();
    motos.push(newMoto);
    await fs.writeFile(motosFile, JSON.stringify(motos, null, 2), 'utf8');
    sendResponse(res, 201, 'Moto adicionada com sucesso.', newMoto);
});

// Rota GET - Listar todas as motos (opcionalmente com paginação)
router.get('/', authenticateToken, async (req, res) => {
    const { limite = 10, pagina = 1 } = req.query;
    const motos = await readMotosData();

    const startIndex = (pagina - 1) * limite;
    const endIndex = startIndex + limite;
    const paginatedMotos = motos.slice(startIndex, endIndex);

    sendResponse(res, 200, 'Motos listadas com sucesso.', paginatedMotos);
});

// Rota PUT - Atualizar uma moto (requer autenticação)
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { modelo, ano, renavam, placa, cor, preco, kilometragem } = req.body;

    const motos = await readMotosData();
    const motoIndex = motos.findIndex(moto => moto.id === parseInt(id));

    if (motoIndex === -1) {
        return sendResponse(res, 404, 'Moto não encontrada.');
    }

    // Atualizar os dados da moto
    if (modelo) motos[motoIndex].modelo = modelo;
    if (ano) motos[motoIndex].ano = ano;
    if (renavam) motos[motoIndex].renavam = renavam;
    if (placa) motos[motoIndex].placa = placa;
    if (cor) motos[motoIndex].cor = cor;
    if (preco) motos[motoIndex].preco = preco;
    if (kilometragem) motos[motoIndex].kilometragem = kilometragem;

    await fs.writeFile(motosFile, JSON.stringify(motos, null, 2), 'utf8');
    sendResponse(res, 200, 'Moto atualizada com sucesso.', motos[motoIndex]);
});

// Rota DELETE - Excluir uma moto (requer autenticação)
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    const motos = await readMotosData();
    const motoIndex = motos.findIndex(moto => moto.id === parseInt(id));

    if (motoIndex === -1) {
        return sendResponse(res, 404, 'Moto não encontrada.');
    }

    motos.splice(motoIndex, 1);
    await fs.writeFile(motosFile, JSON.stringify(motos, null, 2), 'utf8');
    sendResponse(res, 200, 'Moto excluída com sucesso.');
});

module.exports = router;