// Utilidades de texto compartidas por todo el motor.

/**
 * Quita tildes y diacriticos, conservando la enye.
 *
 * El instructivo pide los nombres "sin tildes", y la enye no lo es: es una letra
 * del alfabeto español. Convertirla en N cambiaria el apellido de la paciente
 * (CAÑAS pasaria a leerse CANAS), asi que se respeta.
 */
export function sinTildes(s) {
  return String(s ?? '')
    // Se aparta la enye con marcadores temporales para que la descomposicion
    // Unicode no le quite la virgulilla junto con el resto de acentos.
    .replace(/ñ/g, '').replace(/Ñ/g, '')
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(//g, 'ñ').replace(//g, 'Ñ');
}

/**
 * Recorta y colapsa espacios repetidos.
 * Es la correccion mas frecuente: el validador compara texto exacto, asi que
 * un "NO " con espacio final se rechaza igual que un valor invalido.
 */
export function limpiar(s) {
  return String(s ?? '').replace(/\s+/g, ' ').trim();
}

/** Forma canonica para comparar contra un catalogo. */
export function canon(s) {
  return sinTildes(limpiar(s)).toUpperCase().replace(/[\s._-]/g, '');
}

/** Valores que significan "sin dato" y deben quedar como celda vacia. */
export const VACIO_EQUIV = new Set([
  '', 'NA', 'N/A', 'NOAPLICA', 'NINGUNO', 'NULL', 'NONE', '-', '.', 'SINDATO', 'SININFORMACION',
]);

export const esVacio = s => VACIO_EQUIV.has(canon(s));
