// Interfaz de SIRA. Toda la logica de negocio vive en src/core.
//
// El flujo guiado (cargar, validar, descargar) ocurre dentro del asistente
// modal. El detalle de correcciones y pendientes se muestra en la pagina,
// donde las tablas tienen espacio para leerse.

import {
  leerCSV, mapearColumnas, aCSV, tablaACSV,
  nombreArchivo, componerNombre, validarNombre,
} from '../core/archivo.js';
import { procesar } from '../core/corrector.js';
import { iniciarEditor } from './editor.js';
import { iniciarErrores } from './errores.js';

const $ = id => document.getElementById(id);
const espera = ms => new Promise(r => setTimeout(r, ms));

/** Estado del ultimo archivo procesado. Se descarta al cargar otro. */
let estado = null;

// ---------------------------------------------------------------------------
// Asistente: navegacion entre los tres pasos
// ---------------------------------------------------------------------------

const ORDEN = ['carga', 'procesando', 'listo'];

const LEYENDAS = {
  carga: 'Paso #1 · Selecciona el archivo CSV del reporte de Seguimiento Materno',
  procesando: 'Paso #2 · Revisando cada campo contra las reglas del instructivo',
  listo: 'Paso #3 · Revisa el nombre y descarga el archivo corregido',
};

const asistente = $('asistente');

function irA(paso) {
  document.querySelectorAll('.vista').forEach(v => {
    v.hidden = v.dataset.vista !== paso;
  });

  const actual = ORDEN.indexOf(paso);
  document.querySelectorAll('#stepper li').forEach(li => {
    const i = ORDEN.indexOf(li.dataset.paso);
    li.classList.toggle('hecho', i < actual);
    li.classList.toggle('activo', i === actual);
  });

  $('leyendaPaso').textContent = LEYENDAS[paso];

  // El pie cambia segun el paso.
  const enListo = paso === 'listo';
  $('btnAtras').hidden = !enListo;
  $('btnVerDetalle').hidden = !enListo;
  $('btnDescargar').hidden = !enListo;
  // Durante el procesamiento no se puede cerrar por accidente.
  $('btnCerrar').hidden = paso === 'procesando';

  asistente.dataset.paso = paso;
}

/**
 * Bloquea el desplazamiento del fondo mientras haya un dialogo abierto.
 *
 * Se vigila el atributo `open` en lugar de escuchar los eventos open/close:
 * hay navegadores donde el evento `close` de <dialog> no llega, y la pagina
 * quedaba sin poder desplazarse despues de cerrar el asistente.
 */
function sincronizarScroll() {
  const hayDialogo = document.querySelector('dialog[open]') !== null;
  document.body.classList.toggle('modal-abierto', hayDialogo);
}

const vigilante = new MutationObserver(sincronizarScroll);
for (const d of document.querySelectorAll('dialog')) {
  vigilante.observe(d, { attributes: true, attributeFilter: ['open'] });
}

function abrirAsistente(paso = 'carga') {
  if (!asistente.open) asistente.showModal();
  sincronizarScroll();
  irA(paso);
}

function cerrarAsistente() {
  asistente.close();
  sincronizarScroll();
}

/**
 * Descarta el resultado anterior y deja la pantalla como al principio.
 * Se llama siempre que se va a cargar un archivo nuevo, para que no quede
 * a la vista informacion de la gestante anterior.
 */
function reiniciar() {
  estado = null;
  $('archivo').value = '';
  $('error').hidden = true;

  // Vaciar el detalle de la pagina
  $('detalle').hidden = true;
  $('bienvenida').hidden = false;
  $('avisos').innerHTML = '';
  $('cintaNombre').textContent = '—';
  $('cintaTitulo').textContent = 'Archivo corregido';
  for (const id of ['mRegistros', 'mCorregidos', 'mPendientes', 'pPendientes', 'pCambios']) {
    $(id).textContent = '0';
  }
  $('tarjetaPendientes').className = 'metrica';
  $('tablaPendientes').outerHTML = '<table id="tablaPendientes"></table>';
  $('tablaCambios').outerHTML = '<table id="tablaCambios"></table>';
  $('textoPendientes').textContent = '';

  // Vaciar el asistente
  $('resumenExito').textContent = '';
  $('chipsResumen').innerHTML = '';
  $('nombreFinal').textContent = '—';
  $('avisoPendientes').hidden = true;
  $('pistaSemana').hidden = true;
  $('errorNombre').hidden = true;
  $('btnRestaurar').hidden = true;
  for (const input of Object.values(CAMPOS_NOMBRE)) {
    input.value = '';
    input.classList.remove('malo');
  }

  // Vaciar el cruce con el reporte de la plataforma
  $('resultadoErrores').hidden = true;
  $('avisoErrores').hidden = true;
  $('avisoEnye').hidden = true;
  $('notaCarga').hidden = true;
  $('archivoErrores').value = '';

  // Reiniciar el indicador de progreso
  document.querySelectorAll('.pasos li').forEach(li => li.classList.remove('activo', 'hecho'));
  $('barraRelleno').style.width = '0%';
}

