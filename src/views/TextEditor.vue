<template>
    <div v-if="mostrarAudio" class="modal-overlay">
        <div class="modal-popup">
            <Audio @cerrar="cerrarAudio" @insertar-transcripcion="transcripcionAudio" />
        </div>
    </div>

    <div v-if="mostrarMermaid" class="modal-overlay">
        <div class="modal-popup">
            <Mermaid @cerrar="cerrarMermaid" />
        </div>
    </div>

    <div v-if="mostrarSuscripcion" class="modal-overlay">
        <div class="modal-popup">
            <Suscriber @cerrar="cerrarSuscripcion" />
        </div>
    </div>

    <div class="container mt-4">
        <div class="row">
            <div class="col">
                <button type="button" @click="goBack" class="button-60">
                    atras</button>
            </div>
            <div class="col-3">
                <input type="text" class="form-control" v-model="originalTitulo">
            </div>
            <div class="col">
                <button class="button-60" @click="manejarClick('grabar audio', () => mostrarAudio = true)">Abrir
                    Audio</button>
            </div>
            <div class="col">
                <button type="button" class="button-60" @click="manejarClick('exportar_pdf', exportarPDF)">PDF</button>
                <button type="button" class="button-60"
                    @click="manejarClick('exportar_pdf', exportarMarkdown)">MD</button>


            </div>

            <div class="col">
                <button type="button" class="button-60" @click="manejarClick('Generar Mapa Mental',insertarResumenEnQuill)" :disabled="usandoIA">Resumir con
                    IA</button>
            </div>

            <div class="col">
                <button class="button-60"
                    @click="manejarClick('Generar Mapa Mental', () => mostrarMermaid = true)">Mapa Mental</button>
            </div>

        </div>
        <div class="row">
            <div class="editor-container">
                <div ref="editor" class="quill-editor"></div>


                <DrawingCanvas v-if="showCanvas" class="drawing-canvas" @done="insertarImagenDibujo"
                    @cancel="() => showCanvas.value = false" />
            </div>
        </div>
    </div>

</template>

<script setup>
import { onMounted, onUnmounted, computed, ref } from 'vue'
import html2pdf from 'html2pdf.js'
import TurndownService from 'turndown'
import DrawingCanvas from './CanvasDrawer.vue'
import { marked } from 'marked';
import { useNotaStore } from '../stores/nota.js';
import { usePlanStore } from '@/stores/plan'
import { useFilesStore } from '@/stores/files.js';
import { useRoute, useRouter } from 'vue-router'
import Audio from '@/views/Audios.vue'
import Mermaid from './Mermaid.vue';
import Suscriber from './Suscriber.vue';
import { useCalendarioStore } from '@/stores/calendar';
import { useAuthStore } from '@/stores/auth';







const plan = usePlanStore()
const store = useNotaStore();
const calendarioStore = useCalendarioStore();
const fileStore = useFilesStore();
const nota = store.notaActual
const router = useRouter();
const authStore = useAuthStore();
const userId = authStore.user.id;
const mostrarAudio = ref(false)
const mostrarMermaid = ref(false)
const editor = ref(null)
const contenidoHtml = ref('')
const showCanvas = ref(false)
let documento = ref();
const originalTitulo = ref(nota.titulo)
const mostrarSuscripcion = ref(false)
const usandoIA = ref(false)


let quill

onMounted(async () => {

    // console.log(plan.caracteristicas);


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
    // button.onclick = () => showCanvas.value = true
    button.onclick = () => {
        manejarClick('dibujar', () => {
            showCanvas.value = true
        })
    }

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

const transcripcionAudio = (nuevoTexto) => {
    const contenidoActual = quill.root.innerHTML.trim();

    let nuevoContenido;

    if (contenidoActual) {
        nuevoContenido = contenidoActual + '<br><br>' + nuevoTexto;
    } else {
        nuevoContenido = nuevoTexto;
    }
    quill.clipboard.dangerouslyPasteHTML(nuevoContenido);
};

const insertarResumenEnQuill = async () => {

    const contenidoActual = quill.root.innerHTML.trim();
    usandoIA.value = true
    let nuevoContenido;

    try {

        const nuevoTexto = await fileStore.resumir(contenidoActual);
        console.log(nuevoTexto.data);

        if (!nuevoTexto.data || !nuevoTexto.data.markdown) {
            console.error("No se pudo obtener un resumen válido");
            return;
        }

        if (contenidoActual) {
            nuevoContenido = contenidoActual + '<br><br>' + marked(nuevoTexto.data.markdown);
        } else {
            nuevoContenido = nuevoTexto.data.markdown;
        }
        quill.clipboard.dangerouslyPasteHTML(nuevoContenido);

        if (nuevoTexto.data.fechas && Array.isArray(nuevoTexto.data.fechas)) {
            for (const item of nuevoTexto.data.fechas) {
                try {
                    const datos = {
                        fecha: item.fecha,
                        evento: item.titulo,
                        usuarioId: userId
                    };
                    await calendarioStore.create(datos);
                } catch (e) {
                    console.error(`Error al agregar evento: ${item.titulo}`, e);
                }
            }
        }

        } catch (error) {
            console.log(error);
        }

        usandoIA.value = false
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
            contenido: html,
        }, nota.id)
        console.log('Guardado automático')
    }
    const intervaloGuardado = setInterval(() => {
        if (quill) guardarNota()
    }, 5000)


    const exportarPDF = () => {
        if (!editor.value) return

        const contenido = editor.value

        const opciones = {
            margin: 10,
            filename: nota.titulo + '.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        }

        html2pdf().from(contenido).set(opciones).save()
    }

    const exportarMarkdown = () => {
        const html = quill.root.innerHTML
        const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
        const url = URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = url
        link.download = nota.titulo + '.html'
        link.click()

        URL.revokeObjectURL(url)
    }

    const manejarClick = (nombreCaracteristica, accionPermitida) => {
        if (plan.tieneCaracteristica(nombreCaracteristica)) {
            accionPermitida()
        } else {
            mostrarSuscripcion.value = true
        }
    }

    const cerrarAudio = () => {
        mostrarAudio.value = false;

    }
    const cerrarSuscripcion = () => {
        mostrarSuscripcion.value = false;

    }
    const cerrarMermaid = () => {
        mostrarMermaid.value = false;
    }

</script>


<style scoped>
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
