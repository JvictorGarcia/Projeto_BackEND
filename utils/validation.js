// utils/validation.js
//Aluno: José Victor Garcia RA:2209543
//Aluno: Marcos Gustavo Lara RA:1634399
const validateUser  = (user) => {
    const { username, password } = user; 
    if (!username || !password) {
        return 'Todos os campos são obrigatórios.'; 
    }
    
    return null; // Retorna null se não houver erro
};

module.exports = { validateUser  };