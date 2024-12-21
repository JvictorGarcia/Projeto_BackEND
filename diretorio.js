cadastro-carros/
├── models/               # Dados persistidos em JSON
│   ├── users.json
│   ├── carros.json
│   └── marcas.json
├── routes/               # Rotas
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── carRoutes.js
│   └── marcaRoutes.js
├── middleware/           # Middlewares personalizados
│   ├── authMiddleware.js
│   └── errorHandler.js
├── utils/                # Funções auxiliares
│   ├── fileUtils.js
│   └── validation.js
├── tests/                # Testes automatizados
│   ├── unit/
│   │   ├── fileUtils.test.js
│   │   ├── validation.test.js
│   │   └── authMiddleware.test.js
│   └── integration/
│       └── authRoutes.test.js
├── docs/                 # Documentação
│   └── swagger.json
├── config/               # Configurações centralizadas
│   └── config.js
├── .env                  # Variáveis de ambiente
├── index.js              # Ponto de entrada
├── package.json          # Dependências do projeto
├── README.md             # Documentação do projeto
