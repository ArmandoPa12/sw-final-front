// src/stores/auth.js
import axios from '../auxiliar/axios'
import axiosFlask from '../auxiliar/axiosFlask'

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useFilesStore = defineStore('files', () => {

    const transcripcion = ref('');
    const status = ref('');
    const error = ref(null);

    const createAudio = async({ notaid, audioFile }) => {
        try {
            const formData = new FormData();
            formData.append('notaid', notaid);
            formData.append('audioData', audioFile);


            const res = await axios.post('file/audio', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            return res.data;
        } catch (error) {
            throw error;
        }
    };

    const updateTranscripcin = async(audio) => {
        try {
            const res = await axios.put(`file/audio/${audio.id}`, { transcripcion: audio.transcripcion });
            return res.data;
        } catch (error) {
            throw error;
        }
    };



    const deleteAudio = async(notaId, audioId) => {
        try {
            const res = await axios.delete(`file/audio/${notaId}/${audioId}`);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    const transcribirAudio = async({ notaid, audioFile }) => {
        status.value = '⏳ Transcribiendo...';
        error.value = null;
        transcripcion.value = '';

        const formData = new FormData();
        formData.append('notaid', notaid);
        formData.append('audioData', audioFile); // clave usada por tu backend

        try {
            const response = await axios.post('file/audio', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            transcripcion.value = response.data.transcripcion || response.data.texto || '';
            status.value = '✅ Transcripción completada';
        } catch (err) {
            status.value = '❌ Error al transcribir';
            error.value = err;
            //   error.value = err?.response?.data?.message || err.message;
        }
    };

    const transcribirAudioDesdeUrl = async(url) => {
        status.value = 'Transcribiendo desde URL...';
        error.value = null;
        transcripcion.value = '';

        try {
            const res = await axiosFlask.post('/transcribir/url', { url });
            transcripcion.value = res.data.transcripcion || res.data.texto || '';
            status.value = 'Transcripción completada';
            return transcripcion.value;
        } catch (err) {
            status.value = 'error al transcribir';
            error.value = err;
            return null;
        }
    };

    const resumir = async(texto) => {
        try {
            const res = await axiosFlask.post('/resumir-chatgpt', { texto });
            return res;
        } catch (err) {
            return err;
        }
    };

    const mapaMental = async(texto) => {
        try {
            const res = await axiosFlask.post('/generar-mapa-mental', { texto });
            return res;
        } catch (err) {
            return err;
        }
    };




    return {
        createAudio,
        deleteAudio,
        transcribirAudioDesdeUrl,
        updateTranscripcin,
        resumir,
        mapaMental,
        transcripcion,
        status,
        error,
    }
})