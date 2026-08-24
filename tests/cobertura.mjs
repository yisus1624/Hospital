// Prueba de cobertura total del esquema.
//
// El archivo real solo trae datos en 121 de las 248 columnas, asi que la mayor
// parte de las reglas nunca se ejercita con el. Aqui se construye un registro
// sintetico que llena TODAS las columnas con valores desordenados pero
// interpretables (fechas en formatos variados, catalogos en minuscula y con
// tildes, numeros con separadores) y se comprueba que la salida cumple el
// instructivo campo por campo.
//
// Uso:  node tests/cobertura.mjs

import { CAMPOS, COLUMNAS, POR_KEY } from '../src/core/esquema.js';
import { procesar } from '../src/core/corrector.js';
import { aCSV, leerCSV, mapearColumnas } from '../src/core/archivo.js';

const ok = s => `\x1b[32m${s}\x1b[0m`;
const mal = s => `\x1b[31m${s}\x1b[0m`;
const dim = s => `\x1b[90m${s}\x1b[0m`;

let fallos = 0;
const problemas = [];

function comprobar(condicion, titulo, detalle = '') {
  console.log(`${condicion ? ok('  OK  ') : mal(' FALLA')}  ${titulo}${detalle ? dim(' — ' + detalle) : ''}`);
  if (!condicion) fallos++;
}

// ---------------------------------------------------------------------------
// Generacion de valores sucios pero recuperables
// ---------------------------------------------------------------------------

const FECHAS_SUCIAS = [
  '15/03/2026', '2026-03-15', '15-03-2026', '20260315', '2026/03/15',
  '  2026-03-15  ', '2026-03-15 08:30:00',
];

/** Ensucia un valor valido de catalogo de formas que se ven en la practica. */
function ensuciarCatalogo(valor, i) {
  const trucos = [
    v => v.toLowerCase(),
    v => v + ' ',
    v => ' ' + v,
    v => v.replace(/A/g, 'Á').replace(/I/g, 'Í'),
    v => v.split('').map((c, j) => j % 2 ? c.toLowerCase() : c).join(''),
    v => v,
  ];
  return trucos[i % trucos.length](valor);
}

/**
 * Construye una fila con las 248 columnas diligenciadas.
 * `variante` cambia los valores elegidos para cubrir mas combinaciones.
 */
function filaSucia(variante) {
  const fila = {};
  let n = variante;

  for (const c of CAMPOS) {
    n++;
    let v;

    if (c.tipo === 'F') {
      v = FECHAS_SUCIAS[n % FECHAS_SUCIAS.length];
    } else if (c.vals) {
      v = ensuciarCatalogo(c.vals[n % c.vals.length], n);
    } else if (c.tipo === 'N' || c.x?.dec) {
      const max = c.x?.max ?? 99;
      const min = c.x?.min ?? 1;
      const base = Math.min(max, Math.max(min, min + (n % 9)));
      v = c.x?.dec ? `${base}.${n % 10}` : String(base);
      if (n % 4 === 0) v = ' ' + v + ' ';
    } else if (c.x?.solo_digitos) {
      v = '1'.repeat(Math.min(c.len, 8));
    } else {
      v = 'JOSÉ MARÍA';       // con tildes, para comprobar la limpieza
      if (c.x?.cie10) v = 'o80';
    }
    fila[c.col] = v;
  }

  // Coherencias minimas para que las fechas no choquen entre si.
  fila.fum = '2026-01-05';
  fila.fpp = '12/10/2026';
  fila.fecha_ingreso_riamp_nivel_primario = '2026-02-01';
  fila.fecha_de_ingreso_al_programa_de_atencion_integral = '2026-02-10';
  fila.fecha_de_cargue = '2026-03-01';
  fila.fecha_inicial_del_periodo_de_la_informacion_reportada = '2026-02-01';
  fila.fecha_final_del_periodo_de_la_informacion_reportada = '2026-02-28';
  fila.semana_gestacional = '4';
  fila.nit = '800193912';
  fila.semana_epidemiologica = '9';
  return fila;
}

// ---------------------------------------------------------------------------

console.log('\n== Generacion ==');
const brutas = [0, 1, 2, 3, 4, 5].map(filaSucia);
comprobar(Object.keys(brutas[0]).length === 248,
  'Cada fila sintetica trae las 248 columnas', `${Object.keys(brutas[0]).length}`);
comprobar(COLUMNAS.every(c => String(brutas[0][c] ?? '') !== ''),
  'Ninguna columna queda vacia antes de corregir');

const r = procesar(brutas);
console.log(dim(`        ${r.resumen.correcciones} correcciones, ${r.resumen.pendientes} pendientes`));

// ---------------------------------------------------------------------------
// La salida debe cumplir el instructivo campo por campo
// ---------------------------------------------------------------------------

console.log('\n== Conformidad de la salida ==');

const fallosPorRegla = {
  fecha: [], catalogo: [], longitud: [], rango: [], caracteres: [], decimal: [],
};

