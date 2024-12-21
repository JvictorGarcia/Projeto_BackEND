//Aluno: José Victor Garcia RA:2209543
//Aluno: Marcos Gustavo Lara RA:1634399

const config = {
    jwtSecret: process.env.JWT_SECRET || 'chave-padrao',
    jwtExpiration: '1h',
    dataDir: path.join(__dirname, 'models'), // Diretório dos JSONs
};
module.exports = config;
