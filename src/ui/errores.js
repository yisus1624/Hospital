// Cruce del reporte de errores de la plataforma con el archivo corregido.

import { leerReporteErrores, cruzar, resumirCruce, agruparPorMensaje, detectarEnyeRechazada }
  from '../core/errores-sistema.js';

const $ = id => document.getElementById(id);

const ESTADO_ETIQUETA = {
  pendiente: ['falta', 'Sigue abierto'],
  corregido: ['bien', 'Ya resuelto'],
  desconocido: ['incoherente', 'Sin ubicar'],
};

/**
 * Conecta el bloque de errores con la interfaz.
 *
 * @param {object} api
 * @param {() => object} api.estado    devuelve el estado del archivo corregido
 * @param {(f:File) => Promise<string>} api.leerTexto
 * @param {(s:string) => string} api.escapar
 * @param {(opciones:object) => void} api.reprocesar  vuelve a corregir el
 *        archivo original con otras opciones y repinta la pantalla
 * @param {() => void} api.pedirArchivoBase  abre el asistente para que se
 *        cargue el archivo SMH, cuando el reporte llego primero
 * @returns {{reintentar: () => void, olvidar: () => void}}
 */
export function iniciarErrores({ estado: obtenerEstado, leerTexto, escapar, reprocesar,
                                 pedirArchivoBase }) {

  // Ultimo reporte cargado, para poder volver a cruzarlo tras reprocesar.
  let ultimoReporte = null;

  // Reporte entregado antes que el archivo SMH: queda en espera.
  //
  // El reporte por si solo no sirve: solo trae fila, campo y mensaje, no los
  // datos de la gestante. Hace falta el archivo para saber que dice esa celda.
  // Pero el orden en que se entregan si da igual, y entrar por el reporte es lo
  // natural para quien viene de un rechazo.
  let enEspera = null;

  $('btnCargarErrores').addEventListener('click', () => $('archivoErrores').click());

  // La plataforma rechazo la enye: se sustituye por N y se rehace el cruce.
  $('btnEnyeComoN').addEventListener('click', () => {
    reprocesar({ enyeComoN: true });
    const estado = obtenerEstado();
    if (!estado || !ultimoReporte) return;
    pintar(cruzar(ultimoReporte.errores, estado.filas, estado.pendientes),
           ultimoReporte.problema, true);
  });

  $('archivoErrores').addEventListener('change', async e => {
    const file = e.target.files[0];
    if (file) await cargar(file);
    e.target.value = '';
  });

  /**
   * Retoma el reporte que quedo en espera, ya con el archivo SMH corregido.
   * @returns {Promise<boolean>} si habia algo que retomar
   */
  async function reintentar() {
    if (!enEspera) return false;
    const file = enEspera;
    enEspera = null;
    await cargar(file);
    return true;
  }

  /** Descarta el reporte en espera (al empezar de cero). */
  function olvidar() { enEspera = null; ultimoReporte = null; }

  async function cargar(file) {
    const aviso = $('avisoErrores');
    aviso.hidden = true;

    const estado = obtenerEstado();
    if (!estado) {
      // Se guarda y se pide el archivo SMH; al terminar se retoma solo.
      enEspera = file;
      pedirArchivoBase(file.name);
      return;
    }

    try {
      const { errores, aviso: problema } = leerReporteErrores(await leerTexto(file));
      if (!errores.length) {
        return fallar(problema ?? 'No encontré errores en ese archivo.');
      }

      ultimoReporte = { errores, problema };
      pintar(cruzar(errores, estado.filas, estado.pendientes), problema);

    } catch (err) {
      fallar(`No se pudo leer el reporte: ${err.message}`);
    }

    function fallar(mensaje) {
      aviso.innerHTML = `<strong>No se pudo usar el reporte</strong>${escapar(mensaje)}`;
      aviso.hidden = false;
      $('resultadoErrores').hidden = true;
    }
  }

  /**
   * Muestra el aviso de la enye.
   * Antes de reprocesar propone el cambio; despues confirma que ya se aplico.
   */
  function pintarEnye(cruzados, yaAplicado) {
    const enye = detectarEnyeRechazada(cruzados);
    const bloque = $('avisoEnye');

    if (yaAplicado) {
      bloque.className = 'aviso-enye aplicado';
      bloque.querySelector('strong').textContent = 'Listo: la Ñ se reemplazó por N';
      $('textoEnye').textContent =
        'Descarga el archivo de nuevo y súbelo a la plataforma. Ten en cuenta que ' +
        'el apellido queda escrito con N (CAÑAS pasa a CANAS): es lo que el sistema acepta.';
      $('btnEnyeComoN').hidden = true;
      bloque.hidden = false;
      return;
    }

    if (!enye.detectada) { bloque.hidden = true; return; }

    bloque.className = 'aviso-enye';
    bloque.querySelector('strong').textContent = 'La plataforma rechazó la Ñ';
    const filas = enye.filas.length
      ? ` en la${enye.filas.length > 1 ? 's' : ''} fila${enye.filas.length > 1 ? 's' : ''} ${enye.filas.join(', ')}`
      : '';
    $('textoEnye').textContent =
      `El reporte marca ${enye.campos.join(', ')}${filas} por llevar Ñ. ` +
      'Si pulsas el botón, la cambio por N en todo el archivo y podrás descargarlo de nuevo. ' +
      'Ojo: el apellido cambia (CAÑAS pasa a CANAS).';
    $('btnEnyeComoN').hidden = false;
    bloque.hidden = false;
  }

  function pintar(cruzados, problema, yaAplicado = false) {
    const r = resumirCruce(cruzados);
    pintarEnye(cruzados, yaAplicado);

    $('eTotal').textContent = r.total;
    $('eCorregidos').textContent = r.corregidos;
    $('eSiguen').textContent = r.pendientes + r.desconocidos;
    $('tarjetaESiguen').className = 'metrica ' +
      (r.pendientes + r.desconocidos ? 'atencion' : 'limpia');

    const grupos = agruparPorMensaje(cruzados);
    const abiertos = grupos.filter(g => g.pendientes > 0).length;
    const sinUbicar = grupos.filter(g => !g.pendientes && !g.campo && !g.esNombreArchivo).length;

    const cierre = $('cierreErrores');
    const partes = [`La plataforma reportó ${r.total} errores en ${r.filas} filas, agrupados en ${grupos.length} tipos.`];

    if (abiertos) {
      $('tituloCierre').textContent = abiertos === 1
        ? 'Queda 1 tipo de error por resolver'
        : `Quedan ${abiertos} tipos de error por resolver`;
      partes.push('Están marcados abajo con la fila en la que aparecen. Corrígelos y vuelve a pasar el archivo por aquí.');
      cierre.className = 'cierre-errores atencion';
    } else {
      $('tituloCierre').textContent = 'Tu archivo ya resuelve todos estos errores';
      partes.push('Descárgalo y súbelo de nuevo a la plataforma tal como sale, sin abrirlo.');
      cierre.className = 'cierre-errores resuelto';
    }
    if (sinUbicar) {
      partes.push(`${sinUbicar} no se pudieron ubicar en una columna del reporte.`);
    }
    $('textoErrores').textContent = partes.join(' ');

    $('tablaErrores').outerHTML = `<table id="tablaErrores">
      <thead><tr>
        <th>Estado</th><th>Campo</th><th>Veces</th><th>Filas</th><th>Lo que dijo la plataforma</th>
      </tr></thead>
      <tbody>${grupos.map(g => {
        const estado = g.pendientes ? 'pendiente'
          : (g.campo || g.esNombreArchivo) ? 'corregido'
          : 'desconocido';
        const [clase, texto] = ESTADO_ETIQUETA[estado];
        const filas = g.filas.slice(0, 6).join(', ') + (g.filas.length > 6 ? `… (+${g.filas.length - 6})` : '');
        return `<tr>
          <td><span class="marca-tipo ${clase}">${texto}</span></td>
          <td class="col-campo">${escapar(g.campo?.nombre ?? g.campoBruto)}
            ${g.campo ? `<small>${escapar(g.campoBruto)}</small>` : ''}</td>
          <td class="col-fila">${g.veces}</td>
          <td class="col-fila">${escapar(filas) || '—'}</td>
          <td>${escapar(g.mensaje)}</td>
        </tr>`;
      }).join('')}</tbody></table>`;

    if (problema) {
      $('avisoErrores').innerHTML = `<strong>Aviso</strong>${escapar(problema)}`;
      $('avisoErrores').hidden = false;
    }

    $('resultadoErrores').hidden = false;
    $('resultadoErrores').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  return { reintentar, olvidar };
}
