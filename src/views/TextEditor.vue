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



    <!-- <button class="button-60" @click="manejarClick('grabar audio', abrirAudio)">Abrir Audio</button>
    <button class="button-60" @click="manejarClick('Generar Mapa Mental', abrirMermaid)">Abrir Mermaid</button> -->

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
                <div class="btn-group" role="group" aria-label="Exportar opciones">
                    <button type="button" class="btn btn-secondary" disabled>Exportar:</button>
                    <button type="button" class="button-60" @click="exportarPDF">PDF</button>
                    <button type="button" class="button-60" @click="exportarMarkdown">MD</button>
                </div>

            </div>

            <!-- <div class="col">
                <button class="button-60" @click="prueba()"> prueba</button>
            </div> -->
            <div class="col">
                <button v-if="nota.contenido_copia.length > 0" class="button-60" @click="recuperar()">
                    recuperar</button>
            </div>
            <div class="col">
                <button class="button-60"
                    @click="manejarClick('Generar Mapa Mental', () => mostrarMermaid = true)">Abrir mermaid</button>
            </div>

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

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
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





const plan = usePlanStore()
const store = useNotaStore();
const fileStore = useFilesStore();
const nota = store.notaActual
const router = useRouter();
const mostrarAudio = ref(false)
const mostrarMermaid = ref(false)
const editor = ref(null)
const contenidoHtml = ref('')
const showCanvas = ref(false)
let documento = ref();
const originalTitulo = ref(nota.titulo)
const mostrarSuscripcion = ref(false)

//editor
const resumen = ref('');
const fechas = ref([]);
const status = ref('');
const error = ref(null);

let quill

