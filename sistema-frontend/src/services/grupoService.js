import api from './api'

export const grupoService = {
    getAll: async () => {
        return await api.get('/grupo');
    },

    crear: async (grupo) => {
        return await api.post('/grupo', grupo);
    },

    actualizar: async (id,grupo) => {
        return await api.put(`/grupo/${id}`,grupo);
    },

    eliminar: async (id) => {
        return await api.delete(`/grupo/${id}`);
    }
};
