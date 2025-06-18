<template>

  calendario
  <FullCalendar
    :options="calendarOptions"
  />
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

const eventos = ref([])

const calendarOptions = ref({
  plugins: [dayGridPlugin],
  initialView: 'dayGridMonth',
  locale: 'es', // Opcional, para mostrar en español
  events: eventos,
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,dayGridWeek'
  },
  eventContent: function(arg) {
  return {
    html: `<div style="color: white; background: #10b981; padding: 2px 4px; border-radius: 4px;">
             ${arg.event.title}
           </div>`
    }
  },
  eventClick: function(info) {
  alert(`Evento: ${info.event.title}`)}
})


onMounted( async () => {

  // const a = await calendarioStore.get({userId:userId})
  // console.log(a);

  const data = await calendarioStore.get({ userId })
  eventos.value = data.map(item => ({
    id: item.id,
    title: item.evento,
    start: item.fecha
  }))
  
});


</script>
<style>
/* @import '@fullcalendar/core/main.css'; */
/* @import '@fullcalendar/daygrid/main.css'; */
</style>