// Empezar de cero descarta tambien el reporte que estuviera en espera.
function empezarDeCero() {
  errores.olvidar();
  reiniciar();
}

$('btnAbrir').addEventListener('click', () => {
  empezarDeCero();
  abrirAsistente('carga');
});

$('btnCerrar').addEventListener('click', cerrarAsistente);
$('btnVerDetalle').addEventListener('click', cerrarAsistente);
$('btnVolverAsistente').addEventListener('click', () => abrirAsistente('listo'));

// "Cargar otro archivo" descarta el resultado actual de inmediato.
$('btnAtras').addEventListener('click', () => {
  empezarDeCero();
  irA('carga');
});

$('btnOtro').addEventListener('click', () => {
  empezarDeCero();
  abrirAsistente('carga');
});

// Impedir que se cierre con Escape mientras procesa.
asistente.addEventListener('cancel', e => {
  if (asistente.dataset.paso === 'procesando') e.preventDefault();
});

// ---------------------------------------------------------------------------
// Ayuda
// ---------------------------------------------------------------------------

$('btnAyuda').addEventListener('click', () => $('dlgAyuda').showModal());
$('btnCerrarAyuda').addEventListener('click', () => $('dlgAyuda').close());
$('dlgAyuda').addEventListener('click', e => {
  if (e.target === $('dlgAyuda')) $('dlgAyuda').close();
});

// ---------------------------------------------------------------------------
// Carga del archivo
// ---------------------------------------------------------------------------

const zona = $('zonaCarga');
const inputArchivo = $('archivo');

zona.addEventListener('click', () => inputArchivo.click());
zona.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); inputArchivo.click(); }
});
inputArchivo.addEventListener('change', e => {
  if (e.target.files[0]) cargar(e.target.files[0]);
});

for (const ev of ['dragenter', 'dragover']) {
  zona.addEventListener(ev, e => { e.preventDefault(); zona.classList.add('encima'); });
}
for (const ev of ['dragleave', 'drop']) {
  zona.addEventListener(ev, e => { e.preventDefault(); zona.classList.remove('encima'); });
}
zona.addEventListener('drop', e => {
  const f = e.dataTransfer.files[0];
  if (f) cargar(f);
});

/**
 * Lee el archivo como texto probando UTF-8 y, si aparecen caracteres de
 * reemplazo, reintentando con Windows-1252 (habitual en exportaciones de Excel).
 */
async function leerTexto(file) {
  const buffer = await file.arrayBuffer();
  const utf8 = new TextDecoder('utf-8').decode(buffer);
  if (!utf8.includes('�')) return utf8;
  try {
    return new TextDecoder('windows-1252').decode(buffer);
  } catch {
    return utf8;
  }
}

// ---------------------------------------------------------------------------
// Indicador de progreso
// ---------------------------------------------------------------------------

const PASOS = ['leer', 'columnas', 'validar', 'corregir', 'nombre'];

/**
 * Marca un paso como activo y los anteriores como completados.
 * El trabajo real es casi instantaneo; la pausa existe para que el avance
 * se pueda seguir con la vista en lugar de parpadear.
 */
async function marcarPaso(indice, pausa = 260) {
  PASOS.forEach((nombre, i) => {
    const li = document.querySelector(`.pasos li[data-paso="${nombre}"]`);
    li.classList.toggle('hecho', i < indice);
    li.classList.toggle('activo', i === indice);
  });
  $('barraRelleno').style.width = `${(indice / PASOS.length) * 100}%`;
  await espera(pausa);
}

function completarPasos() {
  document.querySelectorAll('.pasos li').forEach(li => {
    li.classList.remove('activo');
    li.classList.add('hecho');
  });
  $('barraRelleno').style.width = '100%';
}

// ---------------------------------------------------------------------------
// Proceso
// ---------------------------------------------------------------------------

