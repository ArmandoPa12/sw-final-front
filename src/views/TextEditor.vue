<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import DrawingCanvas from './CanvasDrawer.vue'
import { marked } from 'marked';
import { useNotaStore } from '../stores/nota.js';
import { useRoute, useRouter } from 'vue-router'
import  Audio from '@/views/Audios.vue'



const store = useNotaStore();
const nota = store.notaActual
const router = useRouter();
const mostrarAudio = ref(false)
const editor = ref(null)
const contenidoHtml = ref('')
const showCanvas = ref(false)
let documento = ref();
const originalTitulo = ref(nota.titulo) 

let quill

onMounted(async () => {
    if (!window.Quill) {
        await cargarScript('https://cdn.quilljs.com/1.3.6/quill.min.js')
        await cargarEstilos('https://cdn.quilljs.com/1.3.6/quill.snow.css')
    }

    quill = new Quill(editor.value, {
        modules: {
            toolbar: {
                container: [
                    ['bold', 'italic', 'image', 'underline', 'strike'],
                    ['blockquote', 'code-block'],
                    [{ header: 1 }, { header: 2 }],
                    [{ list: 'ordered' }, { list: 'bullet' }],
                    [{ script: 'sub' }, { script: 'super' }],
                    [{ indent: '-1' }, { indent: '+1' }],
                    [{ direction: 'rtl' }],
                    [{ size: ['small', false, 'large', 'huge'] }],
                    [{ header: [1, 2, 3, 4, 5, 6, false] }],
                    [{ color: [] }, { background: [] }],
                    [{ font: [] }],
                    [{ align: [] }],
                    ['clean'],
                    [{ custom: 'draw' }]
                ],
                handlers: {
                    draw: () => {
                        showCanvas.value = true
                    }
                }
            }
        },
        theme: 'snow'
    })

    const button = document.createElement('button')
    button.innerHTML = `<img src="./draw-svgrepo-com.svg" alt="Dibujo" style="width: 20px; height: 20px;" />`
    button.title = 'Insertar dibujo'
    button.onclick = () => showCanvas.value = true
    const customGroup = document.createElement('span')
    customGroup.classList.add('ql-formats')
    customGroup.appendChild(button)
    editor.value.previousSibling.appendChild(customGroup)



    documento.value = await store.getUno({ notaId: nota.id })
    console.log(documento.value);

    if (documento.value?.contenido) {
        quill.clipboard.dangerouslyPasteHTML(0, documento.value.contenido)
    }

})

onUnmounted(() => {
    clearInterval(intervaloGuardado)
    // guardarTituloAutomatico()
})

const insertText = async () => {
    const markdownText = `
  # Resumen de las Guerras del Opio

Las Guerras del Opio, también conocidas como las guerras anglo-chinas, fueron dos conflictos bélicos ocurridos en el siglo XIX entre el Imperio Chino y el Imperio Británico. Estas guerras se libraron principalmente por intereses comerciales, relacionados con el contrabando de opio. La primera guerra tuvo lugar entre 1839 y 1842, mientras que la segunda se extendió desde 1856 hasta 1860, con la intervención de Francia aliada con los británicos.

## **Causas de las Guerras del Opio**
Las principales causas de estas guerras fueron los intereses comerciales británicos y la resistencia china al comercio del opio:

- **Comercio de opio**: Durante el siglo XVIII, el Reino Unido enfrentaba un gran déficit comercial con China debido a la alta demanda de productos chinos como el té, la seda y la porcelana, pero con baja demanda de productos británicos. Para contrarrestar este desequilibrio, Gran Bretaña comenzó a exportar opio ilegalmente a China desde la India, donde la Compañía Británica de las Indias Orientales tenía el monopolio de este comercio.
- **Prohibición del opio**: En 1829, el emperador Daoguang de China prohibió la venta y consumo de opio debido a los graves problemas de adicción entre la población.

## **Desarrollo de las Guerras**
### **Primera Guerra del Opio (1839-1842)**
La primera guerra fue un enfrentamiento directo entre el Imperio Británico y el Imperio Chino debido a la negativa de China a permitir el comercio de opio. La guerra culminó con la derrota de China, lo que obligó al gobierno chino a tolerar el comercio del opio y a abrir varios puertos al comercio exterior.

### **Segunda Guerra del Opio (1856-1860)**
La segunda guerra comenzó con la intervención de Francia, que se unió a Gran Bretaña en la lucha contra China. Durante este conflicto, se firmaron varios tratados que favorecían a las potencias extranjeras y daban como resultado la cesión de territorios y la apertura de puertos chinos al comercio exterior.

## **Consecuencias**
Las derrotas chinas en ambas guerras llevaron a la firma de los **Tratados Desiguales**, que resultaron en:

- **Apertura de puertos**: Varios puertos chinos fueron abiertos al comercio con potencias extranjeras.
- **Cesión de Hong Kong**: Hong Kong fue cedido al Reino Unido como parte de los acuerdos del **Tratado de Nankín**.
- **Rebeliones**: Las Guerras del Opio contribuyeron a la inestabilidad interna de China, lo que dio lugar a eventos como la **Rebelión Taiping** (1850-1864) y la **Rebelión de los Bóxers** (1899-1901).
 
 `;

    const htmlContent = marked(markdownText);
    const range = quill.getSelection();
    const insertAt = range ? range.index : quill.getLength();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    const elements = Array.from(tempDiv.childNodes);
    for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        await new Promise(resolve => setTimeout(resolve, 500));
        quill.clipboard.dangerouslyPasteHTML(quill.getLength(), el.outerHTML || el.textContent);
    }
};