onMounted(async () => {

    console.log(plan.caracteristicas);


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

const insertText = async () => {
    const markdownText = `
 # 📌 Documento de Resumen: Segunda Fase del Proyecto — Herramientas de Localización y Navegación en Centros Comerciales\n\n## 🧭 Contexto General\n\nLa segunda fase del proyecto tiene como objetivo principal implementar las **funcionalidades básicas de localización y navegación** dentro de centros comerciales a través de una herramienta digital interactiva. Esta etapa se enfoca en el desarrollo de componentes esenciales que permitan identificar, ubicar y buscar negocios o productos dentro de un centro comercial. Asimismo, se establecerá la estructura fundamental de la aplicación, la cual servirá como base para etapas posteriores.\n\n## 🛠️ Objetivo de la Herramienta\n\nLa herramienta que se está conceptualizando y desarrollando pretende funcionar como un **mapa interactivo** acompañado de funciones de búsqueda y exploración. Esta permitirá a los usuarios:\n\n- Listar productos disponibles en distintos comercios del centro comercial.\n- Visualizar la ubicación específica de dichos productos o tiendas en un plano interactivo.\n- Consultar información sobre diferentes locales o zonas comerciales.\n\n## 🧩 Componentes Iniciales de la Aplicación\n\nLa aplicación se divide en **tres secciones principales**:\n\n1. **Barra de herramientas o buscador**:\n   - Una interfaz donde los usuarios podrán escribir y buscar productos o nombres de locales.\n   - Botones o íconos interactivos (como una mano o lupa) para facilitar la navegación.\n\n2. **Área de visualización del plano**:\n   - Un espacio central donde se mostrará el **plano del centro comercial**.\n   - En esta área se proyectarán resultados de búsqueda y rutas dentro del espacio comercial.\n\n3. **Panel de herramientas laterales o inferiores**:\n   - Contendrá cinco herramientas o botones clave.\n   - Por ejemplo: una opción para escribir el nombre de un producto, y ver en qué locales está disponible.\n   - También se podrá buscar directamente un local comercial por nombre.\n\n## 🔍 Funcionalidades Básicas Iniciales\n\n- **Búsqueda de productos**: los usuarios podrán introducir el nombre de un producto y ver en qué tiendas del centro comercial se encuentra disponible.\n- **Búsqueda de locales comerciales**: si se conoce el nombre de un local, el sistema mostrará en qué parte exacta del plano se encuentra.\n- **Visualización de ubicación actual**: permitirá mostrar el punto actual donde se encuentra el usuario dentro del centro comercial (funcionalidad futura).\n- **Marcado visual**: los resultados de búsqueda resaltarán visualmente en el mapa (por ejemplo, usando colores como el amarillo).\n\n## 🧪 Fase de Prototipo\n\nDurante esta etapa del desarrollo, no se requiere que todas las funcionalidades estén completamente implementadas. El enfoque está en:\n\n- Construcción de la **maqueta visual** de la herramienta.\n- Colocación inicial de los botones y elementos visuales interactivos.\n- Definición de la estructura de navegación básica sin requerir lógica completa todavía.\n\n## 📍 Observaciones\n\n- Las herramientas pueden ubicarse en la parte inferior o lateral derecha de la pantalla.\n- La aplicación se diseñará para representar claramente la estructura física del centro comercial.\n- El desarrollo se centrará inicialmente en un caso específico, ubicado en la ciudad de Santa Cruz.\n\n---\n\nEste documento describe los fundamentos del sistema de localización comercial que se espera construir en las próximas iteraciones del proyecto, asegurando así una experiencia de usuario fluida y eficiente desde sus primeras versiones.
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

const insertarResumenEnQuill = async (texto) => {
    // const respuesta = await fileStore.resumir(texto);
    // if (!respuesta || !respuesta.markdown) {
    //     console.error("No se pudo obtener un resumen válido");
    //     return;
    // }

    const htmlContent = marked(texto);

    quill.setContents([]); // Esto limpia todo

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    const elements = Array.from(tempDiv.childNodes);
    for (let i = 0; i < elements.length; i++) {
        const el = elements[i];
        if (!el) continue;

        await new Promise(resolve => setTimeout(resolve, 300)); // Opcional: delay entre inserciones
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
        contenido: html,
    }, nota.id)
    console.log('Guardado automático')
}
const intervaloGuardado = setInterval(() => {
    if (quill) guardarNota()
}, 5000)

const prueba = async () => {
    const html = quill.root.innerHTML
    await store.update({ contenido_copia: html }, nota.id)

    const res =
    {
        "data": {
            "fechas": [
                {
                    "fecha": "1966",
                    "titulo": "Inicio de la Revolución Cultural china"
                },
                {
                    "fecha": "1969",
                    "titulo": "Finalización oficial de la Revolución Cultural china"
                }
            ],
            "markdown": "### Resumen\n- La Revolución Cultural china ocurrió entre 1966 y 1969, liderada por Mao Zedong.\n- Mao Zedong recuperó el poder al final del movimiento.\n- La Guardia Roja llevó a cabo persecuciones y destrucción masiva durante la Revolución Cultural."
        },
        "status": 200,
        "statusText": "OK",
        "headers": {
            "content-length": "535",
            "content-type": "application/json"
        },
        "config": {
            "transitional": {
                "silentJSONParsing": true,
                "forcedJSONParsing": true,
                "clarifyTimeoutError": false
            },
            "adapter": [
                "xhr",
                "http",
                "fetch"
            ],
            "transformRequest": [
                null
            ],
            "transformResponse": [
                null
            ],
            "timeout": 0,
            "xsrfCookieName": "XSRF-TOKEN",
            "xsrfHeaderName": "X-XSRF-TOKEN",
            "maxContentLength": -1,
            "maxBodyLength": -1,
            "env": {},
            "headers": {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/json"
            },
            "baseURL": "http://localhost:5000",
            "method": "post",
            "url": "/resumir-chatgpt",
            "data": "{\"texto\":\"<h2>¿Qué fue la Revolución Cultural china?</h2><p>La Revolución Cultural china&nbsp;<strong>fue un movimiento sociopolítico ocurrido entre 1966 y 1969</strong>&nbsp;e iniciado por Mao Zedong, líder del Partido Comunista de China (PCCh). Fue consecuencia de la lucha interna entre los líderes del partido que gobernaba el país. También es conocida con el nombre “Gran Revolución Cultural Proletaria”.</p><p>En 1966, Mao hizo un llamado general a la juventud militante y organizó una persecución en contra de sus enemigos políticos, que lo habían apartado del poder. Este movimiento multitudinario conformó grupos paramilitares que llevaron a cabo masacres violentas y causaron la muerte de cientos de miles de personas.</p><p>La lógica de la Revolución Cultural&nbsp;<strong>estuvo conducida por el fuerte culto a la personalidad de Mao Zedong</strong>, su identificación personal con el comunismo nacional, la represión de las disidencias políticas y la purga de los líderes del PCCh que se oponían a Mao.</p><p>La Revolución Cultural china&nbsp;<strong>terminó cuando Mao recuperó el poder</strong>. Sin embargo, a su muerte, todas las personas implicadas en ella fueron juzgadas y condenadas por las masacres perpetradas.</p><h4>Puntos clave</h4><ul><li>La Revolución Cultural china fue liderada por Mao Zedong y surgió por las luchas de poder internas del Partido Comunista de China.</li><li>Para recuperar su poder, Mao se alió con la Guardia Roja e inició una persecución política que llevó a la violencia y la destrucción masiva.</li><li>La Revolución Cultural china devastó las élites chinas, destruyó gran parte del patrimonio de la cultura tradicional y asesinó y torturó a más de cientos de miles de personas.</li><li>El proceso se inició en 1966 y finalizó de manera oficial en 1969. Sin embargo, Mao perdió el control de la Guardia Roja y la violencia perduró por varios años más.</li></ul><h2>¿Qué pasó en la Revolución Cultural china?</h2><p>Los militantes maoístas predicaban en contra de la cultura tradicional china.</p><p>Desde la Revolución China de 1949, Mao había liderado el gobierno chino con cierto éxito. Sin embargo, en los últimos años, sus políticas económicas (conocidas como “Gran Salto Adelante”) habían llevado a una profunda crisis y a una gran hambruna.</p><p>En ese contexto,<strong>&nbsp;Mao fue obligado por la cúpula del partido a relegar el mando y ocupar un rol secundario de liderazgo</strong>. Para recuperar el poder, Mao formó una alianza con otros miembros del PCCh: Zhang Chunqiao, Yao Wenyuan y Wang Hongwen (a la que más tarde se conoció como “Banda de los Cuatro”), y juntos organizaron la Revolución Cultural.</p><p>Mao hizo un llamado a la juventud militante (la mayoría estudiantes de escuelas secundarias y universidades) a conformar unidades en la llamada “Guardia Roja”. Millones de jóvenes se adhirieron.</p><p>La Guardia Roja se ocupó de la persecución de todos los que fueran acusados de detractores. Además, se le encargó la destrucción de “los cuatro viejos”, que eran los cuatro pilares de la sociedad tradicional china: las costumbres, la cultura, los hábitos y las ideas antiguas. Con ese pretexto, los guardias rojos llevaron a cabo la destrucción de museos, templos, santuarios y gran parte del patrimonio histórico chino.</p><p><strong>Los guardias rojos fueron responsables de la muerte de cientos de miles de personas en China</strong>. Durante el “agosto rojo” en Pekín, fueron asesinadas casi 2.000 personas y decenas de miles de casas fueron saqueadas o destruidas. Se estima que hubo entre 100.000 y 150.000 muertos en la masacre de Guangxi, casi 20.000 en la Purga de Mongolia Interior, cerca de 5.000 en la masacre de Guangdong, 17.000 en Yunnan y más de 7.000 en Daoxian. Estas cifras representan solo algunas de las matanzas más terribles del periodo.</p>\"}",
            "allowAbsoluteUrls": true
        },
        "request": {}
    };

    // const resp =  await fileStore.resumir(nota.contenido);
    console.log(res.data.markdown);
    await insertarResumenEnQuill(res.data.markdown)
}

const recuperar = async () => {
    console.log(nota.contenido_copia);
    await insertarResumenEnQuill(nota.contenido_copia);
}

const exportarPDF = () => {
    if (!editor.value) return

    const contenido = editor.value

    const opciones = {
        margin: 10,
        filename: 'mi-apunte.pdf',
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
