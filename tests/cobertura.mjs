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

// Una celda señalada para revision manual no tiene que salir conforme: el
// corrector no la toca y la lista para que la corrija una persona.
const reportadas = new Set(r.pendientes.map(p => `${p.fila}|${p.campo}`));
const señalada = (i, c) => reportadas.has(`${i + 2}|${c.col}`);

for (const [i, fila] of r.filas.entries()) {
  for (const c of CAMPOS) {
    const v = fila[c.key];
    if (v === '' || v == null || señalada(i, c)) continue;
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

    if (!cumple && fila[c.key] && !señalada(i, c)) {
      incoherentes.push(`fila ${i + 1} · ${c.col} tiene "${fila[c.key]}" pero ${POR_KEY[padre].col} = "${fila[padre]}"`);
    }
  }
}
comprobar(incoherentes.length === 0,
  'Los campos que no aplican quedan vacios o señalados para revision',
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
// Trampas: valores que parecen arreglables pero cambiarlos alteraria el dato
// ---------------------------------------------------------------------------

console.log('\n== Trampas: el dato no se altera ==');

const base = filaSucia(0);
const TRAMPAS = [
  ['malformaciones_congenitas_en_la_gestacion', 'SIN EXAMEN', 'no se lee como SI'],
  ['hepatitis_b', 'NO', 'no se lee como NO REACTIVO'],
  ['telefono', '300ABC1234', 'no se le quitan las letras'],
  ['talla', '1.55', 'no se convierte en 155'],
  ['documento', 'AB123456', 'no se le quitan las letras'],
  ['peso_al_inicio_de_la_gestacion', '64.25', 'no se redondea a 64.3'],
  ['nombre_1', 'A'.repeat(70), 'no se recorta a 60'],
  ['gestante_antecedentes_preeclampsia', 'BAJO', 'no se traduce a NO'],
  ['riesgo_preeclampsia', 'SI', 'no se traduce a 4'],
  ['partos', '1-2', 'el guion no se borra para leer 12'],
];
for (const [col, valor, porque] of TRAMPAS) {
  const t = procesar([{ ...base, [col]: valor }]);
  const c = CAMPOS.find(x => x.col === col);
  const marcado = t.pendientes.some(p => p.campo === col);
  const intacto = t.filas[0][c.key] === '' || t.filas[0][c.key] === valor;
  comprobar(marcado && intacto, `${col} = "${valor.slice(0, 20)}": ${porque}, queda para revision`);
}

// ---------------------------------------------------------------------------
// Reprocesar la salida no debe cambiarla: la correccion es estable
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Fechas ambiguas: el orden se decide por el archivo, no por celda
// ---------------------------------------------------------------------------

console.log('\n== Orden de las fechas con barras ==');
{
  const vacia = () => Object.fromEntries(CAMPOS.map(c => [c.col, '']));
  const k = c => CAMPOS.find(x => x.col === c).key;
  const fum = 'fum', fpp = 'fpp';
  // Fila con solo estas dos fechas: asi la unica evidencia del orden es la que
  // pone la prueba, sin el ruido del resto de columnas.
  const soloFechas = (a, b) => ({ ...vacia(), [fum]: a, [fpp]: b });

  // Archivo español: 25/07 prueba que el primer numero es el dia.
  const esp = procesar([soloFechas('25/07/2025', '03/04/2026')]);
  comprobar(esp.ordenFechas.orden === 'dmy' && esp.filas[0][k(fpp)] === '2026-04-03',
    'Con una fecha de dia > 12 el archivo se lee como dia/mes/año',
    `03/04/2026 -> ${esp.filas[0][k(fpp)]}`);

  // Archivo guardado por un Excel en ingles: 07/25 prueba que el dia va segundo.
  const eng = procesar([soloFechas('07/25/2025', '04/03/2026')]);
  comprobar(eng.ordenFechas.orden === 'mdy' && eng.filas[0][k(fpp)] === '2026-04-03',
    'Con una fecha de mes/dia el archivo entero se lee en ese orden',
    `04/03/2026 -> ${eng.filas[0][k(fpp)]}`);
  comprobar(eng.avisos.length > 0, 'Y queda avisado, porque cambia como se leen todas las fechas');

  // Sin ninguna fecha que lo pruebe se mantiene dia/mes, pero se avisa.
  const amb = procesar([soloFechas('03/04/2025', '05/06/2026')]);
  comprobar(amb.ordenFechas.orden === 'dmy' && amb.avisos.length > 0,
    'Si ninguna fecha lo prueba se mantiene dia/mes y se avisa de la duda');
}

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
