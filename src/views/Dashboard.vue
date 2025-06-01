
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
    <Documentos  v-if="router.currentRoute._value.path === '/dashboard'" />
    <!-- <Proyectos v-if="router.currentRoute._value.path === '/dashboard'" /> -->
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import Documentos from './Documentos.vue'


const router = useRouter()
const auth = useAuthStore()

const logout = () => {
  auth.logout()
  router.push('/login')
}
</script>