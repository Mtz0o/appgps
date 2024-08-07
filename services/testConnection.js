// src/services/testConnection.js
import api from '../Api.js';

export const testConnection = async () => {
  try {
    const response = await api.get('/classes/Rota');
    console.log('Conexão bem-sucedida:', response.data);
    return true;
  } catch (error) {
    console.error('Erro ao conectar ao Back4App:', error.response ? error.response.data : error.message);
    return false;
  }
};
