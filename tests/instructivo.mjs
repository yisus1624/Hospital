// Comprobacion del esquema contra el Instructivo SMH V5.
//
// `docs/instructivo-v5.json` es la tabla del instructivo extraida del PDF tal
// cual: 248 campos con su nombre, longitud, tipo, valores permitidos,
// obligatoriedad y nota aclaratoria. Esta prueba comprueba que `esquema.js`
// dice lo mismo que el documento.
//
// Es la prueba que responde a "¿el validador aplica el instructivo?", y hay que
// volver a correrla cada vez que se toque el esquema. Las pruebas de
// `validar.mjs` y `cobertura.mjs` comprueban el comportamiento; esta comprueba
// la fuente normativa.
//
// Donde el esquema se aparta del documento a proposito, la desviacion esta
// declarada abajo en DESVIACIONES con su motivo. Cualquier otra diferencia
// hace fallar la prueba.
//
// Uso:  node tests/instructivo.mjs

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { CAMPOS } from '../src/core/esquema.js';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');
const instructivo = JSON.parse(readFileSync(join(raiz, 'docs/instructivo-v5.json'), 'utf8'));

const ok = s => `\x1b[32m${s}\x1b[0m`;
const mal = s => `\x1b[31m${s}\x1b[0m`;
const dim = s => `\x1b[90m${s}\x1b[0m`;

let fallos = 0;
function comprobar(condicion, titulo, detalle = '') {
  console.log(`${condicion ? ok('  OK  ') : mal(' FALLA')}  ${titulo}${detalle ? dim(' — ' + detalle) : ''}`);
  if (!condicion) fallos++;
}

// ---------------------------------------------------------------------------
// Desviaciones deliberadas respecto al documento.
//
// Dos clases, y conviene no confundirlas:
//
//   'validador'  el instructivo dice una cosa y el validador real de la
//                plataforma exige otra, demostrado con el reporte de errores
//                que devolvio el sistema. Manda el validador: el archivo tiene
//                que pasar por el, no por el PDF.
//
//   'errata'     el documento se contradice consigo mismo (una copia y pega en
//                la columna de obligatoriedad). Se aplica la lectura coherente
//                con el resto de la tabla.
// ---------------------------------------------------------------------------

const DESVIACIONES = {
  130: { clase: 'validador', campo: 'requerido/valores',
    motivo: 'El instructivo pide SI/NO y obligatorio. El reporte de la plataforma dice textualmente: ' +
            '"solo permite las opciones de respuestas POSITIVO, NEGATIVO, INDETECTABLE y vacio en caso que no aplique".' },
  136: { clase: 'validador', campo: 'requerido/valores',
    motivo: 'Mismo caso que Urocultivo3: la plataforma admite la celda vacia cuando no se realiza.' },
  178: { clase: 'validador', campo: 'requerido',
    motivo: 'El instructivo lo hace condicional a que la madre haya fallecido, pero el codigo 4 ' +
            '("la persona no ha fallecido") tiene que ir siempre. Se trata como obligatorio y el ' +
            'corrector rellena el 4 cuando la vitalidad dice que no fallecio.' },
  142: { clase: 'errata', campo: 'condicion',
    motivo: 'El instructivo dice que depende de "Resultado prueba rapida trimestre 2", pero el campo ' +
            'es la fecha de la prueba del trimestre 3 y su propia nota habla de vih3. Se usa el resultado del 3.' },
  200: { clase: 'errata', campo: 'condicion',
    motivo: 'El instructivo dice que depende de "Control nutricion 2", pero es la alteracion nutricional ' +
            'de la consulta 1 y los campos vecinos (199 y 202) siguen el patron 1->1 y 2->2. Se usa el control 1.' },
  71: { clase: 'validador', campo: 'fecha',
    motivo: 'El instructivo pide que la fecha de la antitetanica sea posterior a la FUM, pero la vacuna ' +
            'suele ponerse antes del embarazo. El reporte de la plataforma lo dice: "fecha_antitetanica si ' +
            'es menor a la fum no puede ser superior a 5 años". Se admite anterior, hasta 5 años.' },
  111: { clase: 'validador', campo: 'longitud',
    motivo: 'Longitud declarada 1, pero los propios valores permitidos son PRUEBA RAPIDA y VDRL. Manda el catalogo.' },
  127: { clase: 'validador', campo: 'longitud',
    motivo: 'Longitud declarada 1, pero los propios valores permitidos son PRUEBA RAPIDA y VDRL. Manda el catalogo.' },
};

