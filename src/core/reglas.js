// Reglas de coherencia entre campos.
//
// Criterio estricto: el corrector NO cambia datos. Por su cuenta solo hace dos
// cosas, y ambas estan escritas en el instructivo:
//
//   - Llenar una celda VACIA con el codigo que el instructivo prescribe
//     textualmente para esa situacion ("Si no tiene colocar NONE", "Si no
//     aplica registrar 1845-01-01", "Sifilis confirmada NO: 4").
//
//   - Vaciar una celda que solo trae la fecha centinela 1845-01-01 donde el
//     instructivo exige la celda vacia. No se pierde nada: las dos formas
//     dicen "no aplica".
//
// Todo lo demas —un dato que contradice a otro, una suma que no cuadra, una
// fecha imposible, un campo obligatorio en blanco— se REPORTA con el motivo y,
// cuando la hay, una sugerencia. La decision la toma una persona.

import { CAMPOS, POR_KEY } from './esquema.js';
import { aFloat } from './normalizar.js';
import * as fechas from './fechas.js';

export const NA_FECHA = fechas.NA_FECHA;

/** Evalua una condicion de obligatoriedad declarada en el esquema. */
export function cumple(cond, fila) {
  if (!cond) return true;
  const [tipo, key, vals] = cond;
  const v = fila[key];
  if (tipo === 'lleno') return v !== undefined && v !== '';
  if (tipo === 'igual') return vals.some(x => String(x) === String(v));
  return true;
}

/** Lee una condicion del esquema en lenguaje llano. */
function describir([tipo, key, vals]) {
  const nombre = POR_KEY[key].nombre;
  if (tipo === 'lleno') return `${nombre} tiene dato`;
  const lista = vals.length > 3 ? `${vals[0]} a ${vals.at(-1)}` : vals.join(' o ');
  return `${nombre} es ${lista}`;
}

// ---------------------------------------------------------------------------
// Codigos que el instructivo prescribe para una celda vacia
// ---------------------------------------------------------------------------

/**
 * Fechas obligatorias para las que el instructivo dice que registrar cuando no
 * hay dato. Se cita el texto literal en el reporte de correcciones.
 */
const FECHAS_SIN_DATO = {
  fecha_anticonceptivo: 'Si no aplica registrar 1845-01-01',
  fecha_tamizaje_vih_parto:
    'Si no ha llegado al momento del parto o no se le realiza, registrar 1845-01-01',
  fecha_asa: 'Si no aplica o no se suministra registrar 1845-01-01',
  seguimiento_posevento1: 'Si no aplica o no se realiza seguimiento registrar 1845-01-01',
  seguimiento_posevento2: 'Si no aplica o no se realiza seguimiento registrar 1845-01-01',
  seguimiento_posevento3: 'Si no aplica o no se realiza seguimiento registrar 1845-01-01',
  seguimiento_posevento4: 'Si no aplica o no se realiza seguimiento registrar 1845-01-01',
};

/**
 * Completa las celdas vacias cuyo valor de "no aplica" fija el instructivo.
 * Una celda con dato nunca se sobrescribe: si contradice la regla, se reporta.
 */
