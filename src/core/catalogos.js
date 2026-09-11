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
 * Traducciones especificas por campo: la palabra que trae el archivo y el
 * codigo que el instructivo le asigna a esa misma palabra ("4: Alto",
 * "5: Bajo", "21: Riesgo no evaluado").
 *
 * Solo se traduce lo que el instructivo define con esa palabra. SI/NO en un
 * campo de riesgo, o ALTO/BAJO en uno de antecedentes, no dicen cual es el
 * dato correcto: se dejan para revision manual.
 */
export const MAPA_CAMPO = {
  riesgo_preeclampsia: { ALTO: '4', BAJO: '5' },
  riesgo_tromboembolismo: {
    ALTO: '4', BAJO: '5',
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

  // Abreviatura ("PRES" -> PRESENCIAL) o valor oficial seguido de un signo
  // ("A+" -> A), solo si resulta inequivoco. Lo que sigue al valor oficial no
  // puede ser una letra: "SIN EXAMEN" empieza por SI y significa lo contrario.
  const pref = catalogo.filter(v => {
    const o = canon(v);
    return (c.length >= 3 && o.startsWith(c))
        || (c.startsWith(o) && !/^[A-ZÑ]/.test(c.slice(o.length)));
  });
  if (pref.length === 1) return pref[0];

  return null;
}
