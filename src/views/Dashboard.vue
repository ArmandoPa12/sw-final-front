
<template>
  <div>
    <nav>
      <div class="">
        <header
          class="d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom">
          <div class="col-md-3 mb-2 mb-md-0 d-flex flex-wrap align-items-center">
            <a href="/" class="d-inline-flex link-body-emphasis text-decoration-none">
              <img src="/public/machine-vision-svgrepo-com.svg" width="70" height="50" alt="Logo" />
            </a>
            <small>{{ auth.user?.usuario }}</small>
          </div>
          <div class="col-md-3 text-end">
            <button type="button" @click="logout" class="btn btn-outline-primary me-2">Log-out</button>
          </div>         
        </header>
      </div>
    </nav>
    <RouterView />

    <div class="row">
      <div class="col">
        <Documentos  v-if="router.currentRoute._value.path === '/dashboard'" />
      </div>
      <div class="col">
        <div class="m-5 max-w-[700px]">
          <Calendar v-if="router.currentRoute._value.path === '/dashboard'" />
        </div>

      </div>
    </div>




  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Documentos from './Documentos.vue'
import Calendar from './Calendar.vue'


const router = useRouter()
const auth = useAuthStore()

const logout = () => {
  auth.logout()
  router.push('/login')
}
</script>

<style>
/* Reducir padding interno */
.fc {
  font-size: 0.75rem; /* Tamaño de fuente más pequeño */
  max-width: 700px; /* Limita el ancho */
  margin: auto;
}

.fc-toolbar {
  padding: 0.25rem 0;
}

.fc-daygrid-day {
  padding: 0 !important;
}

.fc-daygrid-event {
  font-size: 0.65rem;
  padding: 1px 2px;
  border-radius: 4px;
}

.fc-scrollgrid {
  border-radius: 8px;
  overflow: hidden;
}
</style>