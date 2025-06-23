<template>

  <div class="p-4">
    <button class="btn btn-primary" @click="mostrar = true">
      Crear Clase
    </button>
  </div>

  <div v-if="mostrar" class="modal-backdrop-custom">
    <div class="modal d-block" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">

          <div class="modal-header">
            <h5 class="modal-title">Crear nueva clase</h5>
            <button type="button" class="btn-close" @click="cerrarModal"></button>
          </div>

          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Nombre</label>
              <input v-model="form.nombre" type="text" class="form-control" required />
            </div>

            <div class="mb-3">
              <label class="form-label">Color</label>
              <select v-model="form.color" class="form-select color-select">
                <option v-for="color in colores" :key="color" :value="color"
                  :style="{ backgroundColor: bootstrapColorToHex[color], height: '1rem' }">
                  &nbsp;
                </option>
              </select>
            </div>
            <p class="text-danger" v-if="mensajeError">{{ mensajeError }}</p>
          </div>

          <div class="modal-footer">
            <button class="btn btn-secondary" @click="cerrarModal">Cancelar</button>
            <button class="btn btn-primary" @click="crearElemento">Crear</button>
          </div>

        </div>
      </div>
    </div>
  </div>



  <div class="my-3 p-3 bg-white rounded shadow-sm">
    <h6 class="border-bottom pb-2 mb-0">Clases</h6>

    <div class="d-flex text-muted pt-3" v-for="item in materiaStore.materias">
      <div class="flex-shrink-0 rounded text-white d-flex justify-content-center align-items-center"
        :class="`bg-${item.color}`" style="width: 50px; height: 50px; font-size: 0.75rem;">{{
          generarAbreviacion(item.nombre) }}
      </div>
      <div class="ps-3 pb-3 mb-0 small lh-125 border-bottom w-100">
        <div class="d-flex justify-content-between align-items-center w-100">
          <strong class="text-dark">{{ item.nombre }}</strong>
          <router-link :to="`/notas/${item.id}`">Entrar</router-link>
        </div>
        <p>{{ item.notas?.length || 0 }} notas</p>
        <span class="d-block">{{ formatFecha(item.createdAt) }}</span>
      </div>
    </div>

  </div>


</template>


<script setup>
import { ref, onMounted } from "vue";
import { useMateriaStore } from '@/stores/materia';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router'



import moment from 'moment'
import 'moment/locale/es'
const router = useRouter();

const materiaStore = useMateriaStore();
const auth = useAuthStore();
let mensajeError = ref("");
const mostrar = ref(false)
const userId = auth.user.id;

const form = ref({
  nombre: '',
  color: 'primary',
  usuarioId: userId
})
const colores = [
  'primary', 'secondary', 'success', 'danger',
  'warning', 'info', 'light', 'dark'
]
const bootstrapColorToHex = {
  primary: '#0d6efd',
  secondary: '#6c757d',
  success: '#198754',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#0dcaf0',
  light: '#f8f9fa',
  dark: '#212529'
}


onMounted(() => {
  materiaStore.get(userId);
});



const formatFecha = (fecha) => {
  return moment(fecha).format('LT');
}

function generarAbreviacion(nombre) {
  if (!nombre || typeof nombre !== 'string') return '';
  const palabras = nombre.trim().toUpperCase().split(/\s+/);
  if (palabras.length === 1) {
    return palabras[0].substring(0, 2);
  } else {
    return palabras[0][0] + palabras[1][0];
  }
}

function cerrarModal() {
  mostrar.value = false
  form.value = {
    nombre: '',
    color: 'primary',
    usuarioId: userId
  }
  mensajeError.value = '';
}

async function crearElemento() {
  if (!form.value.nombre.trim()) {
    mensajeError.value = 'El nombre del documento es obligatorio.'
    return
  }

  try {
    const res = await materiaStore.create(form.value);
    console.log(res.id);

    router.push({
      name: 'notas',
      params: {
        id: res.id
      }
    });
  } catch (e) {
    console.log('error', e.response.data.error);
    mensajeError.value = e.response.data.error;
    return
  }
  cerrarModal()
}

</script>

<style>
.modal-backdrop-custom {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1050;
}

.color-select {
  padding: 0;
  height: 2rem;
}

.color-select option {
  color: transparent;
}
</style>
