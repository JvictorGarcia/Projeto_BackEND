//Aluno: José Victor Garcia RA:2209543
//Aluno: Marcos Gustavo Lara RA:1634399

const errorHandler = (err, req, res, next) => {
    if (!err) {
        err = { status: 500, message: 'Erro desconhecido' };
    }
    console.error(err.stack || 'Erro sem stack trace');

    res.status(err.status || 500).json({
        message: err.message || 'Erro interno no servidor',
        code: err.code || 'INTERNAL_SERVER_ERROR',
        error: process.env.NODE_ENV === 'development' ? err : {},
    });

    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
    } else {
        console.error(`[ERROR]: ${err.message}`);
    }
};

module.exports = errorHandler; 