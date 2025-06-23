// src/stores/auth.js
import axios from '../auxiliar/axios'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useNotaStore = defineStore('nota', () => {

    const notas = ref([])
    const notaActual = ref();

    const setNotaActual = (nota) => {
        notaActual.value = nota
    }

    const get = async(id) => {
        try {
            const res = await axios.get(`nota/${id}`)
            notas.value = res.data;

        } catch (error) {
            throw error;
        }
    }

    const getUno = async(datos) => {

        try {
            const res = await axios.post('nota/get', datos)
            return res.data;

        } catch (error) {
            throw error;
        }
    }

    const create = async(datos) => {
        try {
            const res = await axios.post('nota', datos)
            return res.data;
        } catch (error) {
            throw error;
        }
    }


    const update = async(datos, id) => {
        try {
            const res = await axios.put(`nota/${id}`, datos);
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    const deleted = async(id, user) => {
        try {
            const res = await axios.delete(`nota/${id}`, { usuarioId: user });
            return res.data;
        } catch (error) {
            throw error;
        }
    };

    const imagen = async(datos) => {
        try {
            const res = await axios.post(`file/imagen`, datos, {
                headers: {}
            });
            return res.data;
        } catch (error) {
            throw error;
        }
    };


    const total = computed(() => notas.value.length);
    const totalNotas = computed(() => notas.value.notas.length);

    return {get,
        notas: notas,
        total,
        totalNotas,
        create,
        getUno,
        update,
        deleted,
        setNotaActual,
        notaActual: notaActual,
        imagen
    }
})