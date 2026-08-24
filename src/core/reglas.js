// Reglas de coherencia entre campos.
//
// Separadas en dos grupos segun un criterio estricto:
//
//   - Las que se CORRIGEN: el valor correcto queda determinado por el propio
//     instructivo o por otro campo del registro (centinelas, codigos de "no
//     aplica", sumatorias, campos que no aplican y deben ir vacios).
//
//   - Las que solo se REPORTAN: exigen un dato clinico que no esta en el
//     archivo. Inventarlo produciria un reporte aceptado por el sistema pero
//     falso, asi que se listan para diligenciarlos a mano.

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

// ---------------------------------------------------------------------------
// Correcciones deterministas
// ---------------------------------------------------------------------------

/**
 * Completa los campos obligatorios cuyo valor de "no aplica" esta definido
 * por el instructivo o por el mensaje de error del validador.
 */
export function aplicarCentinelas(fila, add) {
  const set = (key, valor, motivo) => {
    if (fila[key] !== valor) { add(key, valor, motivo); fila[key] = valor; }
  };

  // Chagas: la fecha 1845-01-01 y "NO SE REALIZA TAMIZAJE" son equivalentes.
  // El validador rechaza cualquier combinacion distinta.
  if (fila.chagas === 'NO SE REALIZA TAMIZAJE') {
    set('fecha_chagas', NA_FECHA,
      'Chagas sin tamizaje: el sistema exige la fecha centinela 1845-01-01');
  } else if (fila.fecha_chagas === NA_FECHA && fila.chagas) {
    set('chagas', 'NO SE REALIZA TAMIZAJE',
      'La fecha de Chagas es 1845-01-01, que el sistema solo admite con "NO SE REALIZA TAMIZAJE"');
  }

  // Sifilis: si no esta confirmada, los codigos de tratamiento son los de NA.
  if (fila.sifilis_confirmada === 'NO') {
    set('tratamiento_sifilis', '4', 'Sifilis no confirmada: tratamiento con codigo 4 (no aplica)');
    set('tratamiento_sifilis_pareja', '3',
      'Sifilis no confirmada: tratamiento de la pareja con codigo 3 (no aplica)');
  }

  // Causa de muerte: si la madre no fallecio, el unico valor admitido es 4.
  if (fila.vitalidad_madre === '1' || fila.vitalidad_madre === '3') {
    set('causa_muerte', '4', 'La madre no ha fallecido: causa de muerte 4');
    if (fila.fecha_muerte) {
      set('fecha_muerte', '', 'La madre no ha fallecido: se vacia la fecha de muerte');
    }
  }

  // Tipo de caso vacio equivale a "no tiene tipo de caso" (21). Esto ademas
  // libera los nueve campos de seguimiento, que solo aplican para casos 1 a 12.
  if (!fila.tipo_caso) {
    set('tipo_caso', '21',
      'Tipo de caso sin diligenciar: se registra 21 (no tiene tipo de caso)');
  }

  // Fechas obligatorias con centinela explicito en el instructivo.
  for (const key of ['fecha_anticonceptivo', 'fecha_tamizaje_vih_parto', 'fecha_asa',
    'seguimiento_posevento1', 'seguimiento_posevento2', 'seguimiento_posevento3',
    'seguimiento_posevento4']) {
    if (!fila[key]) {
      set(key, NA_FECHA,
        `${POR_KEY[key].nombre}: sin dato, el instructivo indica registrar 1845-01-01`);
    }
  }

  // La fecha de salida solo lleva centinela si hubo aborto. Si no hay via de
  // terminacion registrada, el campo no aplica y lo vacia limpiarNoAplicables.
  if (fila.via_terminacion === 'ABORTO' && !fila.fecha_salida_parto) {
    set('fecha_salida_parto', NA_FECHA,
      'Via de terminacion ABORTO: el instructivo indica registrar 1845-01-01');
  }

  // Segundo nombre y segundo apellido ausentes se registran como NONE.
  for (const key of ['nombre2', 'apellido2']) {
    if (!fila[key]) {
      set(key, 'NONE', `${POR_KEY[key].nombre} sin dato: el instructivo exige NONE`);
    }
  }
}

/** Vacia los campos cuya condicion de aplicabilidad no se cumple. */
export function limpiarNoAplicables(fila, add) {
  for (const c of CAMPOS) {
    if (c.req !== 'COND' || !c.x?.cond) continue;
    if (cumple(c.x.cond, fila) || !fila[c.key]) continue;
    const padre = POR_KEY[c.x.cond[1]];
    add(c.key, '',
      `No aplica porque ${padre.nombre} es "${fila[padre.key] || 'vacio'}": el sistema lo exige vacio`);
    fila[c.key] = '';
  }
}