const desviado = (n, campo) => DESVIACIONES[n]?.campo.split('/').includes(campo);

// ---------------------------------------------------------------------------

console.log('\n== La tabla del instructivo ==');
comprobar(instructivo.length === 248, 'El instructivo declara 248 campos', `son ${instructivo.length}`);
comprobar(CAMPOS.length === 248, 'El esquema declara 248 campos', `son ${CAMPOS.length}`);

const porNum = new Map(CAMPOS.map(c => [c.num, c]));
comprobar(instructivo.every(f => porNum.has(f.num)),
  'Cada campo del instructivo tiene su entrada en el esquema');

// ---------------------------------------------------------------------------

console.log('\n== Tipo de dato ==');
const tipoMal = instructivo.filter(f => porNum.get(f.num).tipo !== f.tipo);
comprobar(tipoMal.length === 0, 'Los 248 tipos coinciden con el instructivo',
  tipoMal.slice(0, 3).map(f => `${f.num} ${f.nombre}: doc ${f.tipo} / esquema ${porNum.get(f.num).tipo}`).join(' | '));

console.log('\n== Longitud maxima ==');
const largoMal = instructivo.filter(f =>
  f.len !== null && porNum.get(f.num).len !== f.len && !desviado(f.num, 'longitud'));
comprobar(largoMal.length === 0, 'Las longitudes coinciden, salvo las desviaciones declaradas',
  largoMal.slice(0, 3).map(f => `${f.num} ${f.nombre}: doc ${f.len} / esquema ${porNum.get(f.num).len}`).join(' | '));

// ---------------------------------------------------------------------------

console.log('\n== Valores permitidos ==');
// Solo se comparan los catalogos que el PDF separa de forma inequivoca: los
// codificados ("1: Si  2: No") y los que vienen con coma. Los textuales van
// pegados en el PDF ("REACTIVO NO REACTIVO") y no se pueden partir sin adivinar.
let comparados = 0;
const catMal = [];
for (const f of instructivo) {
  const e = porNum.get(f.num);
  if (!f.valores || !e.vals) continue;
  comparados++;
  const a = f.valores.map(x => x.toUpperCase()).join('|');
  const b = e.vals.map(x => x.toUpperCase()).join('|');
  if (a !== b && !desviado(f.num, 'valores')) catMal.push(`${f.num} ${f.nombre}: doc [${a}] / esquema [${b}]`);
}
comprobar(catMal.length === 0,
  `Los catalogos codificados coinciden con el instructivo`,
  `${comparados} comparados${catMal.length ? ' — ' + catMal.slice(0, 2).join(' | ') : ''}`);

// Ningun campo con catalogo en el documento puede quedarse sin catalogo.
const sinCatalogo = instructivo.filter(f =>
  /Solo permite los siguientes valores/i.test(f.valoresTexto) && !porNum.get(f.num).vals);
comprobar(sinCatalogo.length === 0,
  'Todo campo con lista cerrada en el instructivo la tiene en el esquema',
  sinCatalogo.slice(0, 3).map(f => `${f.num} ${f.nombre}`).join(' | '));

// ---------------------------------------------------------------------------

console.log('\n== Obligatoriedad ==');
const clase = txt => {
  const t = txt.trim().toLowerCase();
  if (t === 'si' || t === 'sí') return 'SI';
  if (t === 'no') return 'NO';
  return 'COND';
};
const reqMal = instructivo.filter(f =>
  clase(f.requerido) !== porNum.get(f.num).req && !desviado(f.num, 'requerido'));
comprobar(reqMal.length === 0, 'Obligatorio / opcional / condicional coincide en los 248 campos',
  reqMal.slice(0, 3).map(f => `${f.num} ${f.nombre}: doc ${clase(f.requerido)} / esquema ${porNum.get(f.num).req}`).join(' | '));

