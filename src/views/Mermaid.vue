<template>
  <div class="mermaid-preview p-3">
    <button class="button-60" @click="$emit('cerrar')">Cerrar</button>
    <button class="button-60" @click="generarMermaid">Generar</button>
    <div v-if="notaActual.mermaid === '' " class="preview" v-html="convertedHtml" ref="preview" />
    <div v-else> Aun no generado el mapa mental</div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useNotaStore } from '../stores/nota.js';

import showdown from 'showdown'
import mermaid from 'mermaid'

const notaStore = useNotaStore();
const notaActual = notaStore.notaActual



showdown.extension('mermaid', function () {
  return [{
    type: 'lang',
    regex: /```mermaid([\s\S]+?)```/g,
    replace: function (_, code) {
      return `<div class="mermaid">${code.trim()}</div>`
    }
  }]
})

const text = {
  "mermaid": "mermaid\nmindmap\n  root((Revolución Francesa))\n    Causas\n      Insatisfacción con la monarquía\n      Desigualdad social\n      Crisis económicas\n    Eventos clave\n      Toma de la Bastilla\n      Declaración de los Derechos del Hombre ::icon(fa fa-book)\n      Reinado del Terror\n      Ejecución de Luis XVI y María Antonieta\n      Ascenso de Napoleón Bonaparte\n    Consecuencias\n      Creación de la República\n      Abolición de la monarquía absoluta\n      Difusión de ideas: Libertad, Igualdad, Fraternidad\n      Consolidación del poder burgués\n    Influencia\n      Inspiración a movimientos revolucionarios en Europa y América\n      Punto de inflexión histórico"
}


const markdown = ref(`
\`\`\`mermaid
mindmap
  root((mindmap))
    Origins
      Long history
      ::icon(fa fa-book)
      Popularisation
        British popular psychology author Tony Buzan
    Research
      On effectiveness<br/>and features
      On Automatic creation
        Uses
            Creative techniques
            Strategic planning
            Argument mapping
    Tools
      Pen and paper
      Mermaid
\`\`\`
`)

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

// También al montarse por primera vez
onMounted(async () => {
  await nextTick()
  if (preview.value) {
    mermaid.initialize({ startOnLoad: false })
    mermaid.run(undefined, preview.value)
  }
})

const generarMermaid = () => {
  console.log('genrado');
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
  font-family: BlinkMacSystemFont,-apple-system,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
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
