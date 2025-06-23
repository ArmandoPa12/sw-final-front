<template>

  calendario
  <div v-if="modalCrear" class="modal-overlay">
    <div class="modal-popup">

      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Agregar fecha</h5>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="textInput" class="form-label">Evento</label>
              <input type="text" v-model="evento" id="textInput" class="input-estandarizado" placeholder="Examen, recodatorio">
            </div>

            <div class="mb-3">
              <label for="dateInput" class="form-label">Fecha</label>
              <input type="date" v-model="fecha" id="dateInput" class="input-estandarizado">
            </div>


          </div>
          <div class="modal-footer p-2">
            <button type="button" @click="crearEvento" class="btn btn-primary m-2">Guardar fecha</button>
            <button type="button" class="btn btn-secondary m-2" @click="modalCrear = false">Cerrar</button>
          </div>
        </div>
      </div>

    </div>
  </div>


  <button class="btn btn-outline-primary me-2" @click="modalCrear = true">+</button>
  <FullCalendar :options="calendarOptions" />
</template>
<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useCalendarioStore } from '@/stores/calendar';
import { useAuthStore } from '@/stores/auth';
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'


const calendarioStore = useCalendarioStore();
const authStore = useAuthStore();
const userId = authStore.user.id;
const fecha = ref('')
const evento = ref('')

const eventos = ref([])
const modalCrear = ref(false)

const calendarOptions = ref({
  plugins: [dayGridPlugin],
  initialView: 'dayGridMonth',
  locale: 'es', 
  events: eventos,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,dayGridWeek'
  },
  eventContent: function (arg) {
    return {
      html: `<div style="color: white; background: #10b981; padding: 2px 4px; border-radius: 4px;">
             ${arg.event.title}
           </div>`
    }
  },
  eventClick: function (info) {
    alert(`Evento: ${info.event.title}`)
  }
})


onMounted(async () => {
  await obtenerDatos();
});

const obtenerDatos = async () => {
  const data = await calendarioStore.get({ userId })
  eventos.value = data.map(item => ({
    id: item.id,
    title: item.evento,
    start: item.fecha
  }))
}


const crearEvento = async () => {

    if (!fecha.value || !evento.value.trim()) {
        alert('Por favor completa la fecha y el nombre del evento.')
        return
    }

    try {
        const datos = {
            fecha: fecha.value + ' 00:00:00.000', 
            evento: evento.value,
            usuarioId: userId
        }

        await calendarioStore.create(datos)
        fecha.value = ''
        evento.value = ''
        await obtenerDatos();
        modalCrear.value = false
    } catch (e) {
        console.error('Error al crear evento:', e)
    }
}



</script>
<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  /* fondo semitransparente */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-popup {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  width: 900px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  z-index: 1000;
}

.input-estandarizado {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 6px;
  background-color: #fff;
  color: #212529;
  font-size: 1rem;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-estandarizado:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
  outline: none;
}

.input-estandarizado::placeholder {
  color: #6c757d;
}
</style>