async function cargar(file) {
  $('error').hidden = true;
  $('nombreOrigen').textContent = file.name;
  $('tituloProceso').textContent = 'Revisando tu archivo…';
  irA('procesando');

  try {
    await marcarPaso(0);
    if (!/\.(csv|txt)$/i.test(file.name)) {
      throw new Error(
        `El archivo "${file.name}" no es CSV. Si tienes un Excel, ábrelo y usa ` +
        `Archivo → Guardar como → CSV UTF-8 (delimitado por comas).`);
    }
    const texto = await leerTexto(file);

    await marcarPaso(1);
    const registros = leerCSV(texto);
    if (!registros.length) throw new Error('El archivo no tiene registros debajo del encabezado.');
    const { filas: brutas, aviso } = mapearColumnas(registros);

    await marcarPaso(2, 340);
    await marcarPaso(3, 340);
    const resultado = procesar(brutas);

    await marcarPaso(4);
    const { partes, avisos, sugerencia } = nombreArchivo(resultado.filas);

    completarPasos();
    $('tituloProceso').textContent = 'Listo';
    await espera(420);

    estado = {
      ...resultado,
      brutas,
      opciones: {},
      partes: { ...partes },
      sugeridas: { ...partes },
      sugerencia,
      avisos: [aviso, ...avisos].filter(Boolean),
      origen: file.name,
    };

    pintar();
    irA('listo');

    // Si el reporte de errores se entrego primero, se cruza ahora mismo y se
    // lleva a la usuaria directo al resultado, sin pasar por "Ver detalle".
    if (await errores.reintentar()) {
      cerrarAsistente();
      $('bloqueErrores').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

  } catch (err) {
    $('error').innerHTML =
      `<strong>No se pudo procesar el archivo</strong>${escapar(err.message)}`;
    $('error').hidden = false;
    irA('carga');
  }
}

// ---------------------------------------------------------------------------
// Pintado
// ---------------------------------------------------------------------------

const escapar = s => String(s ?? '').replace(/[&<>"]/g,
  c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/** Muestra un valor, distinguiendo visualmente la celda vacia. */
function celda(v, clase = '') {
  return v === '' || v == null
    ? '<span class="valor-mono vacio">(vacío)</span>'
    : `<span class="valor-mono ${clase}">${escapar(v)}</span>`;
}

function pintar() {
  const { resumen, cambios, pendientes, avisos } = estado;

  // --- dentro del asistente ---
  $('resumenExito').textContent = pendientes.length
    ? `Se aplicaron ${resumen.correcciones} correcciones sobre ${resumen.registros} gestantes.`
    : `Se aplicaron ${resumen.correcciones} correcciones sobre ${resumen.registros} gestantes. No quedó nada pendiente.`;

  $('chipsResumen').innerHTML = [
    `<span class="chip"><b>${resumen.registros}</b> gestantes</span>`,
    `<span class="chip buena"><b>${resumen.correcciones}</b> correcciones</span>`,
    pendientes.length
      ? `<span class="chip atencion"><b>${pendientes.length}</b> sin completar</span>`
      : `<span class="chip buena">Sin pendientes</span>`,
  ].join('');

  // Explicacion de los campos que no se pueden corregir automaticamente.
  $('avisoPendientes').hidden = pendientes.length === 0;
  if (pendientes.length) {
    const filas = resumen.filasConPendientes;
    $('avisoPendientesTitulo').textContent =
      `${pendientes.length} campos de ${filas} ${filas === 1 ? 'gestante' : 'gestantes'} necesitan que los completes tú`;
  }

  // --- en la pagina ---
  $('avisos').innerHTML = avisos
    .map(a => `<div class="tarjeta alerta aviso">${escapar(a)}</div>`).join('');

  $('mRegistros').textContent = resumen.registros;
  $('mCorregidos').textContent = resumen.correcciones;
  $('mPendientes').textContent = resumen.pendientes;
  $('tarjetaPendientes').className = 'metrica ' + (resumen.pendientes ? 'atencion' : 'limpia');

  $('pCambios').textContent = cambios.length;
  $('pPendientes').textContent = pendientes.length;

  $('cintaTitulo').textContent = pendientes.length
    ? `Archivo corregido · ${pendientes.length} campos por revisar`
    : 'Archivo corregido y sin pendientes';

  $('textoPendientes').textContent = pendientes.length
    ? `Estos datos no están en el archivo o se contradicen, y no se pueden deducir sin inventarlos. Corrígelos en tu archivo original (la columna "Fila" te dice en cuál gestante) y vuelve a pasarlo por aquí.`
    : 'No quedó nada pendiente.';

  pintarEditorNombre();
  paginas.pendientes.pagina = 1;
  paginas.cambios.pagina = 1;
  pintarPendientes();
  pintarCambios();

  $('bienvenida').hidden = true;
  $('detalle').hidden = false;
}

/* --------------------------------------------------------------------------
 * Tablas paginadas
 *
 * Un archivo grande puede dejar decenas de miles de filas. Volcarlas todas en
 * el DOM bloquea la pestaña, asi que se dibuja solo la pagina visible.
 * ------------------------------------------------------------------------ */

const paginas = {
  pendientes: { pagina: 1, tamano: 30 },
  cambios: { pagina: 1, tamano: 30 },
};

/** Etiqueta que distingue si el dato falta, es incoherente o no se entiende. */
const ETIQUETA_TIPO = {
  falta: ['falta', 'Falta el dato'],
  incoherente: ['incoherente', 'No concuerda'],
  invalido: ['invalido', 'No se entiende'],
};

function pintarPendientes() {
  const datos = estado?.pendientes ?? [];
  const t = $('tablaPendientes');

  if (!datos.length) {
    t.outerHTML = `<div class="vacio-tabla" id="tablaPendientes">
      <strong>Todo quedó resuelto</strong>
      El archivo no requiere intervención manual.</div>`;
    $('pagPendientes').hidden = true;
    return;
  }

  const { desde, hasta } = recorte('pendientes', datos.length);

  t.outerHTML = `<table id="tablaPendientes">
    <thead><tr>
      <th>Fila</th><th>Campo</th><th>Qué pasa</th><th>Corrige aquí</th><th>Qué debes hacer</th>
    </tr></thead>
    <tbody>${datos.slice(desde, hasta).map(p => {
      const [clase, texto] = ETIQUETA_TIPO[p.tipo] ?? ETIQUETA_TIPO.incoherente;
      return `<tr>
        <td class="col-fila">${p.fila}</td>
        <td class="col-campo">${escapar(p.nombre)}<small>${escapar(p.campo)}</small></td>
        <td><span class="marca-tipo ${clase}">${texto}</span></td>
        <td><input class="editar-pendiente" value="${escapar(p.valor)}"
             data-fila="${p.fila}" data-columna="${escapar(p.campo)}"
             spellcheck="false" aria-label="Corregir ${escapar(p.nombre)}"></td>
        <td>${escapar(p.motivo)}</td>
      </tr>`;
    }).join('')}</tbody></table>`;

  pintarControles('pendientes', datos.length, desde, hasta);
}

function pintarCambios() {
  const datos = estado?.cambios ?? [];
  const t = $('tablaCambios');

  if (!datos.length) {
    t.outerHTML = `<div class="vacio-tabla" id="tablaCambios">
      <strong>Sin cambios</strong>
      El archivo ya cumplía el formato.</div>`;
    $('pagCambios').hidden = true;
    return;
  }

  const { desde, hasta } = recorte('cambios', datos.length);

  t.outerHTML = `<table id="tablaCambios">
    <thead><tr>
      <th>Fila</th><th>Campo</th><th>Antes</th><th>Después</th><th>Motivo</th>
    </tr></thead>
    <tbody>${datos.slice(desde, hasta).map(c => `<tr>
      <td class="col-fila">${c.fila}</td>
      <td class="col-campo">${escapar(c.nombre)}<small>${escapar(c.campo)}</small></td>
      <td>${celda(c.antes, 'antes')}</td>
      <td>${celda(c.despues, 'despues')}</td>
      <td>${escapar(c.motivo)}</td>
    </tr>`).join('')}</tbody></table>`;

  pintarControles('cambios', datos.length, desde, hasta);
}

/** Calcula el tramo visible, ajustando la pagina si se salio de rango. */
function recorte(tabla, total) {
  const p = paginas[tabla];
  const ultimas = Math.max(1, Math.ceil(total / p.tamano));
  p.pagina = Math.min(Math.max(1, p.pagina), ultimas);
  const desde = (p.pagina - 1) * p.tamano;
  return { desde, hasta: Math.min(desde + p.tamano, total), ultimas };
}

function pintarControles(tabla, total, desde, hasta) {
  const p = paginas[tabla];
  const ultimas = Math.max(1, Math.ceil(total / p.tamano));
  const sufijo = tabla === 'pendientes' ? 'Pendientes' : 'Cambios';

  $('pag' + sufijo).hidden = total === 0;
  $('rango' + sufijo).textContent = `${desde + 1} a ${hasta} de ${total}`;
  $('indice' + sufijo).textContent = `Página ${p.pagina} de ${ultimas}`;

  for (const btn of document.querySelectorAll(`[data-tabla="${tabla}"][data-ir]`)) {
    btn.disabled = btn.dataset.ir === 'anterior' ? p.pagina === 1 : p.pagina === ultimas;
  }
}

const repintar = tabla => (tabla === 'pendientes' ? pintarPendientes() : pintarCambios());

document.querySelectorAll('.selector-tamano').forEach(sel => {
  sel.addEventListener('change', () => {
    const tabla = sel.dataset.tabla;
    paginas[tabla].tamano = Number(sel.value);
    paginas[tabla].pagina = 1;
    repintar(tabla);
  });
});

document.querySelectorAll('[data-ir]').forEach(btn => {
  btn.addEventListener('click', () => {
    const tabla = btn.dataset.tabla;
    paginas[tabla].pagina += btn.dataset.ir === 'siguiente' ? 1 : -1;
    repintar(tabla);
    btn.closest('div[id^="panel"]').querySelector('.tabla-envoltura').scrollTop = 0;
  });
});

// ---------------------------------------------------------------------------
// Editor del nombre del archivo
// ---------------------------------------------------------------------------

const CAMPOS_NOMBRE = { nit: $('nNit'), anio: $('nAnio'), mes: $('nMes'), semana: $('nSemana') };

function pintarEditorNombre() {
  for (const [clave, input] of Object.entries(CAMPOS_NOMBRE)) {
    input.value = estado.partes[clave];
  }
  refrescarNombre();
}

/** Revalida el nombre y habilita o bloquea la descarga. */
function refrescarNombre() {
  if (!estado) return;

  for (const [clave, input] of Object.entries(CAMPOS_NOMBRE)) {
    estado.partes[clave] = input.value.replace(/\D/g, '');
  }

  const errores = validarNombre(estado.partes);
  const mensajes = Object.values(errores);

  for (const [clave, input] of Object.entries(CAMPOS_NOMBRE)) {
    input.classList.toggle('malo', Boolean(errores[clave]));
  }

  const nombre = componerNombre(estado.partes);
  $('nombreFinal').textContent = nombre;
  $('cintaNombre').textContent = nombre;

  $('errorNombre').textContent = mensajes.join(' ');
  $('errorNombre').hidden = !mensajes.length;
  for (const id of ['btnDescargar', 'btnDescargar2', 'btnDescargar3']) {
    $(id).disabled = mensajes.length > 0;
  }

  const editado = Object.keys(estado.partes)
    .some(k => estado.partes[k] !== estado.sugeridas[k]);
  $('btnRestaurar').hidden = !editado;

  pintarPistaSemana();
}

/**
 * Cuando la semana escrita no coincide con la del calendario epidemiologico
 * correspondiente a la fecha de corte, se ofrece la calculada.
 */
function pintarPistaSemana() {
  const pista = $('pistaSemana');
  const s = estado.sugerencia;

  if (!s || s.semana === estado.partes.semana) {
    pista.hidden = true;
    return;
  }
  pista.innerHTML =
    `Según el calendario epidemiológico, la fecha de corte ${escapar(s.corte)} ` +
    `corresponde a la semana <strong>${escapar(s.semana)}</strong>. ` +
    `<button type="button" id="btnUsarSemana">Usar la semana ${escapar(s.semana)}</button>`;
  pista.hidden = false;

  $('btnUsarSemana').addEventListener('click', () => {
    CAMPOS_NOMBRE.semana.value = s.semana;
    refrescarNombre();
  });
}

for (const input of Object.values(CAMPOS_NOMBRE)) {
  input.addEventListener('input', () => {
    // Solo digitos, para que el nombre no pueda romperse al escribir.
    const limpio = input.value.replace(/\D/g, '');
    if (input.value !== limpio) input.value = limpio;
    refrescarNombre();
  });
  // Al salir del campo se completan los ceros a la izquierda.
  input.addEventListener('blur', () => {
    if (input.value) input.value = input.value.padStart(input.maxLength, '0');
    refrescarNombre();
  });
}

$('btnRestaurar').addEventListener('click', () => {
  estado.partes = { ...estado.sugeridas };
  pintarEditorNombre();
});

// ---------------------------------------------------------------------------
// Pestañas del detalle
// ---------------------------------------------------------------------------

document.querySelectorAll('.pestana').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.pestana').forEach(b => b.classList.remove('activa'));
    btn.classList.add('activa');
    for (const id of ['panelPendientes', 'panelCambios']) {
      $(id).hidden = id !== btn.dataset.panel;
    }
  });
});

