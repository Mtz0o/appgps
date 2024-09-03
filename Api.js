
import axios from 'axios';

const API_BASE_URL = 'https://parseapi.back4app.com'; // URL da API do Back4App
const APP_ID = 'o4XTSvvuI4OQVO5KIqebPOMegEcma9MubR6uGHDu'; // Substitua pelo seu Application ID
const REST_API_KEY = 'H0Fh5TDQy4TqXNeYabBIzwfqQDrNszMOrdBJfGUg'; // Substitua pelo seu REST API Key

const Api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'X-Parse-Application-Id': APP_ID,
    'X-Parse-REST-API-Key': REST_API_KEY,
    'Content-Type': 'application/json',
  },
});

export default Api;
