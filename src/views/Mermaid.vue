<template>
  <!-- <div class="mermaid-preview p-3">
    <button class="button-60" @click="$emit('cerrar')">Cerrar</button>
    <button class="button-60" @click="generarMermaid" :disabled="usandoIA">Generar</button>
    <div v-if="notaActual.mermaid === '' " class="preview" v-html="convertedHtml" ref="preview" />
    <div v-else> Aun no generado el mapa mental</div>
  </div> -->

  <div class="mermaid-preview p-3">
    <button class="button-60" @click="$emit('cerrar')">Cerrar</button>
    <button class="button-60" @click="generarMermaid" :disabled="usandoIA || !contenidoSuficiente">Generar</button>

    <div v-if="!contenidoSuficiente" class="alert alert-warning mt-2">
      Se necesita más información (mínimo {{ MIN_PALABRAS }} palabras) para generar un mapa mental.
    </div>

    <div v-else-if="notaActual.mermaid && notaActual.mermaid.trim() !== ''" class="preview" v-html="convertedHtml"
      ref="preview" />

    <div v-else class="mt-2 text-muted">Aún no generado el mapa mental</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useNotaStore } from '../stores/nota.js';
import { useFilesStore } from '@/stores/files.js';


import showdown from 'showdown'
import mermaid from 'mermaid'


const fileStore = useFilesStore();
const notaStore = useNotaStore();
const notaActual = notaStore.notaActual
const usandoIA = ref(false)
const MIN_PALABRAS = 30

const contarPalabras = (texto) => {
  return texto.trim().split(/\s+/).length
}

const contenidoSuficiente = computed(() => {
  if (!notaActual.contenido) return false
  return contarPalabras(notaActual.contenido) >= MIN_PALABRAS
})
showdown.extension('mermaid', function () {
  return [{
    type: 'lang',
    regex: /```mermaid([\s\S]+?)```/g,
    replace: function (_, code) {
      return `<div class="mermaid">${code.trim()}</div>`
    }
  }]
})


const markdown = ref('')

const converter = new showdown.Converter({
  extensions: ['mermaid'],
  ghCodeBlocks: true,
  tables: true,
  emoji: true,
  simpleLineBreaks: true
})

const convertedHtml = computed(() => converter.makeHtml(markdown.value))

const preview = ref(null)

watch(convertedHtml, async () => {
  await nextTick()
  if (preview.value) {
    mermaid.initialize({ startOnLoad: false })
    mermaid.run(undefined, preview.value)
  }
})

onMounted(async () => {
  if (notaActual.mermaid && notaActual.mermaid.trim() !== '') {
    markdown.value = notaActual.mermaid
  }

  await nextTick()
  if (preview.value && markdown.value.trim() !== '') {
    mermaid.initialize({ startOnLoad: false })
    mermaid.run(undefined, preview.value)
  }
})

const generarMermaid = async () => {
  usandoIA.value = true
  try {
    const nota = notaActual.contenido
    const dato = await fileStore.mapaMental(nota);

    markdown.value = `\`\`\`${dato.data.mermaid}\n\`\`\``
    console.log(markdown.value);

    await notaStore.update({
      mermaid: markdown.value
    }, notaActual.id)

  } catch (error) {
    console.log(error);
  }
  usandoIA.value = false
}

</script>

<style scoped>
.mermaid-preview {
  border: 1px solid #ccc;
  border-radius: 8px;
  max-width: 100%;
  overflow-x: auto;
  background-color: #fff;
}

button {
  margin-bottom: 12px;
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
</style>