// Todo condicional tiene que declarar de que campo depende.
const condSinRegla = CAMPOS.filter(c => c.req === 'COND' && !c.x?.cond);
comprobar(condSinRegla.length === 0,
  'Cada campo condicional declara de que otro campo depende',
  condSinRegla.slice(0, 3).map(c => `${c.num} ${c.nombre}`).join(' | '));

// Y ese campo tiene que existir.
const porKey = new Set(CAMPOS.map(c => c.key));
const condRota = CAMPOS.filter(c => c.x?.cond && !porKey.has(c.x.cond[1]));
comprobar(condRota.length === 0, 'Las condiciones apuntan a campos que existen',
  condRota.slice(0, 3).map(c => `${c.num} ${c.nombre} -> ${c.x.cond[1]}`).join(' | '));

// ---------------------------------------------------------------------------

console.log('\n== Reglas de las notas aclaratorias ==');

const sinTildes = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// "No debe ser superior a la actual" -> no se admite fecha futura.
const futuraMal = instructivo.filter(f => {
  const e = porNum.get(f.num);
  if (e.tipo !== 'F') return false;
  const t = sinTildes(`${f.nota} ${f.requerido}`);
  const pide = /(no debe ser superior a la actual|superior a la fecha actual|inferior a la fecha actual|inferior a la actual)/.test(t);
  return pide && !e.x?.no_futura;
});
comprobar(futuraMal.length === 0,
  'Toda fecha que el instructivo prohibe en el futuro esta controlada',
  futuraMal.slice(0, 3).map(f => `${f.num} ${f.nombre}`).join(' | '));

// "Debe ser superior a la FUM"
const fumMal = instructivo.filter(f => {
  const e = porNum.get(f.num);
  if (e.tipo !== 'F') return false;
  if (desviado(f.num, 'fecha')) return false;
  return /superior a la fum/.test(sinTildes(f.nota)) && !(e.x?.mayor_que || []).includes('fum');
});
comprobar(fumMal.length === 0,
  'Toda fecha que debe ser posterior a la FUM lo tiene declarado',
  fumMal.slice(0, 3).map(f => `${f.num} ${f.nombre}`).join(' | '));

// Las relaciones de orden apuntan a campos existentes y de tipo fecha.
const relRota = [];
for (const c of CAMPOS) {
  for (const rel of ['mayor_que', 'menor_que']) {
    for (const otro of c.x?.[rel] || []) {
      const d = CAMPOS.find(x => x.key === otro);
      if (!d) relRota.push(`${c.num} ${c.nombre} -> ${otro} (no existe)`);
      else if (d.tipo !== 'F') relRota.push(`${c.num} ${c.nombre} -> ${otro} (no es fecha)`);
    }
  }
}
comprobar(relRota.length === 0, 'Las comparaciones entre fechas apuntan a fechas reales',
  relRota.slice(0, 3).join(' | '));

// Los maximos declarados no pueden contradecir al catalogo del propio campo.
const rangoRaro = CAMPOS.filter(c =>
  c.vals && c.x?.max !== undefined && c.vals.every(v => Number(v) > c.x.max));
comprobar(rangoRaro.length === 0, 'Ningun maximo deja fuera a todos los valores permitidos',
  rangoRaro.slice(0, 3).map(c => `${c.num} ${c.nombre}`).join(' | '));

// ---------------------------------------------------------------------------

console.log('\n== Desviaciones declaradas ==');
for (const [num, d] of Object.entries(DESVIACIONES)) {
  const c = porNum.get(+num);
  console.log(dim(`        ${num} ${c.nombre} · ${d.clase} · ${d.campo}`));
  console.log(dim(`           ${d.motivo}`));
}
comprobar(Object.keys(DESVIACIONES).length === 8,
  'Las desviaciones respecto al documento son las 8 declaradas, ni una mas');

// ---------------------------------------------------------------------------

console.log(fallos === 0
  ? ok('\n' + '='.repeat(62) + '\nEl esquema aplica el Instructivo SMH V5.\n')
  : mal('\n' + '='.repeat(62) + `\n${fallos} comprobacion(es) fallaron.\n`));
process.exit(fallos ? 1 : 0);
