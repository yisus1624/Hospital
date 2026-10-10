// Tabla de referencia CIE-10 de SISPRO (web.sispro.gov.co).
//
// El instructivo pide los diagnosticos segun esa tabla, y la plataforma los
// cruza contra ella ("no coincide con los codigos EDIA_DIAGNOSTICO"). Mientras
// la tabla no se haya cargado, CODIGOS es null y solo se comprueba el formato
// del codigo. Para cargarla:
//
//   node tools/generar-cie10.mjs TablaReferencia_CIE10.csv
//
// que reescribe este archivo con todos los codigos de la tabla.

export const CODIGOS = null;
