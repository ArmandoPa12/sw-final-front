// src/stores/auth.js
import axios from '../auxiliar/axios'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useMateriaStore = defineStore('materia', () => {

    const materias = ref([])

    const get = async(id) => {
        try {
            const res = await axios.get(`materia/${id}`)
            materias.value = res.data;

        } catch (error) {
            throw error;
        }
    }

    const getUno = async(datos) => {

        try {
            const res = await axios.post('api/proyecto/uno', datos)
            return res.data;

        } catch (error) {
            throw error;
        }
    }

    const create = async(datos) => {
        try {
            const res = await axios.post('materia', datos)
            return res.data;
        } catch (error) {
            throw error;
        }
    }


    const update = async(datos, id) => {
        try {
            const res = await axios.post(`api/proyecto/${id}`, datos);
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



    const total = computed(() => materias.value.length);
    const totalNotas = computed(() => materias.value.notas.length);

    return {get,
        materias: materias,
        total,
        totalNotas,
        create,
        getUno,
        update,
        deleted
    }
})