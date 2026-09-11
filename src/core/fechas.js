// Manejo de fechas. El sistema exige siempre el formato AAAA-MM-DD.

import { limpiar, esVacio } from './texto.js';

/** Fecha centinela que el instructivo usa para "no aplica". */
export const NA_FECHA = '1845-01-01';

const DIA = 86400000;

const esBisiesto = a => (a % 4 === 0 && a % 100 !== 0) || a % 400 === 0;

function fechaValida(a, m, d) {
  if (m < 1 || m > 12 || d < 1) return false;
  const dias = [31, esBisiesto(a) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return d <= dias[m - 1];
}

export function iso(a, m, d) {
  return `${String(a).padStart(4, '0')}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

/**
 * Lleva cualquier representacion razonable de fecha a AAAA-MM-DD.
 * Acepta ISO, dd/mm/aaaa, dd-mm-aaaa, aaaa/mm/dd, aaaammdd, ddmmaaaa,
 * fechas con hora y el numero de serie de Excel.
 * Devuelve null si el texto no es una fecha interpretable.
 */
/**
 * Decide el orden de una fecha con barras a partir de la evidencia del archivo.
 *
 * `13/02/2026` solo puede ser dia/mes. `02/13/2026` solo puede ser mes/dia.
 * Cuando los dos numeros son <= 12 la fecha es ambigua y hay que decidir por el
 * resto del archivo: `orden` lleva lo que se dedujo en `detectarOrdenFechas`.
 */
const ORDEN_POR_DEFECTO = 'dmy';

/**
 * Recorre textos de fecha y deduce si el archivo viene en dia/mes o mes/dia.
 *
 * Solo cuenta la evidencia inequivoca: un primer numero > 12 prueba dia/mes, un
 * segundo numero > 12 prueba mes/dia. Si no hay evidencia, o si hay de las dos
 * clases (archivo inconsistente), se mantiene dia/mes, que es lo que escribe
 * Excel en configuracion regional española.
 *
 * @returns {{orden: 'dmy'|'mdy', dmy: number, mdy: number, conflicto: boolean,
 *            ambiguas: number}}
 */
export function detectarOrdenFechas(textos) {
  let dmy = 0, mdy = 0, ambiguas = 0;
  for (const t of textos) {
    const m = limpiar(t).split(/[T ]/)[0].match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/);
    if (!m) continue;
    const a = +m[1], b = +m[2];
    if (a > 12 && b <= 12) dmy++;
    else if (b > 12 && a <= 12) mdy++;
    else if (a <= 12 && b <= 12) ambiguas++;
  }
  const conflicto = dmy > 0 && mdy > 0;
  return { orden: (!conflicto && mdy > 0) ? 'mdy' : ORDEN_POR_DEFECTO, dmy, mdy, conflicto, ambiguas };
}

export function normalizar(bruto, orden = ORDEN_POR_DEFECTO) {
  const s = limpiar(bruto);
  if (!s || esVacio(s)) return null;

  // Numero de serie de Excel (base 1899-12-30)
  if (/^\d{5}(\.\d+)?$/.test(s)) {
    const n = Math.floor(parseFloat(s));
    if (n > 20000 && n < 80000) {
      const f = new Date(Date.UTC(1899, 11, 30) + n * DIA);
      return iso(f.getUTCFullYear(), f.getUTCMonth() + 1, f.getUTCDate());
    }
  }

  const soloFecha = s.split(/[T ]/)[0];
  let m;

  // AAAA-MM-DD
  if ((m = soloFecha.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})$/))) {
    const [a, me, d] = [+m[1], +m[2], +m[3]];
    return fechaValida(a, me, d) ? iso(a, me, d) : null;
  }

  // DD-MM-AAAA (o MM-DD-AAAA si el archivo demostro venir en ese orden).
  //
  // Cuando uno de los dos numeros pasa de 12 no hay ambiguedad: ese es el dia.
  // Cuando los dos son <= 12 la fecha es ambigua y manda `orden`, que se
  // deduce del resto del archivo. Sin esto, un CSV guardado por un Excel en
  // configuracion regional inglesa (mm/dd/aaaa) intercambiaria dia y mes en
  // silencio en todas las fechas del 1 al 12.
  if ((m = soloFecha.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})$/))) {
    let [d, me, a] = [+m[1], +m[2], +m[3]];
    if (d > 12 && me > 12) return null;
    if (d <= 12 && me > 12) [d, me] = [me, d];
    else if (d <= 12 && me <= 12 && orden === 'mdy') [d, me] = [me, d];
    return fechaValida(a, me, d) ? iso(a, me, d) : null;
  }

  // AAAAMMDD
  if ((m = soloFecha.match(/^(\d{4})(\d{2})(\d{2})$/))) {
    const [a, me, d] = [+m[1], +m[2], +m[3]];
    if (fechaValida(a, me, d)) return iso(a, me, d);
  }

  // DDMMAAAA
  if ((m = soloFecha.match(/^(\d{2})(\d{2})(\d{4})$/))) {
    const [d, me, a] = [+m[1], +m[2], +m[3]];
    if (fechaValida(a, me, d)) return iso(a, me, d);
  }

  return null;
}

const enDias = f => Date.UTC(+f.slice(0, 4), +f.slice(5, 7) - 1, +f.slice(8, 10)) / DIA;

export function sumarDias(f, n) {
  const d = new Date((enDias(f) + n) * DIA);
  return iso(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
}

export const difDias = (a, b) => enDias(a) - enDias(b);

export function hoy() {
  const d = new Date();
  return iso(d.getFullYear(), d.getMonth() + 1, d.getDate());
}
