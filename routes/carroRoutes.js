//Aluno: José Victor Garcia RA:2209543
//Aluno: Marcos Gustavo Lara RA:1634399

const express = require('express');
const fs = require('fs').promises; 
const path = require('path');
const { sendResponse } = require('../utils/responseUtils');
const { authenticateToken } = require('../authMiddleware'); 

const router = express.Router();
const carrosFile = path.join(__dirname, '../data/carros.json');

// Função  para ler os dados do arquivo JSON
const readCarrosData = async () => {
    try {
        const data = await fs.readFile(carrosFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Erro ao ler os dados dos carros:', error);
        return [];
    }
};

// Rota POST - Adicionar um novo carro (requer autenticação)
router.post('/', authenticateToken, async (req, res) => {
    const { modelo, ano, renavam, placa, cor, preco, kilometragem } = req.body;

    // Validação dos dados
    if (!modelo || !ano || !renavam || !placa || !cor || !preco || !kilometragem) {
        return sendResponse(res, 400, 'Todos os campos são obrigatórios.');
    }

    const newCarro = {
        id: Date.now(), 
        modelo,
        ano,
        renavam,
        placa,
        cor,
        preco,
        kilometragem,
        proprietarioId: req.user.id // Atribuindo o ID do proprietário
    };

    const carros = await readCarrosData();
    carros.push(newCarro); // Adiciona o novo carro ao array
    await fs.writeFile(carrosFile, JSON.stringify(carros, null, 2), 'utf8'); 
    sendResponse(res, 201, 'Carro adicionado com sucesso.', newCarro);
});

// Rota GET - Listar todos os carros (opcionalmente com paginação)
router.get('/', authenticateToken, async (req, res) => {
    const { limite = 10, pagina = 1 } = req.query; 
    const carros = await readCarrosData();

    // Implementação de paginação
    const startIndex = (pagina - 1) * limite;
    const endIndex = startIndex + limite;
    const paginatedCarros = carros.slice(startIndex, endIndex);

    sendResponse(res, 200, 'Carros listados com sucesso.', paginatedCarros);
});

// Rota PUT - Atualizar um carro (requer autenticação)
router.put('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { modelo, ano, renavam, placa, cor, preco, kilometragem } = req.body;

    const carros = await readCarrosData();
    const carroIndex = carros.findIndex(carro => carro.id === parseInt(id));

    if (carroIndex === -1) {
        return sendResponse(res, 404, 'Carro não encontrado.');
    }

    // Atualizar os dados do carro
    if (modelo) carros[carroIndex].modelo = modelo;
    if (ano) carros[carroIndex].ano = ano;
    if (renavam) carros[carroIndex].renavam = renavam;
    if (placa) carros[carroIndex].placa = placa;
    if (cor) carros[carroIndex].cor = cor;
    if (preco) carros[carroIndex].preco = preco;
    if (kilometragem) carros[carroIndex].kilometragem = kilometragem;

    await fs.writeFile(carrosFile, JSON.stringify(carros, null, 2), 'utf8');
    sendResponse(res, 200, 'Carro atualizado com sucesso.', carros[carroIndex]);
});

// Rota DELETE - Excluir um carro (requer autenticação)
router.delete('/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;

    const carros = await readCarrosData();
    const carroIndex = carros.findIndex(carro => carro.id === parseInt(id));

    if (carroIndex === -1) {
        return sendResponse(res,  404, 'Carro não encontrado.');
    }

    carros.splice(carroIndex, 1); // Remove o carro do array
    await fs.writeFile(carrosFile, JSON.stringify(carros, null, 2), 'utf8'); // Atualiza o arquivo
    sendResponse(res, 200, 'Carro excluído com sucesso.');
});

module.exports = router;