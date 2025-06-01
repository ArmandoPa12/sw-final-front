<template>
    <button class="btn btn-primary" @click="crearNota()">
        Crear elemento
    </button>
    <div class="container">
        <div class="row">
            <div class="col-lg-4" v-for="nota in NotaStore.notas" :key="nota.id">
                <div class="card card-margin">
                    <div class="card-header no-border">
                        <!-- <h5 class="card-title">{{ nota.titulo }}</h5> -->
                    </div>
                    <div class="card-body pt-0">
                        <div class="widget-49">
                            <div class="widget-49-title-wrapper">
                                <div class="widget-49-date-primary">
                                    <span class="widget-49-date-day">{{ moment(nota.createdAt).format('DD') }}</span>
                                    <span class="widget-49-date-month">{{ moment(nota.createdAt).format('MMM') }}</span>
                                </div>
                                <div class="widget-49-meeting-info">
                                    <h3 class="widget-49-pro-title">{{ nota.titulo }}</h3>
                                    <span class="widget-49-pro-title">{{ moment(nota.createdAt).format('hh:mm')
                                        }}</span>

                                </div>
                            </div>
                            <ol class="widget-49-meeting-points">
                                <ul>
                                    <span class="widget-49-meeting-item">{{ preview(nota.contenido) }}</span>

                                </ul>
                            </ol>
                            <div class="widget-49-meeting-action">
                                <button @click="entrar(nota)" class="btn btn-sm btn-flash-border-primary">
                                    Ver nota completa     
                                </button>
                                <!-- <router-link class="btn btn-sm btn-flash-border-primary">
                                    Ver nota completa
                                </router-link> -->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted } from "vue";
import { useNotaStore } from '@/stores/nota';
import { useAuthStore } from '@/stores/auth';

import moment from 'moment'
import 'moment/locale/es'

const router = useRouter();
const NotaStore = useNotaStore();
const auth = useAuthStore();
const route = useRoute()
const idMateria = ref(Number(route.params.id || 0));


onMounted(() => {
    NotaStore.get(idMateria.value);
});


function preview(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    return text.slice(0, 50) + '...';
}

async function crearNota (){
    // console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
    const creado = await NotaStore.create({
        titulo: moment().format('YYYY-MM-DD HH:mm:ss'),
        contenido: '',
        materiaId: idMateria.value
    });
    NotaStore.setNotaActual(creado);
    router.push({
      name: 'editor',
    });
    
}

const entrar = (nota) => {
    NotaStore.setNotaActual(nota);
        router.push({
      name: 'editor',
    });
}

</script>


<style>
.card-margin {
    margin-bottom: 1.875rem;
}

.card {
    border: 0;
    box-shadow: 0px 0px 10px 0px rgba(82, 63, 105, 0.1);
    -webkit-box-shadow: 0px 0px 10px 0px rgba(82, 63, 105, 0.1);
    -moz-box-shadow: 0px 0px 10px 0px rgba(82, 63, 105, 0.1);
    -ms-box-shadow: 0px 0px 10px 0px rgba(82, 63, 105, 0.1);
}

.card {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #ffffff;
    background-clip: border-box;
    border: 1px solid #e6e4e9;
    border-radius: 8px;
}

.card .card-header.no-border {
    border: 0;
}

.card .card-header {
    background: none;
    padding: 0 0.9375rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    min-height: 50px;
}

.card-header:first-child {
    border-radius: calc(8px - 1px) calc(8px - 1px) 0 0;
}

.widget-49 .widget-49-title-wrapper {
    display: flex;
    align-items: center;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-primary {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: #edf1fc;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-primary .widget-49-date-day {
    color: #4e73e5;
    font-weight: 500;
    font-size: 1.5rem;
    line-height: 1;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-primary .widget-49-date-month {
    color: #4e73e5;
    line-height: 1;
    font-size: 1rem;
    text-transform: uppercase;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-secondary {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: #fcfcfd;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-secondary .widget-49-date-day {
    color: #dde1e9;
    font-weight: 500;
    font-size: 1.5rem;
    line-height: 1;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-secondary .widget-49-date-month {
    color: #dde1e9;
    line-height: 1;
    font-size: 1rem;
    text-transform: uppercase;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-success {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: #e8faf8;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-success .widget-49-date-day {
    color: #17d1bd;
    font-weight: 500;
    font-size: 1.5rem;
    line-height: 1;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-success .widget-49-date-month {
    color: #17d1bd;
    line-height: 1;
    font-size: 1rem;
    text-transform: uppercase;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-info {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: #ebf7ff;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-info .widget-49-date-day {
    color: #36afff;
    font-weight: 500;
    font-size: 1.5rem;
    line-height: 1;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-info .widget-49-date-month {
    color: #36afff;
    line-height: 1;
    font-size: 1rem;
    text-transform: uppercase;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-warning {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: floralwhite;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-warning .widget-49-date-day {
    color: #FFC868;
    font-weight: 500;
    font-size: 1.5rem;
    line-height: 1;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-warning .widget-49-date-month {
    color: #FFC868;
    line-height: 1;
    font-size: 1rem;
    text-transform: uppercase;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-danger {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: #feeeef;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-danger .widget-49-date-day {
    color: #F95062;
    font-weight: 500;
    font-size: 1.5rem;
    line-height: 1;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-danger .widget-49-date-month {
    color: #F95062;
    line-height: 1;
    font-size: 1rem;
    text-transform: uppercase;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-light {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: #fefeff;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-light .widget-49-date-day {
    color: #f7f9fa;
    font-weight: 500;
    font-size: 1.5rem;
    line-height: 1;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-light .widget-49-date-month {
    color: #f7f9fa;
    line-height: 1;
    font-size: 1rem;
    text-transform: uppercase;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-dark {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: #ebedee;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-dark .widget-49-date-day {
    color: #394856;
    font-weight: 500;
    font-size: 1.5rem;
    line-height: 1;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-dark .widget-49-date-month {
    color: #394856;
    line-height: 1;
    font-size: 1rem;
    text-transform: uppercase;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-base {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background-color: #f0fafb;
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-base .widget-49-date-day {
    color: #68CBD7;
    font-weight: 500;
    font-size: 1.5rem;
    line-height: 1;
}

.widget-49 .widget-49-title-wrapper .widget-49-date-base .widget-49-date-month {
    color: #68CBD7;
    line-height: 1;
    font-size: 1rem;
    text-transform: uppercase;
}

.widget-49 .widget-49-title-wrapper .widget-49-meeting-info {
    display: flex;
    flex-direction: column;
    margin-left: 1rem;
}

.widget-49 .widget-49-title-wrapper .widget-49-meeting-info .widget-49-pro-title {
    color: #3c4142;
    font-size: 14px;
}

.widget-49 .widget-49-title-wrapper .widget-49-meeting-info .widget-49-meeting-time {
    color: #B1BAC5;
    font-size: 13px;
}

.widget-49 .widget-49-meeting-points {
    font-weight: 400;

    font-size: 13px;
    margin-top: .5rem;
}

.widget-49 .widget-49-meeting-points .widget-49-meeting-item {
    display: list-item;
    list-style: none;
    color: #727686;
}

.widget-49 .widget-49-meeting-points .widget-49-meeting-item span {
    margin-left: .5rem;
}

.widget-49 .widget-49-meeting-action {
    text-align: right;
}

.widget-49 .widget-49-meeting-action a {
    text-transform: uppercase;
}
</style>
