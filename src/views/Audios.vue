<template>
    <div class="audio-recorder">
        <div class="mb-2">
            <button @click="startRecording" :disabled="isRecording">Grabar</button>
            <button @click="pauseRecording" :disabled="!isRecording || isPaused">Pausar</button>
            <button @click="resumeRecording" :disabled="!isPaused">Reanudar</button>
            <button @click="stopRecording" :disabled="!isRecording">Detener</button>
        </div>
        <div  v-if="isRecording && !isPaused" class="recording-indicator m-2"></div>

        <audio v-if="audioUrl" :src="audioUrl" controls></audio>
    </div>
    <ul class="list-group">
        <li class="list-group-item">
            <p>Audio prueba Cras justo odio </p>
            <button>transcribir</button>
        </li>
        <li class="list-group-item">
            <p>Audio prueba Cras justo odio </p>
            <button>transcribir</button>
        </li>
        <li class="list-group-item">
            <p>Audio prueba Cras justo odio </p>
            <button>transcribir</button>
        </li>
        <li class="list-group-item">
            <p>Audio prueba Cras justo odio </p>
            <button>transcribir</button>
        </li>
        <li class="list-group-item">
            <p>Audio prueba Cras justo odio </p>
            <button>transcribir</button>
        </li>
        <li class="list-group-item">
            <p>Audio prueba Cras justo odio </p>
            <button>transcribir</button>
        </li>
        <li class="list-group-item">
            <p>Audio prueba Cras justo odio </p>
            <button>transcribir</button>
        </li>
        <li class="list-group-item">
            <p>Audio prueba Cras justo odio </p>
            <button>transcribir</button>
        </li>
        <li class="list-group-item">
            <p>Audio prueba Cras justo odio </p>
            <button>transcribir</button>
        </li>
        <li class="list-group-item">
            <p>Audio prueba Cras justo odio </p>
            <button>transcribir</button>
            <button>abrir trnascion</button>
        </li>

    </ul>
    <button @click="$emit('cerrar')">Cerrar</button>

</template>
<script setup>
import { ref } from 'vue'
defineEmits(['cerrar'])
const mediaRecorder = ref(null)
const audioChunks = ref([])
const audioUrl = ref(null)
const isRecording = ref(false)
const isPaused = ref(false)

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
</script>

<style>
.recording-indicator {
  width: 16px;
  height: 16px;
  background-color: red;
  border-radius: 50%;
  animation: blink 1s infinite;
  margin-bottom: 0.5rem;
}

@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0; }
  100% { opacity: 1; }
}

</style>