// Lectura del reporte de errores que devuelve la plataforma.
//
// Cuando el sistema rechaza un cargue entrega un CSV con una linea por error.
// Cruzarlo con el archivo corregido permite ver, error por error, si ya quedo
// resuelto o si todavia hay algo que atender, sin tener que buscar a mano.
//
// Columnas observadas en el reporte real:
//   nit, tipo_archivo, nombre_archivo, fecha_etl, fecha_de_cargue,
//   identificador, mensaje, campo
//
// `identificador` es el numero de fila del archivo contando el encabezado, que
// es la misma numeracion que usa el corrector.

import { leerCSV } from './archivo.js';
import { POR_KEY, CAMPOS } from './esquema.js';
import { canon, limpiar } from './texto.js';

const PORCOL = Object.fromEntries(CAMPOS.map(c => [canon(c.col), c]));

/** Localiza la columna cuyo nombre coincide con alguno de los candidatos. */
function columna(registro, candidatos) {
  const claves = Object.keys(registro);
  for (const cand of candidatos) {
    const hallada = claves.find(k => canon(k) === canon(cand));
    if (hallada) return hallada;
  }
  return null;
}

/**
 * Interpreta el CSV de errores de la plataforma.
 * @returns {{errores: array, aviso: string|null}}
 */
export function leerReporteErrores(texto) {
  const registros = leerCSV(texto);
  if (!registros.length) {
    return { errores: [], aviso: 'El reporte no tiene filas.' };
  }

  const cFila = columna(registros[0], ['identificador', 'fila', 'registro', 'linea']);
  const cCampo = columna(registros[0], ['campo', 'columna', 'variable']);
  const cMensaje = columna(registros[0], ['mensaje', 'error', 'descripcion', 'observacion']);

  if (!cMensaje) {
    return {
      errores: [],
      aviso: 'No reconozco este archivo como un reporte de errores: no encuentro la columna del mensaje.',
    };
  }

  const errores = registros.map(r => {
    const campoBruto = limpiar(r[cCampo] ?? '');
    const campo = PORCOL[canon(campoBruto)] ?? null;
    return {
      fila: Number(String(r[cFila] ?? '').replace(/\D/g, '')) || null,
      campoBruto,
      campo,                                  // definicion del esquema, si existe
      mensaje: limpiar(r[cMensaje] ?? ''),
    };
  }).filter(e => e.mensaje);

  const aviso = cFila ? null
    : 'El reporte no trae numero de fila, asi que los errores no se pueden ubicar en un registro concreto.';

  return { errores, aviso };
}

/**
 * Otros campos que menciona el mensaje de error.
 *
 * Muchas reglas de la plataforma son condicionales ("el campo X debe estar
 * diligenciado cuando Y es SI"), asi que el error aparece sobre X pero la
 * causa esta en Y. Se buscan los nombres de columna oficiales que aparecen
 * literalmente en el texto del mensaje.
 */
function camposCitados(mensaje, propio) {
  // Los mensajes de la plataforma nombran el otro campo de dos maneras:
  //   - con el nombre exacto de la columna ("fum debe ser menor a la fpp")
  //   - en palabras ("cuando el tipo de caso este diligenciado entre 1 y 12")
  // Hay que reconocer las dos. La forma en palabras se busca sobre el texto
  // normalizado, y solo con nombres largos, porque uno corto apareceria por
  // casualidad dentro de cualquier frase. La forma exacta se busca como palabra
  // suelta, y asi entran tambien los nombres cortos que mas se citan: fum, fpp.
  const t = canon(mensaje);
  const citados = [];
  for (const c of CAMPOS) {
    if (canon(c.col) === canon(propio)) continue;
    const enPalabras = c.col.length >= 8 && t.includes(canon(c.col));
    const exacto = new RegExp(`(^|[^a-z0-9_])${c.col}([^a-z0-9_]|$)`, 'i').test(mensaje);
    if (enPalabras || exacto) citados.push(c);
  }
  return citados;
}

/**
 * Cruza los errores con el archivo ya corregido.
 *
 * Importante: esto **no verifica** el archivo contra las reglas de la
 * plataforma, porque esas reglas no estan publicadas. Lo que hace es contrastar
 * cada error con lo que el corrector ve hoy en esa celda:
 *
 *   - `pendiente`   el corrector tambien señala esa celda: sigue abierto.
 *   - `dependiente` la celda esta limpia, pero el mensaje habla de otro campo
 *                   que si quedo pendiente en esa misma fila. No se puede dar
 *                   por resuelto hasta que se decida ese otro campo.
 *   - `corregido`   ni la celda ni los campos que cita el mensaje tienen nada
 *                   pendiente. Lo mas probable es que ya este resuelto, pero
 *                   solo la plataforma decide.
 */
