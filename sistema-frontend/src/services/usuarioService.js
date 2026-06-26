// src/services/usuarioService.js
import api from './api';

const BASE_URL = '/auth';

export const usuarioService = {
    verificarSesion: async () => {
        return await api.get(`${BASE_URL}/verificar`);
    },

    getAll: async () => {
        return await api.get(BASE_URL);
    },

    crear: async (data) => {
        return await api.post(`${BASE_URL}/register`, data);
    },

    actualizar: async (id, data) => {
        return await api.put(`${BASE_URL}/update/${id}`, data);
    },

    eliminar: async (id) => {
        return await api.delete(`${BASE_URL}/delete/${id}`);
    }
};