export function aplicarCentinelas(fila, add, pend) {
  /** Llena solo si esta vacia. Devuelve si la lleno. */
  const llenar = (key, valor, cita) => {
    if (fila[key]) return false;
    add(key, valor, `Sin dato. El instructivo indica: «${cita}»`);
    fila[key] = valor;
    return true;
  };

  // Chagas: la fecha 1845-01-01 y "NO SE REALIZA TAMIZAJE" van juntas.
  if (fila.chagas === 'NO SE REALIZA TAMIZAJE') {
    if (!llenar('fecha_chagas', NA_FECHA, 'No se realiza tamizaje: 1845-01-01')
        && fila.fecha_chagas !== NA_FECHA) {
      pend('fecha_chagas',
        `Diagnóstico de Chagas dice "NO SE REALIZA TAMIZAJE", pero hay fecha de tamizaje (${fila.fecha_chagas}). ` +
        'Si el tamizaje se hizo, registra su resultado en el diagnóstico; si no, la fecha es 1845-01-01',
        'incoherente', NA_FECHA);
    }
  } else if (fila.fecha_chagas === NA_FECHA && fila.chagas) {
    pend('fecha_chagas',
      `El diagnóstico de Chagas es ${fila.chagas}, así que hubo tamizaje, pero la fecha es 1845-01-01 ` +
      '(que significa "no se realiza"). Registra la fecha real del tamizaje');
  }

  // Sifilis: los codigos de "no aplica" solo van con sifilis no confirmada.
  const TRATAMIENTOS = [
    ['tratamiento_sifilis', '4', '1, 2 o 3'],
    ['tratamiento_sifilis_pareja', '3', '1 o 2'],
  ];
  for (const [key, na, validos] of TRATAMIENTOS) {
    if (fila.sifilis_confirmada === 'NO') {
      if (llenar(key, na, `Sífilis gestacional confirmada es NO: ${na}: NA`)) continue;
      if (fila[key] !== na) {
        pend(key,
          `Sífilis gestacional confirmada es NO, y en ese caso el instructivo solo admite ${na} (no aplica); ` +
          `el archivo trae ${fila[key]}. Si la sífilis sí está confirmada, corrige ese campo a SI`,
          'incoherente', na);
      }
    } else if (fila.sifilis_confirmada === 'SI' && fila[key] === na) {
      pend(key,
        `Con sífilis confirmada el valor es ${validos}; el ${na} (no aplica) es solo para sífilis no confirmada`);
    }
  }

  // Causa de muerte: 4 si la madre no fallecio; 1, 2 o 3 si fallecio.
  if (fila.vitalidad_madre === '1' || fila.vitalidad_madre === '3') {
    if (!llenar('causa_muerte', '4', '4: La persona no ha fallecido') && fila.causa_muerte !== '4') {
      pend('causa_muerte',
        `La vitalidad de la madre es ${fila.vitalidad_madre} (no ha fallecido), y en ese caso la causa de ` +
        `muerte es 4; el archivo trae ${fila.causa_muerte}. Revisa cuál de los dos está mal`,
        'incoherente', '4');
    }
  } else if (fila.vitalidad_madre === '2' && ['4', '55'].includes(fila.causa_muerte)) {
    pend('causa_muerte', 'La madre falleció (vitalidad 2): la causa de muerte debe ser 1, 2 o 3');
  }

  for (const [key, cita] of Object.entries(FECHAS_SIN_DATO)) llenar(key, NA_FECHA, cita);

  // La fecha de salida solo lleva centinela si hubo aborto.
  if (fila.via_terminacion === 'ABORTO') {
    llenar('fecha_salida_parto', NA_FECHA, 'Si la vía de terminación fue aborto, registrar 1845-01-01');
  }

  for (const key of ['nombre2', 'apellido2']) llenar(key, 'NONE', 'Si no tiene colocar NONE');

  // El tipo de caso vacio no se da por 21: el archivo no dice si la gestante
  // tiene o no alguna de las caracteristicas 1 a 12. Se sugiere, no se asume.
  if (!fila.tipo_caso) {
    pend('tipo_caso',
      'Falta el tipo de caso. Si la gestante no tiene ninguna de las características 1 a 12, ' +
      'el instructivo usa el código 21 (no tiene tipo de caso)',
      'falta', '21');
  }
}

/**
 * Campos que solo se diligencian si otro cumple una condicion.
 *
 * Si el campo trae la centinela 1845-01-01 se vacia (dice lo mismo). Si trae
 * un dato real, no se borra: puede que el dato este bien y lo que falle sea el
 * campo del que depende (un diagnostico en Diag3 con Riesgo BAJO puede
 * significar que el riesgo era ALTO).
 */
export function limpiarNoAplicables(fila, add, pend) {
  for (const c of CAMPOS) {
    if (c.req !== 'COND' || !c.x?.cond) continue;
    if (cumple(c.x.cond, fila) || !fila[c.key]) continue;

    const padre = POR_KEY[c.x.cond[1]];
    const actual = fila[padre.key] || 'vacío';

    if (fila[c.key] === NA_FECHA) {
      add(c.key, '',
        `1845-01-01 significa "no aplica", y el instructivo pide aquí la celda vacía porque ` +
        `${padre.nombre} es "${actual}"`);
      fila[c.key] = '';
      continue;
    }
    pend(c.key,
      `Solo se diligencia si ${describir(c.x.cond)}, y ${padre.nombre} es "${actual}". ` +
      `Si este dato es correcto, corrige ${padre.nombre}; si no, deja este campo vacío`);
  }
}

// ---------------------------------------------------------------------------
// Coherencias entre campos: se reportan, no se corrigen
// ---------------------------------------------------------------------------

