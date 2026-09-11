// Normalizacion de una celda individual segun el tipo de campo del instructivo.
//
// Aqui solo se cambia la FORMA del dato: espacios, mayusculas, tildes, formato
// de fecha, separadores. Nunca el contenido. Si para cumplir el instructivo
// habria que adivinar, recortar o redondear algo, la celda se devuelve como no
// interpretable y pasa a revision manual.

import { limpiar, sinTildes, canon, esVacio } from './texto.js';
import { aCatalogo, MAPA_CAMPO } from './catalogos.js';
import * as fechas from './fechas.js';

/** Convierte texto a numero flotante tolerando coma decimal. */
export function aFloat(v) {
  const n = parseFloat(String(v ?? '').replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

/** "300ABC1234" no es un numero con adornos: es otro dato. */
const LETRAS_ENTRE_CIFRAS = /\d[^\d]*[A-Za-zÑñ][^\d]*\d/;

/**
 * A partir de cuantos digitos un guion intermedio se lee como separador.
 *
 * "300-123-4567" es un telefono y el guion sobra; "1-2" en un campo de partos
 * no es el numero 12. Siete digitos deja fuera cualquier cantidad del
 * instructivo (todas son de 1 o 2 cifras) y cubre telefonos, NIT y documentos.
 */
const LARGO_IDENTIFICADOR = 7;

/**
 * Extrae un numero de un texto sucio respetando el separador decimal que
 * exige el instructivo para ese campo.
 *
 * Devuelve null si leerlo exigiria cambiar la cifra: decimales en un campo
 * entero, mas decimales de los permitidos o letras entre los digitos.
 */
export function normalizarNumero(bruto, campo) {
  let s = limpiar(bruto).replace(/\s/g, '');
  if (!s || esVacio(s) || LETRAS_ENTRE_CIFRAS.test(s)) return null;

  const admiteDec = campo.x?.dec;
  const sep = campo.x?.sep_dec || '.';

  s = s.replace(/[^\d.,-]/g, '');

  // Un guion en medio de los digitos solo es separador en un identificador
  // largo (telefono, NIT). En una cantidad no significa nada, y borrarlo
  // convertiria "1-2" en 12: eso no es leer el numero, es inventarlo.
  if (/\d-/.test(s) && s.replace(/\D/g, '').length < LARGO_IDENTIFICADOR) return null;

  if (!admiteDec) {
    // Separador de miles (1.500) o decimales en cero (155,0): es la misma
    // cifra. Una parte decimal real no se puede redondear sin cambiar el dato.
    if (/^-?\d{1,3}([.,]\d{3})+$/.test(s)) s = s.replace(/[.,]/g, '');
    else if (/^-?\d+[.,]0+$/.test(s)) s = s.replace(/[.,]0+$/, '');
    if (/[.,]/.test(s)) return null;
  }

  const corte = Math.max(s.lastIndexOf(','), s.lastIndexOf('.'));

  let entero = s, decimal = '';
  if (corte >= 0) {
    entero = s.slice(0, corte).replace(/[.,]/g, '');
    decimal = s.slice(corte + 1).replace(/[.,]/g, '').replace(/0+$/, '');
  }

  const neg = entero.startsWith('-');
  entero = entero.replace(/-/g, '');
  if (!entero && !decimal) return null;

  const ndec = campo.x?.ndec;
  if (ndec !== undefined) {
    if (decimal.length > ndec) return null;
    decimal = decimal.padEnd(ndec, '0');
  }

  let out = entero || '0';
  if (decimal) out += sep + decimal;
  return (neg ? '-' : '') + out;
}

/** Explica por que un numero no se pudo leer sin alterarlo. */
function errorNumero(original, campo) {
  const s = limpiar(original).replace(/\s/g, '');
  if (LETRAS_ENTRE_CIFRAS.test(s)) return `Tiene letras entre los números: "${original}"`;
  if (/\d-/.test(s) && s.replace(/\D/g, '').length < LARGO_IDENTIFICADOR) {
    return `Tiene un guion entre los números: "${original}". Quitarlo cambiaría la cifra`;
  }
  if (!campo.x?.dec && /\d[.,]\d/.test(s)) {
    return `Solo admite números enteros y trae decimales: "${original}"`;
  }
  const ndec = campo.x?.ndec;
  if (ndec !== undefined && new RegExp(`[.,]\\d{${ndec + 1},}$`).test(s)) {
    return `Admite máximo ${ndec} decimal y trae más: "${original}". Redondearlo cambiaría el dato`;
  }
  return `Número no interpretable: "${original}"`;
}

/**
 * Sustituye la enye por N.
 *
 * Solo se usa cuando la plataforma ya rechazo el archivo por ese motivo y la
 * usuaria confirma el cambio: por defecto la enye se conserva, porque forma
 * parte del apellido (CAÑAS y CANAS son apellidos distintos).
 */
const enyeAN = s => String(s).replace(/ñ/g, 'n').replace(/Ñ/g, 'N');

/** Mayusculas, sin tildes ni caracteres especiales, pero con enye. */
function textoLibre(s, opciones) {
  let v = sinTildes(s).toUpperCase().replace(/[^A-ZÑ0-9 ]/g, '');
  if (opciones.enyeComoN) v = enyeAN(v);
  return v.replace(/ {2,}/g, ' ').trim();
}

/**
 * Normaliza una celda.
 * Devuelve { valor } con el texto ya conforme, o { valor: null, error } cuando
 * el contenido no es interpretable sin alterarlo y requiere revision humana.
 *
 * @param {object} opciones  `enyeComoN` convierte la enye en N (ver `enyeAN`).
 */
export function normalizarCelda(bruto, campo, opciones = {}) {
  const original = String(bruto ?? '');
  const s = limpiar(original);

  // NONE es "sin dato" en general, pero en Nombre 2 y Apellido 2 es justo el
  // valor que pide el instructivo: se conserva.
  if (campo.x?.vacio_como && canon(s) === campo.x.vacio_como) return { valor: campo.x.vacio_como };
  if (!s || esVacio(s)) return { valor: '' };

  switch (campo.tipo) {
    case 'F': {
      const f = fechas.normalizar(s, opciones.ordenFecha);
      if (!f) return { valor: null, error: `Fecha no interpretable: "${original}"` };
      // Si el archivo venia en mes/dia, conviene que quede dicho en el reporte:
      // es el unico caso en que dos lecturas de la misma celda darian fechas
      // distintas, y quien revise debe poder comprobarlo.
      if (opciones.ordenFecha === 'mdy' && /^\d{1,2}[-/.]\d{1,2}[-/.]\d{4}/.test(s)) {
        return { valor: f, nota: `El archivo viene en formato mes/dia/año: "${original}" es ${f}` };
      }
      return { valor: f };
    }

    case 'T': {
      if (!campo.vals) {
        // Catalogo abierto (nombre de la IPS)
        let v = textoLibre(s, opciones);
        if (campo.x?.sin_espacios) v = v.replace(/ /g, '');
        return { valor: v };
      }
      const v = aCatalogo(s, campo.vals, campo.key);
      if (v !== null) return { valor: v };

      const c = canon(s);
      // La plataforma documento que en estos campos "no se realizo" se
      // registra con la celda vacia ("vacio en caso que no aplique"), aunque
      // el instructivo los describa como SI/NO.
      if (campo.x?.no_realizado_vacio && ['NO', 'N', 'NINGUNO'].includes(c)) {
        return { valor: '', nota: `"${original}" indica que no se realizó: la plataforma lo exige vacío` };
      }
      if (['ALTO', 'BAJO'].includes(c) && campo.vals.includes('SI')) {
        return {
          valor: null,
          error: `"${original}" es un nivel de riesgo, pero este campo solo admite SI o NO`,
        };
      }
      if (['NO', 'N'].includes(c)) {
        return {
          valor: null,
          error: `"${original}" no está entre los valores permitidos (${campo.vals.join(', ')}). ` +
                 'Si el examen no se hizo, deja la celda vacía',
        };
      }
      return {
        valor: null,
        error: `Valor fuera del catálogo: "${original}". Permitidos: ${campo.vals.join(', ')}`,
      };
    }

    case 'N': {
      // El instructivo indica que una carga viral indetectable se registra
      // como cero, no como texto ni como celda vacia.
      if (campo.x?.indetectable_cero &&
          ['INDETECTABLE', 'NODETECTABLE', 'ND', 'NODETECTADO'].includes(canon(s))) {
        return { valor: '0', nota: `"${original}" se registra como 0, según el instructivo` };
      }
      if (campo.vals) {
        const directo = campo.vals.find(x => x === s || +x === +s);
        if (directo !== undefined) return { valor: directo };

        const mapa = MAPA_CAMPO[campo.key];
        if (mapa && mapa[canon(s)] !== undefined) {
          return {
            valor: mapa[canon(s)],
            nota: `"${original}" corresponde al código ${mapa[canon(s)]} del instructivo`,
          };
        }

        const num = normalizarNumero(s, campo);
        if (num !== null) {
          const match = campo.vals.find(x => +x === +num);
          if (match !== undefined) return { valor: match };
        }
        return {
          valor: null,
          error: `Código no permitido: "${original}". Permitidos: ${campo.vals.join(', ')}`,
        };
      }
      const n = normalizarNumero(s, campo);
      if (n === null) return { valor: null, error: errorNumero(original, campo) };
      return { valor: campo.x?.zfill ? n.padStart(campo.len, '0') : n };
    }

    default: { // 'A'
      if (campo.x?.solo_digitos) {
        // Se quitan separadores, no letras: un pasaporte trae letras y
        // quitarlas daria otro numero de documento.
        const d = s.replace(/[\s.,-]/g, '');
        if (!/^\d+$/.test(d)) return { valor: null, error: `Solo admite números: "${original}"` };
        return { valor: d };
      }
      if (campo.x?.dec) {
        const n = normalizarNumero(s, campo);
        if (n === null) return { valor: null, error: errorNumero(original, campo) };
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
      // Si la plataforma llega a rechazarla, el reporte de errores ofrece
      // `enyeComoN` y, si la usuaria lo confirma, se sustituye por N.
      let v = textoLibre(s, opciones);
      if (campo.x?.cie10) v = v.replace(/ /g, '');

      if (opciones.enyeComoN && /ñ/i.test(s)) {
        return {
          valor: v,
          nota: 'La plataforma rechazó la Ñ en este campo y se confirmó reemplazarla por N',
        };
      }
      // Se avisa solo si se quito algo de verdad (tildes, simbolos), no por la
      // enye, que se respeta.
      if (/[^\x00-\x7F]/.test(s.replace(/ñ/gi, ''))) {
        return {
          valor: v,
          nota: 'Se quitan tildes y caracteres especiales: el instructivo no los admite en este campo',
        };
      }
      return { valor: v };
    }
  }
}
