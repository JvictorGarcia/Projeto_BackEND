// utils/responseUtils.js
//Aluno: José Victor Garcia RA:2209543
//Aluno: Marcos Gustavo Lara RA:1634399
const sendResponse = (res, statusCode, message, data = null) => {
    res.status(statusCode).json({
      status: statusCode,
      message,
      data,
    });
  };
  
  const errorHandler = (err, req, res, next) => {
    console.error(err);
    sendResponse(res, 500, 'Ocorreu um erro interno no servidor.');
  };
  
  module.exports = { sendResponse, errorHandler };