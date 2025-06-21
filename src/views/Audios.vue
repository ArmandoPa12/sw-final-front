<template>
  <div class="audio-recorder">
    <div class="mb-2">
      <button class="button-60" @click="startRecording" :disabled="isRecording">Grabar</button>
      <button class="button-60" @click="pauseRecording" :disabled="!isRecording || isPaused">Pausar</button>
      <button class="button-60" @click="resumeRecording" :disabled="!isPaused">Reanudar</button>
      <button class="button-60" @click="stopRecording" :disabled="!isRecording">Detener</button>
      <button class="button-60" v-if="audioUrl" @click="enviarAudio">Enviar Audio</button>

    </div>
    <div v-if="isRecording && !isPaused" class="recording-indicator m-2"></div>

    <audio v-if="audioUrl" :src="audioUrl" controls></audio>
    <button class="button-60" @click="$emit('cerrar')">Cerrar</button>

  </div>

  <!-- <div class="lista-audios">
    <h5>Audios</h5>
    <ul v-if="nota.audios.length > 0">
      <li v-for="audio in nota.audios" :key="audio.id" class="audio-item">
        <div>
          <span><strong>ID:</strong> {{ audio.id }}</span>
          <span v-if="audio.transcripcion"> | <strong>Transcripción:</strong> {{ audio.transcripcion }}</span>
          <button @click="deleteAudio(audio.id)">eliminar</button>

        </div>

        <div v-if="audio.ruta">
          <audio :src="`${backendUrl}${audio.ruta}`" controls />
        </div>
        <div v-else class="no-audio">
          <em>No audio</em>
        </div>
      </li>
    </ul>
    <p v-else>No hay audios registrados.</p>
  </div> -->

  <div v-if="nota.audios?.length > 0" class="accordion" id="accordionExample">
    <div class="accordion-item" v-for="(audio, index) in nota.audios" :key="audio.id">
      <h2 class="accordion-header" :id="`heading-${audio.id}`">
        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
          :data-bs-target="`#collapse-${audio.id}`" aria-expanded="false" :aria-controls="`collapse-${audio.id}`">
          <div class="d-flex align-items-center w-100 justify-content-between">
            <audio v-if="audio.ruta" :src="`${backendUrl}${audio.ruta}`" controls style="width: 70%;"></audio>
            <em v-else class="text-muted">No hay audio</em>
            <!-- <button @click.stop="deleteAudio(audio.id)" class="btn btn-sm btn-danger ms-3">
              Eliminar
            </button> -->

            <button @click.stop="confirmarEliminarAudio(audio.id)" class="btn btn-sm btn-danger ms-3">
              Eliminar
            </button>

          </div>
        </button>
      </h2>

      <div :id="`collapse-${audio.id}`" class="accordion-collapse collapse" :aria-labelledby="`heading-${audio.id}`"
        data-bs-parent="#accordionExample">
        <div class="accordion-body">

          <button @click="transcribir(audio)" :disabled="transcribiendo" class="btn btn-sm btn-light transcribe-btn"
            type="button" title="Transcribir">

            <span v-if="transcribiendo" class="dots">Transcribiendo</span>
            <span v-else>
              <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15 7.49996L17.5 9.99996M7.5 20L19.25 8.24996C19.9404 7.5596 19.9404 6.44032 19.25 5.74996V5.74996C18.5596 5.0596 17.4404 5.05961 16.75 5.74996L5 17.5V20H7.5ZM7.5 20H15.8787C17.0503 20 18 19.0502 18 17.8786V17.8786C18 17.316 17.7765 16.7765 17.3787 16.3786L17 16M4.5 4.99996C6.5 2.99996 10 3.99996 10 5.99996C10 8.5 4 8.5 4 11C4 11.8759 4.53314 12.5256 5.22583 13"
                  stroke="#000000" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </span>

          </button>
          <p>{{ audio.transcripcion || 'No hay transcripción.' }}</p>
        </div>
      </div>



    </div>
  </div>


  <p v-else>No hay audios registrados.</p>


