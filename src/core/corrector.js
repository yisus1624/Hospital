// Orquestador: aplica normalizacion y reglas a cada fila del archivo.
//
// Cada cambio queda registrado con su tipo:
//   - 'formato':     la misma informacion escrita como la pide el instructivo
//                    (espacios, mayusculas, tildes, fechas, separadores).
//   - 'instructivo': una celda vacia llenada con el codigo que el instructivo
//                    prescribe para ese caso, o una centinela 1845-01-01
//                    retirada donde el instructivo pide la celda vacia.
//   - 'vaciado':     el valor no se pudo interpretar y la celda sale vacia,
//                    porque el sistema rechaza la fila entera si va un valor
//                    fuera de catalogo. El dato original NO se pierde: queda
//                    en `pendientes` con su valor, y el cambio se registra
//                    aqui para que tambien se vea en el reporte de
//                    correcciones y en el CSV de cambios.
// Nada mas se cambia solo. Lo demas va a `pendientes` para revision manual.

import { CAMPOS, POR_KEY } from './esquema.js';
import { normalizarCelda } from './normalizar.js';
import { limpiar } from './texto.js';
import * as reglas from './reglas.js';
import * as fechas from './fechas.js';

/**
 * Corrige una fila.
 * @returns {{fila: object, cambios: array, pendientes: array}}
 */
export function corregirFila(bruta, nFila, opciones) {
  const cambios = [];
  const pendientes = [];
  const porCelda = new Map();
  const fila = {};

  const add = (key, valor, motivo, tipo = 'instructivo') => cambios.push({
    fila: nFila,
    campo: POR_KEY[key].col,
    nombre: POR_KEY[key].nombre,
    antes: fila[key] ?? '',
    despues: valor,
    motivo,
    tipo,
  });

  /**
   * Registra un campo que necesita intervencion humana.
   *
   * `tipo` distingue si el dato falta, si es incoherente con otro campo o si
   * no se pudo interpretar. `sugerido` es el valor que resolveria la regla, si
   * lo hay ('' significa dejar la celda vacia); nunca se aplica solo.
   *
   * Una celda aparece una sola vez: si varias reglas la señalan, los motivos
   * se suman en la misma fila del reporte.
   */
  const pend = (key, motivo, tipo = 'incoherente', sugerido, valor = fila[key] ?? '') => {
    const previo = porCelda.get(key);
    if (previo) {
      if (!previo.motivo.includes(motivo)) previo.motivo += `. ${motivo}`;
      if (previo.sugerido === undefined && sugerido !== undefined) previo.sugerido = sugerido;
      return;
    }
    const p = {
      fila: nFila,
      campo: POR_KEY[key].col,
      nombre: POR_KEY[key].nombre,
      valor,
      motivo,
      tipo,
    };
    if (sugerido !== undefined) p.sugerido = sugerido;
    porCelda.set(key, p);
    pendientes.push(p);
  };

  // 1. Normalizacion celda a celda: solo forma, nunca contenido.
  for (const c of CAMPOS) {
    const original = String(bruta[c.col] ?? '');
    const r = normalizarCelda(original, c, opciones);

    if (r.valor === null) {
      fila[c.key] = '';
      pend(c.key, r.error, 'invalido', undefined, original);
      // Un valor fuera de catalogo hace que el sistema rechace la fila
      // completa, asi que la celda sale vacia. Eso es un cambio con perdida de
      // informacion: se registra para que aparezca tambien en el reporte de
      // correcciones y no solo en la lista de campos por completar.
      if (limpiar(original) !== '') {
        cambios.push({
          fila: nFila, campo: c.col, nombre: c.nombre, antes: original, despues: '',
          motivo: `La celda sale vacia porque el valor no se pudo interpretar y el sistema ` +
                  `rechazaria la fila. El dato original queda en «campos por completar» ` +
                  `para que lo corrijas: ${r.error}`,
          tipo: 'vaciado',
        });
      }
      continue;
    }

    fila[c.key] = r.valor;
    if (r.valor !== original && limpiar(original) !== '') {
      // "Espacios sobrantes" solo si fue lo unico que cambio.
      const soloEspacios = limpiar(original) === r.valor;
      cambios.push({
        fila: nFila, campo: c.col, nombre: c.nombre, antes: original, despues: r.valor,
        motivo: r.nota || (soloEspacios
          ? 'Espacios sobrantes: el validador compara el texto exacto'
          : 'Mismo dato escrito en el formato del instructivo'),
        tipo: 'formato',
      });
    }
  }

  // 2. Codigos de "no aplica" en celdas vacias, segun el instructivo.
  reglas.aplicarCentinelas(fila, add, pend);

  // 3. Coherencias entre campos: se reportan.
  reglas.aplicarCruzadas(fila, add, pend);

  // 4. Campos que no aplican: se retira la centinela o se reporta el dato.
  reglas.limpiarNoAplicables(fila, add, pend);

  // 5. Verificaciones contra el instructivo.
  reglas.verificarObligatorios(fila, pend);

  reglas.verificarFechas(fila, pend);
  reglas.verificarFum(fila, pend);

  reglas.verificarRangos(fila, pend);
  reglas.verificarLongitudes(fila, pend);
  reglas.verificarCie10(fila, pend);

  return { fila, cambios, pendientes };
}

/**
 * Opciones del corrector.
 *
 * La enye se sustituye por N: la plataforma la rechazo en todos los reportes
 * de errores recibidos ("El campo apellido 1 debe contener solo letras" sobre
 * CAÑAS, SEÑA y NUÑEZ). Con `enyeComoN: false` se conserva.
 */
