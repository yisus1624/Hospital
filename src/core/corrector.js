// Orquestador: aplica normalizacion y reglas a cada fila del archivo.

import { CAMPOS, POR_KEY } from './esquema.js';
import { normalizarCelda } from './normalizar.js';
import { limpiar } from './texto.js';
import * as reglas from './reglas.js';

/**
 * Corrige una fila.
 * @returns {{fila: object, cambios: array, pendientes: array}}
 */
export function corregirFila(bruta, nFila, opciones) {
  const cambios = [];
  const pendientes = [];
  const fila = {};

  const add = (key, valor, motivo) => cambios.push({
    fila: nFila,
    campo: POR_KEY[key].col,
    nombre: POR_KEY[key].nombre,
    antes: fila[key] ?? '',
    despues: valor,
    motivo,
  });

  /**
   * Registra un campo que necesita intervencion humana.
   * `tipo` distingue si el dato falta, si es incoherente con otro campo o si
   * no se pudo interpretar, para poder mostrarlo con claridad en la interfaz.
   */
  const pend = (key, motivo, tipo = 'incoherente') => pendientes.push({
    fila: nFila,
    campo: POR_KEY[key].col,
    nombre: POR_KEY[key].nombre,
    valor: fila[key] ?? '',
    motivo,
    tipo,
  });

  // 1. Normalizacion celda a celda
  for (const c of CAMPOS) {
    const original = String(bruta[c.col] ?? '');
    const r = normalizarCelda(original, c, opciones);

    if (r.valor === null) {
      fila[c.key] = '';
      pendientes.push({
        fila: nFila, campo: c.col, nombre: c.nombre, valor: original,
        motivo: r.error, tipo: 'invalido',
      });
      continue;
    }

    fila[c.key] = r.valor;
    if (r.valor !== original && limpiar(original) !== '') {
      const soloEspacios = original.trim() !== original || /\s{2,}/.test(original);
      cambios.push({
        fila: nFila, campo: c.col, nombre: c.nombre, antes: original, despues: r.valor,
        motivo: r.nota || (soloEspacios
          ? 'Espacios sobrantes: el validador compara el texto exacto'
          : 'Valor normalizado al formato exigido'),
      });
    }
  }

  // 2. Vaciar lo que no aplica
  reglas.limpiarNoAplicables(fila, add);

  // 3. Centinelas y coherencias
  reglas.aplicarCentinelas(fila, add);
  reglas.aplicarCruzadas(fila, add, pend, opciones);

  // 4. Segunda pasada: los centinelas pueden haber desactivado condicionales
  //    (por ejemplo, poner tipo_caso = 21 libera los nueve seguimientos).
  reglas.limpiarNoAplicables(fila, add);

  // 5. Lo que queda mal requiere decision humana
  reglas.verificarObligatorios(fila, pend);

  const antesDeFechas = pendientes.length;
  reglas.verificarFechas(fila, pend);
  // Si alguna fecha quedo fuera de orden, la FUM suele ser la causa: se
  // contrasta con la semana gestacional para senalar el dato a revisar.
  if (pendientes.length > antesDeFechas) reglas.verificarFum(fila, pend);

  reglas.verificarRangos(fila, pend);

  return { fila, cambios, pendientes };
}

/**
 * Procesa el archivo completo.
 * @param {object[]} filasBrutas registros con las columnas oficiales
 * @param {object} opciones
 * @returns {{filas, cambios, pendientes, resumen}}
 */
export const OPCIONES = Object.freeze({
  tipoConsultaPorDefecto: 'PRESENCIAL',
  negativosPorDefecto: true,
  // La enye se conserva. Solo se sustituye por N si el reporte de errores de
  // la plataforma demuestra que la rechaza (ver `errores-sistema.js`).
  enyeComoN: false,
});

export function procesar(filasBrutas, opciones = {}) {
  const opts = { ...OPCIONES, ...opciones };

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

  return {
    filas,
    cambios,
    pendientes,
    resumen: {
      registros: filas.length,
      correcciones: cambios.length,
      pendientes: pendientes.length,
      filasConPendientes: new Set(pendientes.map(p => p.fila)).size,
    },
  };
}