/** Recalculos y coherencias entre campos. */
export function aplicarCruzadas(fila, add, pend, opciones) {
  // Grabida = partos + cesareas + abortos + ectopicos + embarazo actual
  const partes = ['partos', 'cesareas', 'abortos', 'ectopicos'].map(k => aFloat(fila[k]) ?? 0);
  const esperado = String(partes.reduce((a, b) => a + b, 0) + 1);
  if (fila.gravida !== esperado) {
    add('gravida', esperado,
      `Recalculada: partos+cesareas+abortos+ectopicos+1 = ${esperado} (venia "${fila.gravida || 'vacio'}")`);
    fila.gravida = esperado;
  }

  // Vivos + muertos no puede superar grabida: es dato clinico, solo se reporta.
  const vm = (aFloat(fila.vivos) ?? 0) + (aFloat(fila.muertos) ?? 0);
  const g = aFloat(fila.gravida);
  if (g !== null && vm > g) {
    pend('vivos', `Vivos + muertos (${vm}) supera grabida (${g}); revisar antecedentes obstetricos`);
  }

  corregirFumImposible(fila, add);

  // FPP: el validador la exige entre la FUM y 42 semanas despues.
  if (fila.fum) {
    if (!fila.fpp) {
      const nueva = fechas.sumarDias(fila.fum, 280);
      add('fpp', nueva, 'FPP vacia: calculada como FUM + 280 dias (regla de Naegele)');
      fila.fpp = nueva;
    } else {
      const d = fechas.difDias(fila.fpp, fila.fum);
      if (d <= 0 || d > 294) {
        const nueva = fechas.sumarDias(fila.fum, 280);
        add('fpp', nueva,
          `FPP incoherente (${d} dias desde la FUM, el maximo es 294). Recalculada: FUM + 280 dias`);
        fila.fpp = nueva;
      }
    }
  }

  // Un resultado de VIH no puede coexistir con el rechazo de la prueba.
  for (const [acepta, res, fecha] of [
    ['acepta_prueba_vih1', 'resultado_vih1', 'fecha_prueba_vih1'],
    ['acepta_prueba_vih2', 'resultado_vih2', 'fecha_prueba_vih2'],
    ['acepta_prueba_vih3', 'resultado_vih3', 'fecha_prueba_vih3'],
  ]) {
    if (fila[acepta] === 'NO' && fila[res]) {
      add(res, '', `Se vacia el resultado porque ${POR_KEY[acepta].nombre} es NO`);
      fila[res] = '';
      if (fila[fecha]) {
        add(fecha, '', 'Se vacia la fecha porque la gestante no acepto la prueba');
        fila[fecha] = '';
      }
    }
  }

  // El resultado de sifilis se expresa distinto segun el tipo de estudio:
  // POSITIVO/NEGATIVO para prueba rapida, REACTIVO/NO REACTIVO para VDRL.
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
      add(res, v, `Con estudio ${fila[tipo]} el resultado se expresa como ${v}`);
      fila[res] = v;
    } else {
      pend(res, `El resultado "${fila[res]}" no corresponde al tipo de estudio ${fila[tipo]}`);
    }
  }

  reubicarPruebasVih(fila, add, pend);
  quitarControlesDuplicados(fila, add);

  // Modalidad de consulta faltante cuando hay fecha de control.
  for (const c of CAMPOS) {
    if (!c.vals || !c.vals.includes('TELECONSULTA')) continue;
    const padre = c.x?.cond?.[1];
    if (!padre || !fila[padre] || fila[c.key]) continue;

    if (opciones.tipoConsultaPorDefecto) {
      add(c.key, opciones.tipoConsultaPorDefecto,
        `Hay fecha en ${POR_KEY[padre].nombre} pero no modalidad: se asume ${opciones.tipoConsultaPorDefecto}`);
      fila[c.key] = opciones.tipoConsultaPorDefecto;
    } else {
      pend(c.key, `Falta la modalidad y hay fecha en ${POR_KEY[padre].nombre}`);
    }
  }

  // Preguntas de tamizaje obligatorias en blanco.
  if (opciones.negativosPorDefecto) {
    for (const c of CAMPOS) {
      if (c.req !== 'SI' || fila[c.key] || c.tipo !== 'T' || !c.vals) continue;
      if (c.vals.length === 2 && c.vals.includes('SI') && c.vals.includes('NO')) {
        add(c.key, 'NO', 'Campo obligatorio en blanco: se asume NO al no haber registro afirmativo');
        fila[c.key] = 'NO';
      }
    }
  }
}

/**
 * Contrasta la FUM con la semana gestacional registrada al ingreso.
 *
 * La FUM no se corrige sola: de ella dependen la FPP, la edad gestacional y
 * todas las validaciones de fechas del reporte, asi que cambiarla por una
 * estimacion podria alterar el sentido clinico del registro.
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
 * Corrige la FUM cuando la registrada es imposible.
 *
 * La FUM no se toca por sospechas: de ella dependen la FPP, la edad gestacional
 * y todas las validaciones de fechas. Pero cuando implica una gestacion de mas
 * de 42 semanas, el dato no es dudoso sino imposible, y el validador rechaza la
 * fila entera por las incoherencias que arrastra.
 *
 * En ese caso se reconstruye a partir de la semana gestacional registrada, que
 * es el otro dato del propio archivo que fija la edad del embarazo. El cambio
 * queda en el reporte de correcciones para poder cotejarlo con la historia
 * clinica.
 */