// ---------------------------------------------------------------------------
// Descargas
// ---------------------------------------------------------------------------

/** Genera la descarga en memoria; nada se sube a ningun servidor. */
function descargar(contenido, nombre) {
  const blob = new Blob([contenido], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: nombre });
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function descargarCorregido() {
  if (!estado || $('btnDescargar').disabled) return;
  // Sin BOM: el validador del sistema lee el archivo tal cual.
  descargar(aCSV(estado.filas), componerNombre(estado.partes));
}

$('btnDescargar').addEventListener('click', descargarCorregido);
$('btnDescargar2').addEventListener('click', descargarCorregido);
$('btnDescargar3').addEventListener('click', descargarCorregido);

// Los reportes si llevan BOM, para que Excel los abra con los acentos correctos.
const conBOM = t => '﻿' + t;

$('btnCsvCambios').addEventListener('click', () => {
  if (!estado) return;
  descargar(
    conBOM(tablaACSV(
      ['Fila', 'Campo', 'Nombre del campo', 'Antes', 'Despues', 'Motivo'],
      estado.cambios,
      ['fila', 'campo', 'nombre', 'antes', 'despues', 'motivo'],
    )),
    `correcciones_${componerNombre(estado.partes)}`,
  );
});

$('btnCsvPendientes').addEventListener('click', () => {
  if (!estado) return;
  descargar(
    conBOM(tablaACSV(
      ['Fila', 'Campo', 'Nombre del campo', 'Valor actual', 'Que revisar'],
      estado.pendientes,
      ['fila', 'campo', 'nombre', 'valor', 'motivo'],
    )),
    `pendientes_${componerNombre(estado.partes)}`,
  );
});


