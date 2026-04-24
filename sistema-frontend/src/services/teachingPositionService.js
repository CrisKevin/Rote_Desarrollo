import api from './api'

const BASE_URL = '/cargo_docente';

export const teachingPositionService = {
    getAll: async () => {
        return await api.get(BASE_URL);
    },

    crear: async (cargo) => {
        return await api.post(BASE_URL, cargo);
    },

    actualizar: async (id,cargo) => {
        return await api.put(`${BASE_URL}/${id}`,cargo);
    },

    eliminar: async (id) => {
        return await api.delete(`${BASE_URL}/${id}`);
    }
};
