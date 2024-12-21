//Aluno: José Victor Garcia RA:2209543
//Aluno: Marcos Gustavo Lara RA:1634399

require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const carroRoutes = require('./routes/carroRoutes');
const motoRoutes = require('./routes/motoRoutes');
const errorHandler = require('./middleware/errorHandler');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./docs/swagger.json');

const app = express(); // Inicialize o app aqui
const PORT = process.env.PORT || 3001;

app.use(express.json()); // Para analisar o corpo da requisição como JSON

// Configuração da documentação Swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/carros', carroRoutes); 
app.use('/motos', motoRoutes);

// Middleware de tratamento de erros
app.use(errorHandler); 

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});