export function cruzar(errores, filas, pendientes) {
  const pendientePorCelda = new Set(
    pendientes.map(p => `${p.fila}|${canon(p.campo)}`));

  return errores.map(e => {
    const registro = e.fila ? filas[e.fila - 2] : null;
    const valor = registro && e.campo ? (registro[e.campo.key] ?? '') : null;
    const sigue = e.fila && e.campoBruto
      && pendientePorCelda.has(`${e.fila}|${canon(e.campoBruto)}`);

    // El nombre del archivo no es una columna del reporte, pero el corrector
    // lo genera con la estructura que exige el instructivo, asi que un error
    // sobre el nombre queda resuelto al descargar de nuevo.
    const esNombreArchivo = canon(e.campoBruto) === canon('nombre_archivo');

    // Causa aguas arriba: el mensaje cita otro campo que sigue pendiente.
    const depende = (!sigue && e.fila)
      ? camposCitados(e.mensaje, e.campoBruto)
          .filter(c => pendientePorCelda.has(`${e.fila}|${canon(c.col)}`))
      : [];

    return {
      ...e,
      valorActual: valor,
      esNombreArchivo,
      depende: depende.map(c => c.nombre),
      estado: sigue ? 'pendiente'
        : depende.length ? 'dependiente'
        : (e.campo || esNombreArchivo) ? 'corregido'
        : 'desconocido',
    };
  });
}

/**
 * Detecta si la plataforma rechazo celdas por llevar enye.
 *
 * El corrector conserva la enye porque es parte del apellido. Pero si el
 * reporte trae un error de tipo "solo letras" (o "caracteres no validos")
 * justo sobre una celda que hoy tiene enye, la plataforma la esta rechazando y
 * toca sustituirla por N. Se pide la evidencia del propio sistema en vez de
 * suponerlo, que es lo que pidio el usuario.
 *
 * @returns {{detectada: boolean, filas: number[], campos: string[]}}
 */
const MENSAJE_ALFABETICO =
  /(solo|unicamente)\s+letras|caracter(es)?\s+(no\s+)?(valido|permitido|especial)/i;

export function detectarEnyeRechazada(cruzados) {
  const afectados = cruzados.filter(c =>
    MENSAJE_ALFABETICO.test(c.mensaje) && /ñ/i.test(String(c.valorActual ?? '')));

  return {
    detectada: afectados.length > 0,
    filas: [...new Set(afectados.map(c => c.fila).filter(Boolean))].sort((a, b) => a - b),
    campos: [...new Set(afectados.map(c => c.campo?.nombre ?? c.campoBruto))],
  };
}

/** Cifras para el resumen del cruce. */
export function resumirCruce(cruzados) {
  const cuenta = estado => cruzados.filter(c => c.estado === estado).length;
  return {
    total: cruzados.length,
    corregidos: cuenta('corregido'),
    pendientes: cuenta('pendiente'),
    dependientes: cuenta('dependiente'),
    desconocidos: cuenta('desconocido'),
    campos: new Set(cruzados.map(c => c.campoBruto).filter(Boolean)).size,
    filas: new Set(cruzados.map(c => c.fila).filter(Boolean)).size,
  };
}

/** Agrupa por mensaje para ver de un vistazo qué es lo que más se repite. */
export function agruparPorMensaje(cruzados) {
  const mapa = new Map();
  for (const c of cruzados) {
    const clave = `${c.campoBruto}||${c.mensaje}`;
    if (!mapa.has(clave)) {
      mapa.set(clave, {
        campoBruto: c.campoBruto,
        campo: c.campo,
        esNombreArchivo: c.esNombreArchivo,
        mensaje: c.mensaje,
        veces: 0,
        filas: [],
        pendientes: 0,
        dependientes: 0,
        depende: [],
      });
    }
    const g = mapa.get(clave);
    g.veces++;
    if (c.fila) g.filas.push(c.fila);
    if (c.estado === 'pendiente') g.pendientes++;
    if (c.estado === 'dependiente') {
      g.dependientes++;
      for (const n of c.depende) if (!g.depende.includes(n)) g.depende.push(n);
    }
  }
  return [...mapa.values()].sort((a, b) => b.veces - a.veces);
}
