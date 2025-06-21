import axios from '../auxiliar/axios'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const usePlanStore = defineStore('plan', () => {

    const plan = ref([])
    const caracteristicas = ref(null);


    const get = async(id) => {
        try {
            const res = await axios.post(`plan`, { userId: id })
            plan.value = res.data.nombre
            caracteristicas.value = res.data.caracteristicas
        } catch (error) {
            throw error;
        }
    }

    const update = async(userId, planId) => {
        try {
            const res = await axios.put(`plan/suscripcion`, {
                userId,
                planId,
            })
            await get(userId)
            console.log(res);

            return res
        } catch (error) {
            throw error
        }
    }

    const tieneCaracteristica = (nombre) => {
        if (!caracteristicas.value) return false
        return caracteristicas.value.some(c => c.caracteristica.nombre === nombre)
    }


    return {
        get,
        update,
        tieneCaracteristica,
        plan,
        caracteristicas
    }
})