// utils/fileUtils.js
//Aluno: José Victor Garcia RA:2209543
//Aluno: Marcos Gustavo Lara RA:1634399
const fs = require('fs').promises; 
const path = require('path');

// Lê os dados de um arquivo JSON
const readData = async (fileName) => {
  try {
    const filePath = path.join(__dirname, '../data', fileName); 
    const fileContent = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error(`Erro ao ler o arquivo ${fileName}:`, error.message);
    throw new Error('Falha ao ler os dados do arquivo.');
  }
};

// Escreve os dados em um arquivo JSON
const writeData = async (fileName, data) => {
  try {
    const dirPath = path.join(__dirname, '../data'); 
    const filePath = path.join(dirPath, fileName);

    // Certifique-se de que o diretório existe
    await fs.mkdir(dirPath, { recursive: true }); // Cria o diretório se não existir
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Erro ao escrever no arquivo ${fileName}:`, error.message);
    throw new Error('Falha ao escrever os dados no arquivo.');
  }
};
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


module.exports = { readData, writeData };