// Reconciliacion de valores contra los catalogos cerrados del instructivo.

import { canon } from './texto.js';

/**
 * Variantes que se aceptan como equivalentes de cada valor oficial.
 * Permite recuperar datos digitados como "Si", "positivo", "+", "1", etc.
 */
const SINONIMOS = {
  SI: ['S', 'SI', 'SÍ', '1', 'X', 'TRUE', 'VERDADERO', 'Y', 'YES', 'AFIRMATIVO'],
  NO: ['N', 'NO', '0', 'FALSE', 'FALSO', 'NEGATIVO'],
  POSITIVO: ['POS', 'POSITIVO', '+', 'P', 'REACTIVO'],
  NEGATIVO: ['NEG', 'NEGATIVO', '-', 'NOREACTIVO'],
  REACTIVO: ['R', 'REACTIVO', 'POSITIVO', '+'],
  'NO REACTIVO': ['NR', 'NOREACTIVO', 'NEGATIVO', '-'],
  INDETECTABLE: ['IND', 'INDETECTABLE', 'NODETECTABLE'],
  NORMAL: ['NORMAL'],
  ANORMAL: ['ANORMAL'],
  ALTO: ['ALTO', 'ALTORIESGO'],
  BAJO: ['BAJO', 'BAJORIESGO'],
  TELECONSULTA: ['TELECONSULTA', 'TELE', 'TELEMEDICINA', 'VIRTUAL', 'NOPRESENCIAL'],
  PRESENCIAL: ['PRESENCIAL', 'PRES'],
  DOMICILIARIA: ['DOMICILIARIA', 'DOMICILIARIO', 'DOMICILIO', 'DOM', 'ENCASA'],
  'PRUEBA RAPIDA': ['PRUEBARAPIDA', 'PR', 'RAPIDA', 'TESTRAPIDO'],
  VDRL: ['VDRL'],
  'NO SE REALIZA TAMIZAJE': ['NOSEREALIZATAMIZAJE', 'NOTAMIZAJE', 'NOSEREALIZA', 'SINTAMIZAJE'],
  'RIESGO NO EVALUADO': ['RIESGONOEVALUADO', 'NOEVALUADO', 'SINEVALUAR'],
};

/**
 * Traducciones especificas por campo, donde el archivo usa un vocabulario
 * distinto al que exige el validador.
 *
 * Detectadas comparando el archivo enviado con el reporte de errores devuelto
 * por la plataforma: varias columnas venian diligenciadas con ALTO/BAJO cuando
 * el sistema esperaba SI/NO o los codigos numericos 4/5.
 */
export const MAPA_CAMPO = {
  antecedentes_preclampsia: { ALTO: 'SI', BAJO: 'NO' },
  riesgo_preeclampsia: { ALTO: '4', BAJO: '5', SI: '4', NO: '5' },
  riesgo_tromboembolismo: {
    ALTO: '4', BAJO: '5', SI: '4', NO: '5',
    RIESGONOEVALUADO: '21', NOEVALUADO: '21',
  },
  laboratorios_alterados: {
    RIESGONOEVALUADO: 'RIESGO NO EVALUADO',
    NOEVALUADO: 'RIESGO NO EVALUADO',
  },
};

/**
 * Lleva un valor al catalogo permitido.
 * Devuelve el valor oficial, o null si no hay forma inequivoca de mapearlo.
 */
export function aCatalogo(valor, catalogo, key) {
  const c = canon(valor);
  if (!c) return null;

  const mapa = MAPA_CAMPO[key];
  if (mapa && mapa[c] !== undefined && catalogo.includes(mapa[c])) return mapa[c];

  for (const v of catalogo) if (canon(v) === c) return v;

  for (const v of catalogo) {
    const syn = SINONIMOS[v];
    if (syn && syn.some(s => canon(s) === c)) return v;
  }

  // Prefijo, solo si resulta inequivoco
  const pref = catalogo.filter(v => canon(v).startsWith(c) || c.startsWith(canon(v)));
  if (pref.length === 1) return pref[0];

  return null;
}
