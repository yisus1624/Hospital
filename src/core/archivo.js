// Lectura y escritura de archivos: CSV, mapeo de columnas y nombre de salida.

import { CAMPOS, COLUMNAS } from './esquema.js';
import { limpiar, canon } from './texto.js';
import { hoy } from './fechas.js';
import { semanaEpidemiologica } from './epidemiologia.js';

// ---------------------------------------------------------------------------
// Lectura
// ---------------------------------------------------------------------------

/**
 * Deduce el separador de columnas a partir del encabezado.
 *
 * Excel exporta con punto y coma cuando la configuracion regional es española,
 * que es lo habitual aqui, y hay quien guarda el archivo separado por
 * tabuladores. Se elige el candidato que produzca mas columnas, dando prioridad
 * al que dé exactamente las 248 del instructivo.
 */
export function detectarSeparador(texto) {
  const primeraLinea = String(texto).replace(/^﻿/, '').split(/\r?\n/)[0] ?? '';
  const candidatos = [',', ';', '\t', '|'];

  let mejor = ',', mejorCuenta = 0;
  for (const sep of candidatos) {
    // Se cuentan solo los separadores que quedan fuera de comillas.
    let cuenta = 0, enComillas = false;
    for (const ch of primeraLinea) {
      if (ch === '"') enComillas = !enComillas;
      else if (ch === sep && !enComillas) cuenta++;
    }
    if (cuenta === 247) return sep;          // coincide con las 248 columnas
    if (cuenta > mejorCuenta) { mejor = sep; mejorCuenta = cuenta; }
  }
  return mejor;
}

/**
 * Lector de CSV tolerante a comillas y saltos de linea dentro de campos.
 * El separador se detecta solo si no se indica.
 */
export function leerCSV(texto, separador) {
  const t = String(texto).replace(/^﻿/, '');
  const sep = separador || detectarSeparador(t);

  const filas = [];
  let campo = '', fila = [], enComillas = false;

  for (let i = 0; i < t.length; i++) {
    const ch = t[i];
    if (enComillas) {
      if (ch === '"') {
        if (t[i + 1] === '"') { campo += '"'; i++; } else enComillas = false;
      } else campo += ch;
    } else if (ch === '"') enComillas = true;
    else if (ch === sep) { fila.push(campo); campo = ''; }
    else if (ch === '\n') { fila.push(campo); filas.push(fila); fila = []; campo = ''; }
    else if (ch !== '\r') campo += ch;
  }
  if (campo !== '' || fila.length) { fila.push(campo); filas.push(fila); }

  if (!filas.length) return [];
  const cab = filas[0].map(h => limpiar(h));
  return filas.slice(1)
    .filter(f => f.some(v => limpiar(v) !== ''))
    .map(f => Object.fromEntries(cab.map((h, i) => [h, f[i] ?? ''])));
}

/**
 * Empareja las columnas del archivo con las del instructivo.
 * Si los encabezados no coinciden por nombre pero hay 248 columnas, se asume
 * el orden oficial. Devuelve tambien un aviso para mostrar al usuario.
 */
export function mapearColumnas(registros) {
  if (!registros.length) return { filas: [], aviso: 'El archivo no tiene registros.' };

  const presentes = Object.keys(registros[0]);
  const indice = new Map(presentes.map(p => [canon(p), p]));
  const faltantes = COLUMNAS.filter(c => !indice.has(canon(c)));

  if (faltantes.length === 0) {
    return { filas: registros, aviso: null };
  }

  if (presentes.length === COLUMNAS.length) {
    const filas = registros.map(r => {
      const o = {};
      COLUMNAS.forEach((c, i) => { o[c] = r[presentes[i]] ?? ''; });
      return o;
    });
    return {
      filas,
      aviso: 'Los encabezados no coinciden con los nombres oficiales, pero el archivo trae el mismo numero de columnas: se emparejaron por posicion, en el orden del instructivo.',
    };
  }

  const filas = registros.map(r => {
    const o = {};
    for (const c of COLUMNAS) {
      const p = indice.get(canon(c));
      o[c] = p ? r[p] : '';
    }
    return o;
  });

  const muestra = faltantes.slice(0, 4).join(', ');
  return {
    filas,
    aviso: `Tu archivo trae ${presentes.length} columnas y el reporte se compone de ${COLUMNAS.length}. Las ${faltantes.length} que faltan se agregan vacias (${muestra}${faltantes.length > 4 ? '…' : ''}). Si alguna era obligatoria, aparecera en los campos por completar.`,
  };
}

