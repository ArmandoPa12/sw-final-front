// src/stores/auth.js
import axios from '../auxiliar/axios'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCalendarioStore = defineStore('calendario', () => {

    const calendarios = ref([])
    const notaActual = ref();

    const setNotaActual = (nota) => {
        notaActual.value = nota
    }

    const get = async(id) => {
        try {

            const res = await axios.post(`calendario`, id)
            calendarios.value = res.data;
            return res.data;
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

    const deleted = async(datos, id) => {
        try {
            const res = await axios.post(`api/proyecto/${id}/imagen`, datos);
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


    const total = computed(() => calendarios.value.length);
    const totalNotas = computed(() => calendarios.value.notas.length);

    return {get,
        calendarios: calendarios,
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