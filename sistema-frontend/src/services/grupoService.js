import api from './api'

const BASE_URL = '/grupo';

export const grupoService = {
    getAll: async () => {
        return await api.get(BASE_URL);
    },

    crear: async (grupo) => {
        return await api.post(BASE_URL, grupo);
    },

    actualizar: async (id,grupo) => {
        return await api.put(`${BASE_URL}/${id}`,grupo);
    },

    eliminar: async (id) => {
        return await api.delete(`${BASE_URL}/${id}`);
    }
};