</template>
<script setup>
import { onMounted, ref } from 'vue'
import { useNotaStore } from '../stores/nota.js';
import { useFilesStore } from '@/stores/files.js';



const emit = defineEmits(['cerrar','insertar-transcripcion'])

const mediaRecorder = ref(null)
const audioChunks = ref([])
const audioUrl = ref(null)
const isRecording = ref(false)
const isPaused = ref(false)
const notaStore = useNotaStore();
const fileStore = useFilesStore();
const nota = notaStore.notaActual
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const transcribiendo = ref(false)



onMounted(() => {
  console.log('audio---', nota.audios);
});

const startRecording = async () => {
  audioChunks.value = []
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  mediaRecorder.value = new MediaRecorder(stream)

  mediaRecorder.value.ondataavailable = e => {
    audioChunks.value.push(e.data)
  }

  mediaRecorder.value.onstop = () => {
    const blob = new Blob(audioChunks.value, { type: 'audio/webm' })
    audioUrl.value = URL.createObjectURL(blob)
    // Aquí podrías enviar el `blob` a tu backend si quieres guardarlo.
  }

  mediaRecorder.value.start()
  isRecording.value = true
  isPaused.value = false
}

const transcribir = async (audio) => {
  console.log('trancribir');
  const urlCompleta = `${backendUrl}${audio.ruta}`;
  if (!audio?.ruta || transcribiendo.value) return;
  transcribiendo.value = true;
  try {
    const result = await fileStore.transcribirAudioDesdeUrl(urlCompleta);
    audio.transcripcion = result;
    await fileStore.updateTranscripcin(audio)
    emit('insertar-transcripcion', result);
    
  } catch (e) {
    console.error('Error al transcribir', e);
  } finally {
    transcribiendo.value = false;
  }

}

const pauseRecording = () => {
  mediaRecorder.value.pause()
  isPaused.value = true
}

const resumeRecording = () => {
  mediaRecorder.value.resume()
  isPaused.value = false
}

const stopRecording = () => {
  mediaRecorder.value.stop()
  isRecording.value = false
  isPaused.value = false
}

const enviarAudio = async () => {
  if (!audioChunks.value.length) return;

  const blob = new Blob(audioChunks.value, { type: 'audio/webm' });
  const file = new File([blob], `${Date.now()}.webm`, { type: 'audio/webm' });

  try {
    const res = await fileStore.createAudio({
      notaid: nota.id,
      audioFile: file
    });
    const nuevoAudio = res.audio;
    if (!Array.isArray(nota.audios)) {
      nota.audios = [];
    }
    nota.audios.push(nuevoAudio);

    audioUrl.value = null;
    audioChunks.value = [];
  } catch (err) {
    console.error('Error al enviar el audio:', err);
  }
};

const deleteAudio = async (audioId) => {
  try {
    await fileStore.deleteAudio(nota.id, audioId);
    nota.audios = nota.audios.filter(audio => audio.id !== audioId);
  } catch (e) {
    console.log(e);
  }
}

const confirmarEliminarAudio = async (audioId) => {
  const confirmado = window.confirm('¿Estás seguro de que quieres eliminar este audio? Esta acción no se puede deshacer.');
  if (confirmado) {
    await deleteAudio(audioId);
  }
};



</script>

<style>
.lista-audios {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

/* .transcribe-btn {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 10;
} */
.audio-item {
  margin-bottom: 1rem;
}

.no-audio {
  color: #888;
}

.dots::after {
  content: '';
  display: inline-block;
  width: 1em;
  text-align: left;
  animation: dots 1.5s steps(3, end) infinite;
}

@keyframes dots {
  0% {
    content: '';
  }

  33% {
    content: '.';
  }

  66% {
    content: '..';
  }

  100% {
    content: '...';
  }
}

.recording-indicator {
  width: 16px;
  height: 16px;
  background-color: red;
  border-radius: 50%;
  animation: blink 1s infinite;
  margin-bottom: 0.5rem;
}

@keyframes blink {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}

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

.button-60:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}
</style>