import api from './api'

const BASE_URL = '/reportes/pdf';

export const reporteService = {
    generarReporte: async (unidadId = null) => {
        const url = unidadId ? `${BASE_URL}?unidadId=${unidadId}` : BASE_URL;
        // Especificar que esperamos un blob (archivo binario)
        return await api.get(url, { responseType: 'blob' });
    },

    generarReporteMultiple: async (unidadId) => {
        const url = `/reportes/pdf/multiple?unidadId=${unidadId}`;
        return await api.get(url, { responseType: 'blob' });
    }
};
