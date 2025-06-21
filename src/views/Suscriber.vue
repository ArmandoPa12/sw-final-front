<template>

    <div class="col">
        <button class="button-60" @click="$emit('cerrar')">Cerrar</button>
        <div class="pricing-header px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center">
            <h1 class="display-4">Planes</h1>
            <p class="lead">Selecciona el plan que mejor se ajuste a tus necesidades y desbloquea nuevas
                funcionalidades.
            </p>
        </div>
        <div class="container my-5">
            <div class="row">
                <div class="col-md-4 mb-3">
                    <div class="card text-center h-100">
                        <div class="card-header">
                            <h4 class="my-0 font-weight-normal">Gratuito</h4>
                        </div>
                        <div class="card-body">
                            <h1 class="card-title pricing-card-title">$0 <small class="text-muted">/ mes</small></h1>
                            <ul class="list-unstyled mt-3 mb-4">
                                <li>Registrar nota</li>
                                <li>Crear materia</li>
                                <li>Escribir apunte</li>
                                <li>Actualizar suscripción</li>
                            </ul>
                            <button type="button" @click="irAPago(1)" class="btn btn-lg btn-block btn-outline-primary" :disabled="esPlanG" >
                                {{ esPlanG ? 'Plan Actual' : 'Volver al Gratuito' }}</button>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-3">
                    <div class="card text-center h-100 border-primary">
                        <div class="card-header bg-primary text-white">
                            <h4 class="my-0 font-weight-normal">Básico</h4>
                        </div>
                        <div class="card-body">
                            <h1 class="card-title pricing-card-title">$15 <small class="text-muted">/ mes</small></h1>
                            <ul class="list-unstyled mt-3 mb-4">
                                <li>Crear materia</li>
                                <li>Registrar nota</li>
                                <li>Grabar audio</li>
                                <li>Escribir apunte</li>
                                <li>Dibujar</li>
                                <li>Calendario personal</li>

                            </ul>
                            <button type="button" @click="irAPago(2)" class="btn btn-lg btn-block btn-primary" :disabled="esPlanB" >{{ esPlanB ? 'Plan Actual' : 'Elegir Básico' }}</button>
                        </div>
                    </div>
                </div>

                <div class="col-md-4 mb-3">
                    <div class="card text-center h-100 border-success">
                        <div class="card-header bg-success text-white">
                            <h4 class="my-0 font-weight-normal">Premium</h4>
                        </div>
                        <div class="card-body">
                            <h1 class="card-title pricing-card-title">$30 <small class="text-muted">/ mes</small></h1>
                            <ul class="list-unstyled mt-3 mb-4">
                                <li>Crear materia</li>
                                <li>Registrar nota</li>
                                <li>Grabar audio</li>
                                <li>Escribir apunte</li>
                                <li>Dibujar</li>
                                <li>Resumen con IA</li>
                                <li>Generar mapa mental</li>
                                <li>Calendario personal</li>
                            </ul>
                            <button type="button" @click="irAPago(3)" class="btn btn-lg btn-block btn-success">Elegir Premium</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>


    <!-- <div class="container my-5">
        <div class="row">

            <div class="col-md-4 mb-3">
                <div class="card text-center h-100">
                    <div class="card-header">
                        <h4 class="my-0 font-weight-normal">Gratuito</h4>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h1 class="card-title pricing-card-title">$0 <small class="text-muted">/ mes</small></h1>
                        <ul class="list-unstyled mt-3 mb-4 flex-grow-1">
                            <li>Registrar nota</li>
                            <li>Crear materia</li>
                            <li>Escribir apunte</li>
                        </ul>
                        <button type="button" class="btn btn-lg btn-block btn-outline-primary mt-auto">Comenzar
                            gratis</button>
                    </div>
                </div>
            </div>


            <div class="col-md-4 mb-3">
                <div class="card text-center h-100 border-primary">
                    <div class="card-header bg-primary text-white">
                        <h4 class="my-0 font-weight-normal">Básico</h4>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h1 class="card-title pricing-card-title">$15 <small class="text-muted">/ mes</small></h1>
                        <ul class="list-unstyled mt-3 mb-4 flex-grow-1">
                            <li>Crear materia</li>
                            <li>Registrar nota</li>
                            <li>Grabar audio</li>
                            <li>Escribir apunte</li>
                            <li>Dibujar</li>
                            <li>Calendario personal</li>
                            <li>Exportar PDF</li>
                            <li>Notificaciones</li>
                        </ul>
                        <button type="button" class="btn btn-lg btn-block btn-primary mt-auto">Elegir Básico</button>
                    </div>
                </div>
            </div>


            <div class="col-md-4 mb-3">
                <div class="card text-center h-100 border-success">
                    <div class="card-header bg-success text-white">
                        <h4 class="my-0 font-weight-normal">Premium</h4>
                    </div>
                    <div class="card-body d-flex flex-column">
                        <h1 class="card-title pricing-card-title">$30 <small class="text-muted">/ mes</small></h1>
                        <ul class="list-unstyled mt-3 mb-4 flex-grow-1">
                            <li>Crear materia</li>
                            <li>Registrar nota</li>
                            <li>Grabar audio</li>
                            <li>Escribir apunte</li>
                            <li>Dibujar</li>
                            <li>Resumen con IA</li>
                            <li>Generar mapa mental</li>
                            <li>Calendario personal</li>
                            <li>Exportar PDF</li>
                            <li>Notificaciones</li>
                        </ul>
                        <button type="button" class="btn btn-lg btn-block btn-success mt-auto">Elegir Premium</button>
                    </div>
                </div>
            </div>
        </div>
    </div> -->




</template>

<script setup>
import { usePlanStore } from '@/stores/plan'
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'

const router = useRouter()
const plan = usePlanStore()

const esPlanG = computed(() => plan.plan === 'Gratuito')
const esPlanB = computed(() => plan.plan === 'Basico')
const esPlanF = computed(() => plan.plan === 'Premium')



const emit = defineEmits(['cerrar'])

onMounted(async () => {
    console.log(plan.caracteristicas);
    console.log(plan.plan === 'Basico');

})

const irAPago = (planId) => {
    router.push({ 
        name: 'paymente', 
        query: { plan: planId } 
    })
}

//poner esto en la view a mostrar
//<Audio @cerrar="mostrarAudio = false" />


</script>
<style>
.button-60 {
    align-items: center;
    appearance: none;
    background-color: #fff;
    border: 1px solid #dbdbdb;
    border-radius: .375em;
    box-shadow: none;
    box-sizing: border-box;
    color: #363636;
    cursor: pointer;
    display: inline-flex;
    font-family: BlinkMacSystemFont, -apple-system, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 1rem;
    height: 2.5em;
    justify-content: center;
    line-height: 1.5;
    padding: calc(.5em - 1px) 1em;
    position: relative;
    text-align: center;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    vertical-align: top;
    white-space: nowrap;
}

.button-60:active {
    border-color: #4a4a4a;
    outline: 0;
}

.button-60:focus {
    border-color: #485fc7;
    outline: 0;
}

.button-60:hover {
    border-color: #b5b5b5;
}

.button-60:focus:not(:active) {
    box-shadow: rgba(72, 95, 199, .25) 0 0 0 .125em;
}
</style>