const insertarImagenDibujo = async (dataUrl) => {
    const range = quill.getSelection(true)
    quill.insertEmbed(range.index, 'image', dataUrl)
    showCanvas.value = false
}

function cargarScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = resolve
        document.head.appendChild(script)
    })
}

function cargarEstilos(href) {
    return new Promise((resolve) => {
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = href
        link.onload = resolve
        document.head.appendChild(link)
    })
}

const goBack = () => {
    router.back();
}

const guardarNota = async () => {
    const html = quill.root.innerHTML
    const a = await store.update({
        titulo: originalTitulo.value,
        contenido: html
    }, nota.id)
    console.log('Guardado automático')
}
const intervaloGuardado = setInterval(() => {
    if (quill) guardarNota()
}, 5000)   

// const guardarTituloAutomatico = async () => {
//     await store.update({ titulo: originalTitulo.value }, nota.id)
// }

</script>

<template>
     <div v-if="mostrarAudio" class="modal-overlay">
    <div class="modal-popup">
      <Audio @cerrar="mostrarAudio = false" />
    </div>
  </div>
    <div class="container mt-4">
        <div class="row">
            <div class="col-1">
                <button type="button" @click="goBack" class="btn btn-primary me-2"><</button>
            </div>
            <div class="col-2">
                <input type="text" class="form-control" v-model="originalTitulo">
            </div>
            <div class="col-2">
                <button @click="mostrarAudio = true">Abrir Audio</button>
            </div>
            <div class="col-2">parte 2</div>

        </div>
        <div class="row">
            <div class="editor-container">
                <div ref="editor" class="quill-editor"></div>

                <button @click="() => console.log(quill.root.innerHTML)">Ver contenido HTML</button>
                <button @click="insertText">Insertar texto Delta</button>

                <DrawingCanvas v-if="showCanvas" class="drawing-canvas" @done="insertarImagenDibujo"
                    @cancel="() => showCanvas.value = false" />
            </div>
        </div>
    </div>

</template>

    <!-- <div class="editor-container">
        <div ref="editor" class="quill-editor"></div>

        <button @click="() => console.log(quill.root.innerHTML)">Ver contenido HTML</button>
        <button @click="insertText">Insertar texto Delta</button>

        <DrawingCanvas v-if="showCanvas" class="drawing-canvas" @done="insertarImagenDibujo"
            @cancel="() => showCanvas.value = false" />
    </div> -->

<style scoped>

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5); /* fondo semitransparente */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.modal-popup {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
  z-index: 1000;
}


.editor-container {
    max-width: 800px;
    margin: auto;
    padding: 20px;
}

.quill-editor {
    height: 600px;
}

.drawing-canvas {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    /* Fondo oscuro semi-transparente */
    z-index: 9999;
    /* Asegúrate de que se sobreponga al editor */
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>