export const OPCIONES = Object.freeze({
  enyeComoN: true,
});

/**
 * Procesa el archivo completo.
 * @param {object[]} filasBrutas registros con las columnas oficiales
 * @param {object} opciones
 * @returns {{filas, cambios, pendientes, resumen}}
 */
export function procesar(filasBrutas, opciones = {}) {
  // Antes de tocar nada se decide como se leen las fechas con barras. Una
  // fecha como 03/07/2026 es ambigua, y la respuesta esta en el resto del
  // archivo: si alguna trae 25/07/2026 el archivo es dia/mes, y si alguna trae
  // 07/25/2026 es mes/dia. Se decide una vez para todo el archivo, nunca
  // celda a celda.
  const ordenFechas = opciones.ordenFecha
    ? { orden: opciones.ordenFecha, dmy: 0, mdy: 0, conflicto: false, ambiguas: 0 }
    : fechas.detectarOrdenFechas(
        filasBrutas.flatMap(f => CAMPOS.filter(c => c.tipo === 'F').map(c => f[c.col] ?? '')));

  const opts = { ...OPCIONES, ordenFecha: ordenFechas.orden, ...opciones };

  const filas = [];
  const cambios = [];
  const pendientes = [];

  filasBrutas.forEach((bruta, i) => {
    // Se numera como la fila del archivo, contando el encabezado como fila 1.
    // Asi el numero coincide con el que muestra Excel al abrirlo y con el
    // identificador que devuelve la plataforma en su reporte de errores.
    const r = corregirFila(bruta, i + 2, opts);
    filas.push(r.fila);
    cambios.push(...r.cambios);
    pendientes.push(...r.pendientes);
  });

  pendientes.push(...revisarPeriodo(filas, pendientes));

  return {
    filas,
    cambios,
    pendientes,
    ordenFechas,
    avisos: avisosDeFechas(ordenFechas),
    resumen: resumir(filas, cambios, pendientes),
  };
}

/**
 * El periodo reportado es uno solo por archivo.
 *
 * La fecha final del periodo "debe corresponder a la fecha de corte del nombre
 * del archivo", y el nombre es uno: todas las filas tienen que traer el mismo
 * periodo. Las que se apartan del que trae la mayoria se señalan con ese como
 * sugerencia. Se revisa sobre el archivo entero porque fila a fila no se ve.
 */
function revisarPeriodo(filas, pendientes) {
  const ya = new Set(pendientes.map(p => `${p.fila}|${p.campo}`));
  const nuevos = [];
  for (const key of ['fecha_ini_periodo', 'fecha_fin_periodo']) {
    const cuenta = new Map();
    for (const f of filas) if (f[key]) cuenta.set(f[key], (cuenta.get(f[key]) ?? 0) + 1);
    if (cuenta.size < 2) continue;

    const [comun, veces] = [...cuenta].sort((a, b) => b[1] - a[1])[0];
    const c = POR_KEY[key];
    filas.forEach((f, i) => {
      if (!f[key] || f[key] === comun || ya.has(`${i + 2}|${c.col}`)) return;
      nuevos.push({
        fila: i + 2, campo: c.col, nombre: c.nombre, valor: f[key], tipo: 'incoherente',
        motivo: `El archivo reporta un solo periodo y ${veces} de ${filas.length} filas traen ` +
                `${comun}; esta trae ${f[key]}`,
        sugerido: comun,
      });
    });
  }
  return nuevos;
}

/** Avisos sobre como se leyeron las fechas con barras. */
function avisosDeFechas({ orden, mdy, conflicto, ambiguas }) {
  const avisos = [];
  if (orden === 'mdy') {
    avisos.push(
      `Las fechas de este archivo vienen en mes/dia/año (lo confirman ${mdy} fechas con ` +
      `dia mayor que 12), no en dia/mes/año. Se leyeron asi. Suele pasar cuando el CSV se ` +
      `guardo desde un Excel en configuracion regional inglesa: comprueba un par de fechas ` +
      `en el reporte de correcciones antes de subirlo.`);
  }
  if (conflicto) {
    avisos.push(
      `El archivo mezcla fechas en dia/mes/año y en mes/dia/año. Se leyeron todas como ` +
      `dia/mes/año, pero revisa las fechas con dia y mes menores que 13: no hay forma de ` +
      `saber cual es cual.`);
  }
  if (orden === 'dmy' && !conflicto && ambiguas && !mdy) {
    // Sin una sola fecha que lo pruebe, dia/mes es una suposicion razonable
    // (es lo que escribe Excel en español) pero sigue siendo una suposicion.
    avisos.push(
      `Ninguna fecha del archivo tiene dia mayor que 12, asi que no hay forma de comprobar ` +
      `si vienen en dia/mes/año o en mes/dia/año. Se leyeron como dia/mes/año.`);
  }
  return avisos;
}

/** Cifras del resumen. Se recalculan tambien al editar una celda. */
export function resumir(filas, cambios, pendientes) {
  return {
    registros: filas.length,
    correcciones: cambios.length,
    pendientes: pendientes.length,
    filasConPendientes: new Set(pendientes.map(p => p.fila)).size,
    // Celdas que traian dato y salen vacias por no ser interpretables: son las
    // unicas en las que el archivo descargado pierde informacion frente al
    // original, asi que se cuentan aparte para poder avisarlo.
    vaciados: cambios.filter(c => c.tipo === 'vaciado').length,
  };
}
