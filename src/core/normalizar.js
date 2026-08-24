// Normalizacion de una celda individual segun el tipo de campo del instructivo.

import { limpiar, sinTildes, canon, esVacio } from './texto.js';
import { aCatalogo, MAPA_CAMPO } from './catalogos.js';
import * as fechas from './fechas.js';

/** Convierte texto a numero flotante tolerando coma decimal. */
export function aFloat(v) {
  const n = parseFloat(String(v ?? '').replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

/**
 * Extrae un numero de un texto sucio respetando el separador decimal que
 * exige el instructivo para ese campo (coma para el peso, punto para el resto).
 */
export function normalizarNumero(bruto, campo) {
  let s = limpiar(bruto).replace(/\s/g, '');
  if (!s || esVacio(s)) return null;

  const admiteDec = campo.x?.dec;
  const sep = campo.x?.sep_dec || '.';

  s = s.replace(/[^\d.,-]/g, '');
  const corte = Math.max(s.lastIndexOf(','), s.lastIndexOf('.'));

  let entero, decimal = '';
  if (corte >= 0 && admiteDec) {
    entero = s.slice(0, corte).replace(/[.,]/g, '');
    decimal = s.slice(corte + 1).replace(/[.,]/g, '');
  } else {
    entero = s.replace(/[.,]/g, '');
  }

  const neg = entero.startsWith('-');
  entero = entero.replace(/-/g, '');
  if (!entero && !decimal) return null;

  if (campo.x?.ndec !== undefined && admiteDec) {
    const n = parseFloat(`${entero || '0'}.${decimal || '0'}`);
    return (neg ? '-' : '') + n.toFixed(campo.x.ndec).replace('.', sep);
  }

  let out = entero || '0';
  if (decimal && admiteDec) {
    const limpio = decimal.replace(/0+$/, '');
    if (limpio) out += sep + limpio;
  }
  return (neg ? '-' : '') + out;
}

/**
 * Sustituye la enye por N.
 *
 * Solo se usa cuando la plataforma ya rechazo el archivo por ese motivo: por
 * defecto la enye se conserva, porque forma parte del apellido (CAÑAS y CANAS
 * son apellidos distintos).
 */
const enyeAN = s => String(s).replace(/ñ/g, 'n').replace(/Ñ/g, 'N');

/**
 * Normaliza una celda.
 * Devuelve { valor } con el texto ya conforme, o { valor: null, error } cuando
 * el contenido no es interpretable y requiere revision humana.
 *
 * @param {object} opciones  `enyeComoN` convierte la enye en N (ver `enyeAN`).
 */
export function normalizarCelda(bruto, campo, opciones = {}) {
  const original = String(bruto ?? '');
  const s = limpiar(original);

  if (!s || esVacio(s)) return { valor: '' };

  switch (campo.tipo) {
    case 'F': {
      const f = fechas.normalizar(s);
      if (!f) return { valor: null, error: `Fecha no interpretable: "${original}"` };
      return { valor: f };
    }

    case 'T': {
      if (!campo.vals) {
        // Catalogo abierto (nombre de la IPS)
        let v = sinTildes(s).toUpperCase().replace(/[^A-ZÑ0-9 ]/g, '');
        if (opciones.enyeComoN) v = enyeAN(v);
        if (campo.x?.sin_espacios) v = v.replace(/ /g, '');
        return { valor: v.slice(0, campo.len) };
      }
      const v = aCatalogo(s, campo.vals, campo.key);
      if (v !== null) return { valor: v };

      // Un "NO" en un campo opcional cuyo catalogo no lo contempla significa
      // que el examen no se realizo. El validador exige la celda vacia, no un
      // resultado negativo: son cosas distintas clinicamente.
      if (campo.req !== 'SI' && ['NO', 'N', 'NINGUNO'].includes(canon(s))) {
        return { valor: '', nota: `"${original}" indica que no se realizo: el sistema lo exige vacio` };
      }
      return {
        valor: null,
        error: `Valor fuera del catalogo: "${original}". Permitidos: ${campo.vals.join(', ')}`,
      };
    }

    case 'N': {
      // El instructivo indica que una carga viral indetectable se registra
      // como cero, no como texto ni como celda vacia.
      if (campo.x?.indetectable_cero &&
          ['INDETECTABLE', 'NODETECTABLE', 'ND', 'NODETECTADO', 'NEGATIVO'].includes(canon(s))) {
        return { valor: '0', nota: `"${original}" se registra como 0, segun el instructivo` };
      }
      if (campo.vals) {
        const directo = campo.vals.find(x => x === s || +x === +s);
        if (directo !== undefined) return { valor: directo };

        const mapa = MAPA_CAMPO[campo.key];
        if (mapa && mapa[canon(s)] !== undefined) return { valor: mapa[canon(s)] };

        const num = normalizarNumero(s, campo);
        if (num !== null) {
          const match = campo.vals.find(x => +x === +num);
          if (match !== undefined) return { valor: match };
        }
        return {
          valor: null,
          error: `Codigo no permitido: "${original}". Permitidos: ${campo.vals.join(', ')}`,
        };
      }
      const n = normalizarNumero(s, campo);
      if (n === null) return { valor: null, error: `Numero no interpretable: "${original}"` };
      return { valor: campo.x?.zfill ? n.padStart(campo.len, '0') : n };
    }

    default: { // 'A'
      if (campo.x?.solo_digitos) {
        const d = s.replace(/\D/g, '');
        if (!d) return { valor: null, error: `Se esperaban solo digitos: "${original}"` };
        return { valor: d.slice(0, campo.len) };
      }
      if (campo.x?.dec) {
        const n = normalizarNumero(s, campo);
        if (n === null) return { valor: null, error: `Numero no interpretable: "${original}"` };
        return { valor: n };
      }
      // Mayusculas sin tildes ni caracteres especiales, pero **con enye**.
      //
      // El instructivo pide el texto "sin caracteres especiales, ni tildes".
      // La enye no es ninguna de las dos cosas: es una letra del alfabeto
      // español y forma parte del apellido, asi que se conserva. Quitarla
      // convertiria CAÑAS en CAAS y sustituirla convertiria CAÑAS en CANAS:
      // los tres son apellidos distintos.
      //
      // Si la plataforma llega a rechazarla, el reporte de errores activa
      // `enyeComoN` y entonces si se sustituye por N, que es el menor daño.
      let v = sinTildes(s).toUpperCase().replace(/[^A-ZÑ0-9 ]/g, '');
      if (opciones.enyeComoN) v = enyeAN(v);
      if (campo.x?.cie10) v = v.replace(/ /g, '');
      v = v.trim().slice(0, campo.len);

      if (opciones.enyeComoN && /ñ/i.test(s)) {
        return {
          valor: v,
          nota: 'La plataforma rechazó la Ñ en este campo, así que se reemplaza por N',
        };
      }
      // Se avisa solo si se quito algo de verdad (tildes, simbolos), no por la
      // enye, que ahora se respeta.
      if (/[^\x00-\x7F]/.test(s.replace(/ñ/gi, ''))) {
        return {
          valor: v,
          nota: 'Se quitan tildes y caracteres especiales: el sistema no los admite en este campo',
        };
      }
      return { valor: v };
    }
  }
}