// ---------------------------------------------------------------------------
// Edicion de campos
// ---------------------------------------------------------------------------

/** Repinta las cifras del resumen sin tocar el editor del nombre. */
function refrescarCifras() {
  const { resumen, pendientes, cambios } = estado;
  $('mRegistros').textContent = resumen.registros;
  $('mCorregidos').textContent = resumen.correcciones;
  $('mPendientes').textContent = resumen.pendientes;
  $('tarjetaPendientes').className = 'metrica ' + (resumen.pendientes ? 'atencion' : 'limpia');
  $('pCambios').textContent = cambios.length;
  $('pPendientes').textContent = pendientes.length;
  $('cintaTitulo').textContent = pendientes.length
    ? `Archivo corregido · ${pendientes.length} campos por completar`
    : 'Archivo corregido y sin pendientes';
  $('textoPendientes').textContent = pendientes.length
    ? 'Estos datos no están en el archivo o se contradicen. Corrígelos aquí mismo: al escribir el valor se revisa de nuevo esa fila y se actualiza el archivo que vas a descargar.'
    : 'No quedó nada pendiente.';
}

iniciarEditor({
  estado: () => estado,
  refrescar: () => { refrescarCifras(); pintarPendientes(); pintarCambios(); },
  escapar,
});

/**
 * Vuelve a corregir el archivo con otras opciones.
 *
 * Se parte de `brutas`, que conserva las ediciones manuales de la ficha, asi
 * que no se pierde nada de lo que la usuaria ya haya escrito.
 */
function reprocesar(opciones) {
  if (!estado) return;
  estado.opciones = { ...estado.opciones, ...opciones };
  estado = { ...estado, ...procesar(estado.brutas, estado.opciones) };
  pintar();
}

const errores = iniciarErrores({
  estado: () => estado,
  leerTexto,
  escapar,
  reprocesar,
  // El reporte llego primero: se pide el archivo SMH sin perder lo ya cargado.
  pedirArchivoBase: nombreReporte => {
    reiniciar();
    $('notaCarga').innerHTML =
      `<strong>Guardé el reporte ${escapar(nombreReporte)}</strong>` +
      'Ahora sube el archivo SMH que la plataforma te rechazó. En cuanto lo ' +
      'corrija, cruzo los dos solo, sin que tengas que volver a buscar nada.';
    $('notaCarga').hidden = false;
    abrirAsistente('carga');
  },
});

// "Empezar por el reporte de errores": la otra puerta de entrada, para quien
// llega desde un rechazo y no desde el archivo.
$('btnAbrirErrores').addEventListener('click', () => $('archivoErrores').click());