export function aplicarCruzadas(fila, add, pend) {
  // Gravida = embarazo actual + partos + cesareas + abortos + ectopicos
  const partes = ['partos', 'cesareas', 'abortos', 'ectopicos'].map(k => aFloat(fila[k]) ?? 0);
  const esperado = String(partes.reduce((a, b) => a + b, 0) + 1);
  if (fila.gravida !== esperado) {
    pend('gravida', fila.gravida
      ? `El instructivo define grávida = embarazo actual + partos + cesáreas + abortos + ectópicos, ` +
        `que aquí da ${esperado}, y el archivo dice ${fila.gravida}. Revisa si el error está en la ` +
        'grávida o en alguno de esos campos'
      : `Falta la grávida. Con los antecedentes registrados (embarazo actual + partos + cesáreas + ` +
        `abortos + ectópicos) sería ${esperado}`,
      fila.gravida ? 'incoherente' : 'falta', esperado);
  }

  // Vivos + muertos no puede superar grabida.
  const vm = (aFloat(fila.vivos) ?? 0) + (aFloat(fila.muertos) ?? 0);
  const g = aFloat(fila.gravida);
  if (g !== null && vm > g) {
    pend('vivos', `Vivos + muertos (${vm}) supera la grávida (${g}); revisar antecedentes obstétricos`);
  }

  revisarFumImposible(fila, pend);

  // FPP: el instructivo la exige posterior a la FUM, hasta 42 semanas despues.
  if (fila.fum) {
    const naegele = fechas.sumarDias(fila.fum, 280);
    if (!fila.fpp) {
      pend('fpp',
        `Falta la FPP. Por la regla de Naegele (FUM + 280 días) sería ${naegele}; ` +
        'confírmala con la historia clínica',
        'falta', naegele);
    } else {
      const d = fechas.difDias(fila.fpp, fila.fum);
      if (d <= 0 || d > 294) {
        pend('fpp',
          `La FPP (${fila.fpp}) queda a ${d} días de la FUM (${fila.fum}); debe ser posterior y dentro ` +
          `de las 42 semanas siguientes. Por Naegele sería ${naegele}. Revisa si el error está en la ` +
          'FPP o en la FUM',
          'incoherente', naegele);
      }
    }
  }

  // Un resultado de VIH no puede coexistir con el rechazo de la prueba.
  for (const n of [1, 2, 3]) {
    const b = BLOQUE_VIH(n);
    if (fila[b.acepta] === 'NO' && fila[b.resultado]) {
      pend(b.resultado,
        `La gestante no aceptó la prueba (${POR_KEY[b.acepta].nombre} = NO), pero hay resultado. ` +
        'Si sí la aceptó, corrige ese campo a SI; si no, deja vacíos el resultado y su fecha');
    }
  }

  // El resultado de sifilis se expresa distinto segun el tipo de estudio:
  // POSITIVO/NEGATIVO para prueba rapida, REACTIVO/NO REACTIVO para VDRL.
  // Pasar de uno a otro no cambia el resultado, solo la palabra.
  const EQUIV = {
    POSITIVO: 'REACTIVO', NEGATIVO: 'NO REACTIVO',
    REACTIVO: 'POSITIVO', 'NO REACTIVO': 'NEGATIVO',
  };
  for (const [tipo, res] of [
    ['tipo_estudio_sifilis1', 'vdrl1'],
    ['tipo_estudio_sifilis2', 'vdrl2'],
    ['tipo_estudio_sifilis3', 'vdrl3'],
  ]) {
    if (!fila[tipo] || !fila[res]) continue;
    const admitidos = fila[tipo] === 'VDRL' ? ['REACTIVO', 'NO REACTIVO'] : ['POSITIVO', 'NEGATIVO'];
    if (admitidos.includes(fila[res])) continue;

    const v = EQUIV[fila[res]];
    if (v && admitidos.includes(v)) {
      add(res, v, `Mismo resultado con la palabra que el instructivo usa para ${fila[tipo]}: ${v}`, 'formato');
      fila[res] = v;
    } else {
      pend(res, `El resultado "${fila[res]}" no corresponde al tipo de estudio ${fila[tipo]}`);
    }
  }

  revisarTrimestreVih(fila, pend);
  revisarControlesDuplicados(fila, pend);
}

/**
 * Contrasta la FUM con la semana gestacional registrada al ingreso.
 *
 * Solo se llama cuando alguna fecha de la fila quedo fuera de orden, porque una
 * FUM equivocada suele ser la causa raiz de esos conflictos. Pequenas
 * discrepancias que el validador acepta no se reportan: darian trabajo sin
 * evitar ningun rechazo.
 */
