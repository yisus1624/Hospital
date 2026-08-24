// Edicion de campos ya corregidos.
//
// Cuando la plataforma rechaza un dato hay que poder corregirlo sin abrir el
// archivo en Excel, que reescribiria las fechas y lo estropearia. Al cambiar un
// valor se vuelve a corregir unicamente esa fila, con los mismos criterios que
// el resto del archivo, y se refrescan los reportes.

import { corregirFila, OPCIONES } from '../core/corrector.js';
import { CAMPOS, COLUMNAS, POR_KEY } from '../core/esquema.js';
import { canon } from '../core/texto.js';

const $ = id => document.getElementById(id);

/** Busca un campo por su nombre de columna o por su nombre legible. */
export function buscarCampo(texto) {
  const t = canon(texto);
  if (!t) return null;
  return CAMPOS.find(c => canon(c.col) === t)
      ?? CAMPOS.find(c => canon(c.nombre) === t)
      ?? CAMPOS.find(c => canon(c.col).includes(t) || canon(c.nombre).includes(t))
      ?? null;
}

/** Resume en una linea lo que el instructivo exige para ese campo. */
export function reglasDe(campo) {
  const partes = [campo.col];
  if (campo.tipo === 'F') partes.push('fecha AAAA-MM-DD');
  if (campo.vals) partes.push(`valores: ${campo.vals.join(', ')}`);
  if (campo.x?.min !== undefined || campo.x?.max !== undefined) {
    partes.push(`entre ${campo.x.min ?? '-'} y ${campo.x.max ?? '-'}`);
  }
  partes.push(campo.req === 'SI' ? 'obligatorio'
    : campo.req === 'COND' ? 'obligatorio segun otro campo'
    : 'opcional');
  return partes.join(' · ');
}

/**
 * Conecta el editor con la interfaz.
 *
 * @param {object} api
 * @param {() => object} api.estado      devuelve el estado actual
 * @param {() => void}   api.refrescar   repinta cifras y tablas
 * @param {(s:string) => string} api.escapar
 */
export function iniciarEditor({ estado: obtenerEstado, refrescar, escapar }) {

  /**
   * Aplica un valor a una celda y recorrige la fila.
   * @returns {{ok: boolean, mensaje: string}}
   */
  function editarCampo(nFila, columna, valor) {
    const estado = obtenerEstado();
    const i = nFila - 2;                    // las filas cuentan el encabezado
    if (!estado || !estado.brutas?.[i]) {
      return { ok: false, mensaje: `No existe la fila ${nFila} en este archivo.` };
    }

    estado.brutas[i][columna] = valor;
    // Se respetan las opciones vigentes (por ejemplo, si ya se activo el
    // reemplazo de la enye) para que editar una celda no lo deshaga.
    const r = corregirFila(estado.brutas[i], nFila, { ...OPCIONES, ...estado.opciones });
    estado.filas[i] = r.fila;

    // Se sustituyen los registros de esa fila, conservando el orden.
    const ordenar = xs => xs.sort((a, b) => a.fila - b.fila);
    estado.cambios = ordenar(estado.cambios.filter(c => c.fila !== nFila).concat(r.cambios));
    estado.pendientes = ordenar(estado.pendientes.filter(p => p.fila !== nFila).concat(r.pendientes));

    estado.resumen = {
      registros: estado.filas.length,
      correcciones: estado.cambios.length,
      pendientes: estado.pendientes.length,
      filasConPendientes: new Set(estado.pendientes.map(p => p.fila)).size,
    };

    refrescar();

    const campo = CAMPOS.find(c => c.col === columna);
    const quedo = r.fila[campo.key];
    const sigue = r.pendientes.find(p => p.campo === columna);

    if (sigue) return { ok: false, mensaje: `Sigue sin resolverse: ${sigue.motivo}` };
    return { ok: true, mensaje: `Guardado. La fila ${nFila} quedo con "${quedo || '(vacio)'}".` };
  }

  // --- edicion directa desde la tabla de campos por completar --------------

  document.addEventListener('change', e => {
    const input = e.target.closest('.editar-pendiente');
    if (!input) return;

    const celda = input.closest('td');
    const r = editarCampo(Number(input.dataset.fila), input.dataset.columna, input.value);

    // La tabla se repinta al corregir, asi que el aviso se muestra aparte.
    const salida = $('resultadoEdicion');
    salida.textContent = r.mensaje;
    salida.className = 'resultado-edicion ' + (r.ok ? 'bien' : 'mal');
    salida.hidden = false;
    if (celda) celda.classList.toggle('editado', r.ok);
  });

  // --- buscador de cualquier campo ----------------------------------------

  $('toggleEditor').addEventListener('click', () => {
    const btn = $('toggleEditor');
    const abierto = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!abierto));
    $('cuerpoEditor').hidden = abierto;

    if (!abierto && !$('listaCampos').children.length) {
      $('listaCampos').innerHTML = COLUMNAS.map(c => `<option value="${escapar(c)}">`).join('');
    }
  });

  let enEdicion = null;

  $('btnBuscar').addEventListener('click', () => {
    const estado = obtenerEstado();
    const error = $('errorBusqueda');
    const panel = $('resultadoBusqueda');

    const fallar = msg => {
      error.textContent = msg;
      error.hidden = false;
      panel.hidden = true;
    };

    if (!estado) return fallar('Primero corrige un archivo.');

    const nFila = Number($('buscarFila').value.replace(/\D/g, ''));
    if (!nFila || !estado.brutas[nFila - 2]) {
      return fallar(`No existe la fila ${nFila || '(vacia)'}. Van de 2 a ${estado.filas.length + 1}.`);
    }

    const campo = buscarCampo($('buscarCampo').value);
    if (!campo) return fallar(`No encuentro ningun campo que se llame "${$('buscarCampo').value}".`);

    error.hidden = true;
    enEdicion = { nFila, campo };

    $('fichaNombre').textContent = `Fila ${nFila} · ${campo.nombre}`;
    $('fichaReglas').textContent = reglasDe(campo);
    $('fichaInput').value = estado.filas[nFila - 2][campo.key] ?? '';
    $('resultadoEdicion').hidden = true;
    panel.hidden = false;
    $('fichaInput').focus();
  });

  $('btnAplicar').addEventListener('click', () => {
    if (!enEdicion) return;
    const { nFila, campo } = enEdicion;
    const r = editarCampo(nFila, campo.col, $('fichaInput').value);

    const salida = $('resultadoEdicion');
    salida.textContent = r.mensaje;
    salida.className = 'resultado-edicion ' + (r.ok ? 'bien' : 'mal');
    salida.hidden = false;

    // Se muestra el valor tal como quedo tras normalizarlo.
    $('fichaInput').value = obtenerEstado().filas[nFila - 2][campo.key] ?? '';
  });

  $('fichaInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); $('btnAplicar').click(); }
  });

  $('buscarCampo').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); $('btnBuscar').click(); }
  });
  $('buscarFila').addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); $('btnBuscar').click(); }
  });

  return { editarCampo };
}
