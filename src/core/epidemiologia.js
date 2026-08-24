// Calendario epidemiologico.
//
// Colombia (INS) usa el estandar MMWR: las semanas van de domingo a sabado y
// la semana 1 del año es la primera que contiene al menos cuatro dias de enero,
// es decir, la que contiene el primer miercoles de enero.
//
// Sirve para sugerir la semana del nombre del archivo cuando no se conoce.

const DIA = 86400000;

/** Miercoles de la semana (domingo a sabado) a la que pertenece la fecha. */
function miercolesDeLaSemana(fechaUTC) {
  const dow = fechaUTC.getUTCDay(); // 0 = domingo
  return new Date(fechaUTC.getTime() + (3 - dow) * DIA);
}

/** Primer miercoles de enero del año dado. */
function primerMiercoles(anio) {
  const ene1 = new Date(Date.UTC(anio, 0, 1));
  const desfase = ((3 - ene1.getUTCDay()) + 7) % 7;
  return new Date(Date.UTC(anio, 0, 1 + desfase));
}

/**
 * Semana epidemiologica de una fecha AAAA-MM-DD.
 * @returns {{semana: number, anio: number}|null} el año puede diferir del de la
 *          fecha en los bordes de diciembre y enero.
 */
export function semanaEpidemiologica(iso) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(iso || ''))) return null;

  const fecha = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(fecha.getTime())) return null;

  const mie = miercolesDeLaSemana(fecha);
  const anio = mie.getUTCFullYear();
  const semana = Math.floor((mie - primerMiercoles(anio)) / (7 * DIA)) + 1;

  return { semana, anio };
}