export function verificarFum(fila, pend) {
  const semana = aFloat(fila.semana_gestacional);
  const ingreso = fila.fecha_ingreso_programa;
  if (!fila.fum || !ingreso || semana === null) return;

  const esperada = fechas.sumarDias(ingreso, -Math.round(semana * 7));
  const desfase = Math.abs(fechas.difDias(fila.fum, esperada)) / 7;

  // Se tolera algo de holgura: la semana gestacional suele venir redondeada
  // y puede corresponder a una fecha de atencion algo distinta a la de ingreso.
  if (desfase > 3) {
    pend('fum',
      `La FUM (${fila.fum}) no concuerda con la semana gestacional ${semana} registrada al ingreso del ${ingreso}, que corresponderia a una FUM cercana al ${esperada}. Verificar la FUM en la historia clinica: de ella dependen la FPP y las demas fechas`);
  }
}

/**
 * Señala la FUM imposible: una gestacion de mas de 42 semanas a la fecha de
 * atencion, o una FUM posterior a la atencion.
 *
 * No se reconstruye: de la FUM dependen la FPP, la edad gestacional y todas
 * las validaciones de fechas. Se sugiere la que corresponde a la semana
 * gestacional registrada, para cotejarla con la historia clinica.
 */
function revisarFumImposible(fila, pend) {
  const semana = aFloat(fila.semana_gestacional);
  const referencia = fila.fecha_ingreso_programa || fila.fecha_ingreso_riamp;
  if (!fila.fum || !referencia || semana === null || semana <= 0) return;

  const semanasReales = fechas.difDias(referencia, fila.fum) / 7;
  if (semanasReales <= 42 && semanasReales >= 0) return;

  const derivada = fechas.sumarDias(referencia, -Math.round(semana * 7));
  pend('fum',
    `La FUM ${fila.fum} implica ${semanasReales.toFixed(1)} semanas de gestación al ${referencia}, ` +
    `imposible en un embarazo. Con la semana gestacional registrada (${semana}) sería ${derivada}. ` +
    'Verifícala en la historia clínica',
    'incoherente', derivada);
}

/** Campos que forman el bloque de tamizaje de VIH de cada trimestre. */
const BLOQUE_VIH = n => ({
  pre: `fecha_asesoria_pre_vih${n}`,
  acepta: `acepta_prueba_vih${n}`,
  post: `fecha_asesoria_post_vih${n}`,
  resultado: `resultado_vih${n}`,
  fecha: `fecha_prueba_vih${n}`,
});

/** Trimestre gestacional al que corresponde una fecha, contando desde la FUM. */
function trimestreDe(fecha, fum) {
  const sem = fechas.difDias(fecha, fum) / 7;
  if (sem < 0) return null;
  if (sem < 14) return 1;
  if (sem < 28) return 2;
  return 3;
}

/**
 * Señala el tamizaje de VIH reportado en las columnas de otro trimestre.
 *
 * El validador comprueba que la prueba del trimestre 1 se haya tomado en el
 * trimestre 1. Cuando la fecha cae mas adelante, lo mas probable es que el dato
 * este en la columna equivocada, pero tambien puede estar mal la fecha o la
 * FUM: se indica a donde iria y lo decide una persona.
 */
function revisarTrimestreVih(fila, pend) {
  if (!fila.fum) return;

  for (const origen of [1, 2, 3]) {
    const o = BLOQUE_VIH(origen);
    if (!fila[o.fecha]) continue;

    const destino = trimestreDe(fila[o.fecha], fila.fum);
    if (destino === null) {
      pend(o.fecha, `La fecha es anterior a la FUM (${fila.fum})`);
      continue;
    }
    if (destino === origen) continue;

    const sem = (fechas.difDias(fila[o.fecha], fila.fum) / 7).toFixed(1);
    const ocupado = Object.values(BLOQUE_VIH(destino)).some(k => fila[k]);
    pend(o.fecha,
      `La prueba se tomó en la semana ${sem}, que es del trimestre ${destino}, pero está en las ` +
      `columnas del trimestre ${origen}. ` +
      (ocupado
        ? `El trimestre ${destino} ya tiene datos: revisa cuál prueba va en cada uno`
        : `Si la fecha es correcta, pasa las cinco columnas de VIH ${origen} a las de VIH ${destino}`));
  }
}

/** Series de controles donde cada fecha debe ser posterior a la anterior. */
const SERIES_CONTROL = [
  ['control_gineco1', 'control_gineco2', 'control_gineco3', 'control_gineco4',
   'control_gineco5', 'control_gineco6', 'control_gineco7'],
  ['primera_vez_med_general', 'control2_med_general'],
  ['control_nutricion1', 'control_nutricion2'],
  ['control_psicologia1', 'control_psicologia2'],
  ['control_perinatologo1', 'control_perinatologo2'],
  ['control_enfermeria1', 'control_enfermeria2', 'control_enfermeria3'],
  ['fecha_curso_paternidad1', 'fecha_curso_paternidad2', 'fecha_curso_paternidad3',
   'fecha_curso_paternidad4', 'fecha_curso_paternidad5', 'fecha_curso_paternidad6',
   'fecha_curso_paternidad7'],
];

