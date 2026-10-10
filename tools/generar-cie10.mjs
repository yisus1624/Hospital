// Genera src/core/cie10.js a partir de la tabla CIE-10 de SISPRO.
//
// La tabla se descarga de web.sispro.gov.co (Tablas de referencia > CIE10) y
// se guarda como CSV desde Excel. Se toma la columna "Codigo" (o la primera).
//
// Uso:  node tools/generar-cie10.mjs ruta/a/TablaReferencia_CIE10.csv

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { basename, dirname, join } from 'node:path';
import { leerCSV } from '../src/core/archivo.js';
import { canon } from '../src/core/texto.js';

const origen = process.argv[2];
if (!origen) {
  console.error('Uso: node tools/generar-cie10.mjs TablaReferencia_CIE10.csv');
  process.exit(1);
}

const registros = leerCSV(readFileSync(origen, 'utf8'));
if (!registros.length) throw new Error('La tabla no tiene registros');
const columnas = Object.keys(registros[0]);
const col = columnas.find(c => canon(c) === 'CODIGO') ?? columnas[0];

const codigos = [...new Set(registros
  .map(r => String(r[col] ?? '').toUpperCase().replace(/[^A-Z0-9]/g, ''))
  .filter(c => /^[A-Z]\d{2}[0-9X]?$/.test(c)))].sort();
if (codigos.length < 1000) {
  throw new Error(`Solo se encontraron ${codigos.length} codigos en la columna "${col}": ¿es la tabla correcta?`);
}

const destino = join(dirname(fileURLToPath(import.meta.url)), '../src/core/cie10.js');
writeFileSync(destino,
  `// Tabla de referencia CIE-10 de SISPRO (web.sispro.gov.co).\n` +
  `// Generado con tools/generar-cie10.mjs a partir de ${basename(origen)}.\n` +
  `// ${codigos.length} codigos. No editar a mano: volver a generarlo.\n\n` +
  `export const CODIGOS = new Set(${JSON.stringify(codigos)});\n`);
console.log(`${codigos.length} codigos escritos en src/core/cie10.js`);