// ---------------------------------------------------------------------------
// Escritura
// ---------------------------------------------------------------------------

function celdaCSV(v) {
  const s = String(v ?? '');
  return /[",\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

/** Serializa las filas corregidas con los 248 encabezados oficiales. */
export function aCSV(filas) {
  const lineas = [COLUMNAS.join(',')];
  for (const f of filas) lineas.push(CAMPOS.map(c => celdaCSV(f[c.key])).join(','));
  return lineas.join('\r\n') + '\r\n';
}

/** Serializa una tabla generica (reportes de cambios y pendientes). */
export function tablaACSV(encabezados, filas, claves) {
  const lineas = [encabezados.map(celdaCSV).join(',')];
  for (const f of filas) lineas.push(claves.map(k => celdaCSV(f[k])).join(','));
  return lineas.join('\r\n') + '\r\n';
}

// ---------------------------------------------------------------------------
// Nombre del archivo de salida
// ---------------------------------------------------------------------------

/** Une las partes en el nombre que exige el sistema. */
export function componerNombre({ nit, anio, mes, semana }) {
  return `${nit}_${anio}_${mes}_S${semana}.csv`;
}

/** Valida cada parte del nombre. Devuelve un objeto de errores por parte. */
export function validarNombre({ nit, anio, mes, semana }) {
  const errores = {};
  if (!/^\d{9}$/.test(nit)) errores.nit = 'El NIT debe tener exactamente 9 digitos.';
  if (!/^\d{4}$/.test(anio)) errores.anio = 'El año debe tener 4 digitos.';
  if (!/^\d{2}$/.test(mes) || +mes < 1 || +mes > 12) errores.mes = 'El mes va de 01 a 12.';
  if (!/^\d{2}$/.test(semana) || +semana < 1 || +semana > 53) {
    errores.semana = 'La semana epidemiologica va de 01 a 53.';
  }
  return errores;
}

/**
 * Propone el nombre del archivo a partir de los datos corregidos.
 *
 * El sistema exige NIT_AAAA_MM_Snn con NIT de 9 digitos y semana de 2.
 * Ejemplo valido: 900123456_2022_11_S04
 *
 * Devuelve tambien las partes por separado para poder editarlas en la interfaz,
 * y la semana que corresponde al calendario epidemiologico segun la fecha de
 * corte, util cuando no se sabe cual va.
 */
export function nombreArchivo(filas) {
  const avisos = [];
  if (!filas.length) {
    return { nombre: 'SMH_corregido.csv', partes: null, avisos, sugerencia: null };
  }

  const f = filas[0];

  let nit = String(f.nit || '').replace(/\D/g, '');
  if (nit.length > 9) {
    avisos.push(`El NIT traia ${nit.length} digitos (${nit}); se recorta a los 9 exigidos.`);
    nit = nit.slice(-9);
  }
  nit = nit.padStart(9, '0');

  const corte = f.fecha_fin_periodo || f.fecha_cargue || hoy();
  const anio = corte.slice(0, 4);
  const mes = corte.slice(5, 7);

  let semana = String(f.semana_epidemiologica || '').replace(/\D/g, '');
  if (!semana) {
    avisos.push('El archivo no trae semana epidemiologica: revisa el nombre antes de descargarlo.');
  }

  // Semana que corresponde a la fecha de corte segun el calendario del INS.
  const calc = semanaEpidemiologica(corte);
  const sugerencia = calc
    ? { semana: String(calc.semana).padStart(2, '0'), anio: calc.anio, corte }
    : null;

  // Si el archivo no trae semana, se usa la calculada.
  if (!semana && sugerencia) semana = sugerencia.semana;
  semana = (semana || '0').padStart(2, '0');

  // Las semanas de las distintas gestantes deberian coincidir.
  const distintas = new Set(filas.map(x => String(x.semana_epidemiologica || '')).filter(Boolean));
  if (distintas.size > 1) {
    avisos.push(
      `El archivo trae varias semanas epidemiologicas (${[...distintas].join(', ')}). ` +
      `Se usa ${semana} para el nombre: verifica cual corresponde.`);
  }

  const partes = { nit, anio, mes, semana };
  return { nombre: componerNombre(partes), partes, avisos, sugerencia };
}