/**
 * Señala controles con la misma fecha que otro anterior de su serie.
 *
 * El validador exige cada control posterior al anterior. Lo habitual es que
 * sea la misma atencion digitada dos veces, pero no se borra: se sugiere
 * dejarlo vacio y lo confirma una persona.
 */
function revisarControlesDuplicados(fila, pend) {
  for (const serie of SERIES_CONTROL) {
    for (let i = 1; i < serie.length; i++) {
      const actual = serie[i];
      if (!fila[actual]) continue;

      const previo = serie.slice(0, i).find(k => fila[k] && fila[k] === fila[actual]);
      if (!previo) continue;

      pend(actual,
        `Tiene la misma fecha (${fila[actual]}) que ${POR_KEY[previo].nombre}, y cada control debe ser ` +
        'posterior al anterior. Si es la misma atención registrada dos veces, deja vacío este control ' +
        'y su tipo de consulta',
        'incoherente', '');
    }
  }
}

// ---------------------------------------------------------------------------
// Verificaciones que solo reportan
// ---------------------------------------------------------------------------

/**
 * Orden cronologico y fechas futuras.
 *
 * La comparacion permite que dos fechas coincidan, salvo en los controles
 * secuenciales de un mismo profesional (`sec`), donde el validador si exige que
 * cada control sea estrictamente posterior al anterior. Atenciones distintas
 * hechas el mismo dia son normales y el sistema no las rechaza, asi que
 * marcarlas produciria ruido.
 */
export function verificarFechas(fila, pend) {
  const hoy = fechas.hoy();
  for (const c of CAMPOS) {
    const v = fila[c.key];
    if (c.tipo !== 'F' || !v || v === NA_FECHA) continue;

    if (c.x?.no_futura && v > hoy) {
      pend(c.key, `La fecha ${v} es posterior a hoy (${hoy})`);
    }

    const estricto = c.x?.sec === true;
    for (const otro of c.x?.mayor_que || []) {
      const w = fila[otro];
      if (!w || w === NA_FECHA) continue;
      if (estricto ? v <= w : v < w) {
        pend(c.key, `Debe ser posterior a ${POR_KEY[otro].nombre} (${w}) y vale ${v}`);
      }
    }
    for (const otro of c.x?.menor_que || []) {
      const w = fila[otro];
      if (!w || w === NA_FECHA) continue;
      if (estricto ? v >= w : v > w) {
        pend(c.key, `Debe ser anterior a ${POR_KEY[otro].nombre} (${w}) y vale ${v}`);
      }
    }
  }
}

/** Rangos minimo y maximo declarados en el instructivo. */
export function verificarRangos(fila, pend) {
  for (const c of CAMPOS) {
    const v = fila[c.key];
    if (!v || c.vals) continue;
    const n = aFloat(v);
    if (n === null) continue;
    if (c.x?.min !== undefined && n < c.x.min) {
      pend(c.key, `${n} es menor que el minimo permitido (${c.x.min})`);
    }
    if (c.x?.max !== undefined && n > c.x.max) {
      pend(c.key, `${n} supera el maximo permitido (${c.x.max})`);
    }
  }
}

/**
 * Longitud maxima del instructivo.
 *
 * Se omiten los campos de catalogo y con decimales: en 14 de ellos la longitud
 * declarada choca con los propios valores permitidos (Riesgo: 2, pero admite
 * ALTO) y ahi manda el catalogo. Ver README, "Discrepancias del instructivo".
 */
export function verificarLongitudes(fila, pend) {
  for (const c of CAMPOS) {
    const v = fila[c.key];
    if (!v || c.vals || c.x?.dec || c.tipo === 'F') continue;
    if (v.length > c.len) {
      pend(c.key,
        `Tiene ${v.length} caracteres y el instructivo permite máximo ${c.len}. ` +
        'No se recorta: habría que decidir qué parte sobra');
    }
  }
}

/** Campos obligatorios que quedaron sin dato. */
export function verificarObligatorios(fila, pend) {
  for (const c of CAMPOS) {
    if (fila[c.key]) continue;
    const obligatorio = c.req === 'SI' || (c.req === 'COND' && cumple(c.x?.cond, fila));
    if (!obligatorio) continue;

    pend(c.key, c.req === 'COND'
      ? `Obligatorio porque ${POR_KEY[c.x.cond[1]].nombre} es "${fila[c.x.cond[1]] || 'vacio'}"`
      : 'Campo obligatorio sin dato', 'falta');
  }
}
