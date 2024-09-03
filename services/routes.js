// src/services/routeService.js
import Api from "../Api.js";

export const createRoute = async (name, path, duration) => {
  try {
    const response = await Api.post("/classes/Rotas", {
      nome: name,
      caminho: path,
      duracao: duration,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao criar a rota:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const getRoutes = async () => {
  try {
    const response = await Api.get("/classes/Rotas");
    // console.log("Rotas buscadas:", response.data.results);
    return response.data.results;
  } catch (error) {
    console.error(
      "Erro ao buscar rotas:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

export const deleteRoute = async (id) => {
  try {
    const response = await Api.delete(`/classes/Rotas/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao deletar a rota:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};