function corregirFumImposible(fila, add) {
  const semana = aFloat(fila.semana_gestacional);
  const referencia = fila.fecha_ingreso_programa || fila.fecha_ingreso_riamp;
  if (!fila.fum || !referencia || semana === null || semana <= 0) return;

  const semanasReales = fechas.difDias(referencia, fila.fum) / 7;
  // Se actua solo ante lo imposible: gestacion de mas de 42 semanas, o una FUM
  // posterior a la atencion.
  if (semanasReales <= 42 && semanasReales >= 0) return;

  const derivada = fechas.sumarDias(referencia, -Math.round(semana * 7));
  add('fum', derivada,
    `La FUM ${fila.fum} implica ${semanasReales.toFixed(1)} semanas de gestacion al ${referencia}, imposible en un embarazo. Reconstruida a partir de la semana gestacional ${semana} registrada. Verificar contra la historia clinica`);
  fila.fum = derivada;
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
 * Mueve el tamizaje de VIH al trimestre que corresponde a su fecha.
 *
 * El validador comprueba que la prueba reportada como de primer trimestre se
 * haya tomado dentro del primer trimestre. Cuando la fecha cae mas adelante, el
 * dato no esta mal: esta en la columna equivocada. Trasladarlo no inventa nada,
 * solo lo pone donde el instructivo lo espera. Si el trimestre de destino ya
 * tiene datos, no se toca y se reporta para revision manual.
 */
function reubicarPruebasVih(fila, add, pend) {
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

    const d = BLOQUE_VIH(destino);
    const ocupado = Object.values(d).some(k => fila[k]);
    if (ocupado) {
      pend(o.fecha,
        `La prueba se tomo en el trimestre ${destino} pero esta reportada como del trimestre ${origen}, y el trimestre ${destino} ya tiene datos. Reubicarla a mano`);
      continue;
    }

    const sem = (fechas.difDias(fila[o.fecha], fila.fum) / 7).toFixed(1);
    for (const clave of Object.keys(o)) {
      if (!fila[o[clave]]) continue;
      add(d[clave], fila[o[clave]],
        `Trasladado desde el trimestre ${origen}: la prueba se tomo en la semana ${sem}, que corresponde al trimestre ${destino}`);
      fila[d[clave]] = fila[o[clave]];
      add(o[clave], '', `Trasladado al trimestre ${destino}`);
      fila[o[clave]] = '';
    }
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

/** Campos que dependen de un control y deben vaciarse junto a el. */
const DEPENDIENTES = {
  control_gineco1: 'tipo_gineco1', control_gineco2: 'tipo_gineco2',
  control_gineco3: 'tipo_gineco3', control_gineco4: 'tipo_gineco4',
  control_gineco5: 'tipo_gineco5', control_gineco6: 'tipo_gineco6',
  control_gineco7: 'tipo_gineco7',
  primera_vez_med_general: 'tipo_med_general1', control2_med_general: 'tipo_med_general2',
  control_nutricion1: 'tipo_nutricion1', control_nutricion2: 'tipo_nutricion2',
  control_psicologia1: 'tipo_psicologia1', control_psicologia2: 'tipo_psicologia2',
  control_perinatologo1: 'tipo_perinatologo1', control_perinatologo2: 'tipo_perinatologo2',
};

/**
 * Elimina controles repetidos con la misma fecha que el anterior de su serie.
 *
 * El validador exige que cada control sea posterior al anterior, asi que dos
 * registros con identica fecha lo rechazan. Una atencion no puede figurar dos
 * veces el mismo dia con el mismo profesional: es un duplicado de digitacion, y
 * borrar la copia no elimina informacion real.
 */
function quitarControlesDuplicados(fila, add) {
  for (const serie of SERIES_CONTROL) {
    for (let i = 1; i < serie.length; i++) {
      const actual = serie[i];
      if (!fila[actual]) continue;

      const repetido = serie.slice(0, i).some(k => fila[k] && fila[k] === fila[actual]);
      if (!repetido) continue;

      add(actual, '',
        `Duplicado: ya hay un control con la fecha ${fila[actual]} y el sistema los exige en dias distintos`);
      fila[actual] = '';

      const dep = DEPENDIENTES[actual];
      if (dep && fila[dep]) {
        add(dep, '', 'Se vacia junto con el control duplicado');
        fila[dep] = '';
      }
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

/** Campos obligatorios que quedaron sin dato y no tienen centinela. */
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
