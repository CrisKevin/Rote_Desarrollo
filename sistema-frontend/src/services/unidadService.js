import api from './api'

const BASE_URL = '/unidad';

export const unidadService = {
    getAll: async () => {
        return await api.get(BASE_URL);
    },

    getAllActive: async () => {
        return await api.get(`${BASE_URL}/active`);
    },

    crear: async (cargo) => {
        return await api.post(BASE_URL, cargo);
    },

    actualizar: async (id,cargo) => {
        return await api.put(`${BASE_URL}/${id}`,cargo);
    },

    eliminar: async (id) => {
        return await api.delete(`${BASE_URL}/${id}`);
    },
    
    eliminarSuave: async (id) => {
        return await api.delete(`${BASE_URL}/active/${id}`);
    }
};