for (const [i, fila] of r.filas.entries()) {
  for (const c of CAMPOS) {
    const v = fila[c.key];
    if (v === '' || v == null) continue;
    const ref = `fila ${i + 1} · ${c.col} = "${v}"`;

    if (c.tipo === 'F' && !/^\d{4}-\d{2}-\d{2}$/.test(v)) {
      fallosPorRegla.fecha.push(ref);
    }
    if (c.vals && !c.vals.includes(v)) {
      fallosPorRegla.catalogo.push(`${ref} (permitidos: ${c.vals.join('/')})`);
    }
    // La longitud solo se comprueba en campos de texto libre.
    //
    // En el instructivo la columna "Longitud maxima" se contradice con los
    // propios valores permitidos en 14 campos: declara 2 para `riesgo`, que
    // admite "ALTO"; 2 para los urocultivos, que admiten "INDETECTABLE"; y 2
    // para `hb`, que admite decimales como "8.3". El archivo enviado a la
    // plataforma llevaba "BAJO" y "8.1" y el validador no objeto la longitud,
    // asi que en esos campos manda el catalogo o el rango, no la cifra.
    const longitudFiable = !c.vals && !c.x?.dec;
    if (longitudFiable && String(v).length > c.len) {
      fallosPorRegla.longitud.push(`${ref} (max ${c.len})`);
    }
    if (/[^\x20-\x7E]/.test(v)) {
      fallosPorRegla.caracteres.push(ref);
    }
    if (!c.vals && c.tipo !== 'F') {
      const num = parseFloat(String(v).replace(',', '.'));
      if (Number.isFinite(num)) {
        if (c.x?.min !== undefined && num < c.x.min) fallosPorRegla.rango.push(`${ref} (min ${c.x.min})`);
        if (c.x?.max !== undefined && num > c.x.max) fallosPorRegla.rango.push(`${ref} (max ${c.x.max})`);
      }
      const sep = c.x?.sep_dec;
      if (sep === '.' && v.includes(',')) fallosPorRegla.decimal.push(`${ref} (separador esperado: punto)`);
      if (sep === ',' && v.includes('.')) fallosPorRegla.decimal.push(`${ref} (separador esperado: coma)`);
    }
  }
}

const ETIQUETAS = {
  fecha: 'Todas las fechas quedan en AAAA-MM-DD',
  catalogo: 'Todos los catalogos quedan dentro de sus valores permitidos',
  longitud: 'Ningun campo excede su longitud maxima',
  rango: 'Ningun numero queda fuera de su rango',
  caracteres: 'No quedan tildes ni caracteres fuera de ASCII imprimible',
  decimal: 'Los separadores decimales son los que exige el instructivo',
};

for (const [regla, lista] of Object.entries(fallosPorRegla)) {
  comprobar(lista.length === 0, ETIQUETAS[regla],
    lista.length ? `${lista.length} casos` : '');
  if (lista.length) problemas.push(...lista.slice(0, 6).map(x => `[${regla}] ${x}`));
}

// ---------------------------------------------------------------------------
// Condicionales: si el padre no aplica, el hijo debe estar vacio
// ---------------------------------------------------------------------------

console.log('\n== Reglas condicionales ==');

let incoherentes = [];
for (const [i, fila] of r.filas.entries()) {
  for (const c of CAMPOS) {
    if (c.req !== 'COND' || !c.x?.cond) continue;
    const [tipo, padre, vals] = c.x.cond;
    const cumple = tipo === 'lleno'
      ? fila[padre] !== '' && fila[padre] != null
      : vals.some(x => String(x) === String(fila[padre]));

    if (!cumple && fila[c.key]) {
      incoherentes.push(`fila ${i + 1} · ${c.col} tiene "${fila[c.key]}" pero ${POR_KEY[padre].col} = "${fila[padre]}"`);
    }
  }
}
comprobar(incoherentes.length === 0,
  'Los campos que no aplican quedan vacios',
  incoherentes.length ? `${incoherentes.length} casos` : '');
if (incoherentes.length) problemas.push(...incoherentes.slice(0, 6).map(x => `[condicional] ${x}`));

// ---------------------------------------------------------------------------
// Estructura del CSV resultante
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Formatos de archivo que puede producir Excel
// ---------------------------------------------------------------------------

console.log('\n== Formatos de entrada ==');

const csvBase = aCSV(r.filas);
const variantes = {
  'separado por comas': csvBase,
  'separado por punto y coma': csvBase.split('\r\n').map(l => l.split(',').join(';')).join('\r\n'),
  'separado por tabuladores': csvBase.split('\r\n').map(l => l.split(',').join('\t')).join('\r\n'),
  'con BOM de Excel': '﻿' + csvBase,
  'con saltos de linea Unix': csvBase.replace(/\r\n/g, '\n'),
};

for (const [nombre, texto] of Object.entries(variantes)) {
  const leidas = leerCSV(texto);
  const columnas = leidas.length ? Object.keys(leidas[0]).length : 0;
  comprobar(leidas.length === brutas.length && columnas === 248,
    `Se lee un archivo ${nombre}`, `${leidas.length} filas, ${columnas} columnas`);
}

// ---------------------------------------------------------------------------
// Reprocesar la salida no debe cambiarla: la correccion es estable
// ---------------------------------------------------------------------------

console.log('\n== Estabilidad ==');
const segunda = procesar(mapearColumnas(leerCSV(csvBase)).filas);
comprobar(aCSV(segunda.filas) === csvBase,
  'Volver a corregir un archivo ya corregido no lo altera',
  segunda.resumen.correcciones ? `${segunda.resumen.correcciones} cambios en la segunda pasada` : '');

console.log('\n== Estructura del CSV ==');
const csv = aCSV(r.filas);
const lineas = csv.trim().split('\r\n');
comprobar(lineas.length === brutas.length + 1, 'Encabezado + una linea por registro');
comprobar(lineas.every(l => l.split(',').length === 248), 'Todas las lineas tienen 248 columnas');
comprobar(!/, | ,/.test(csv), 'Ningun valor con espacios al borde');

// ---------------------------------------------------------------------------

if (problemas.length) {
  console.log(mal('\n== Detalle de los problemas =='));
  for (const p of problemas) console.log('  ' + p);
}

console.log(fallos === 0
  ? ok(`\n${'='.repeat(62)}\nCobertura completa: las 248 columnas salen conformes.\n`)
  : mal(`\n${'='.repeat(62)}\n${fallos} comprobacion(es) fallaron.\n`));

process.exit(fallos === 0 ? 0 : 1);
