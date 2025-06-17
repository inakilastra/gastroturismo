// ===============================================================
// FICHERO: Codigo.gs (VERSIÓN COMPLETA Y FINAL)
// ===============================================================

function doGet() {
  return HtmlService.createTemplateFromFile('AppShell').evaluate().setTitle("ANeKI - Gastroturismo").addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

function getPageContent(pageName) {
  try {
    if (pageName === 'tapeo') {
      const template = HtmlService.createTemplateFromFile('tapeo');
      const initialData = getTapeoData('autonomias', {});
      template.initialData = JSON.stringify(initialData);
      return template.evaluate().getContent();
    }
    return HtmlService.createHtmlOutputFromFile(pageName).getContent();
  } catch (error) {
    console.error(`ERROR FATAL en getPageContent para '${pageName}': ${error.stack}`);
    return `<div style="padding: 20px; background-color: #ffebee; color: #c62828;"><h2>Error del Servidor</h2><p>No se pudo cargar la página.</p><p><strong>Mensaje:</strong> ${error.message}</p></div>`;
  }
}

/**
 * ----------------------------------------------------------------
 * FUNCIÓN DE AYUDA (Solo necesitamos una)
 * ----------------------------------------------------------------
 */
function getImageAsBase64(fileId) {
  if (!fileId || typeof fileId !== 'string' || fileId.trim() === "") {
    return null;
  }
  try {
    const file = DriveApp.getFileById(fileId);
    const contentType = file.getMimeType();
    if (contentType.startsWith("image/")) {
      const base64Image = "data:" + contentType + ";base64," + Utilities.base64Encode(file.getBlob().getBytes());
      return base64Image;
    } else {
      return null;
    }
  } catch (e) {
    // Este log es útil si el ID es correcto pero hay un problema de permisos.
    console.error("Error en getImageAsBase64 para fileId '" + fileId + "': " + e.toString());
    return null;
  }
}

/**
 * ----------------------------------------------------------------
 * FUNCIÓN getTapeoData (VERSIÓN FINAL Y SIMPLIFICADA)
 * ----------------------------------------------------------------
 */
function getTapeoData(level, selection) {
  try {
    const SPREADSHEET_ID = '1sZngQQr6loqWUoIWipG5IWFkraEsbHD8mfaf9iirfjw'; 
    const SHEET_NAME = 'Datos_Tapeo';
    const COLS = { 
      autonomia: 0, provincia: 1, ciudad: 2, barrio: 3, nombre: 4, nota: 5, 
      direccion: 6, horario: 7, pintxo_tapa: 8, googleresenas: 9, maps: 10, 
      facebook: 11, instagram: 12, postnstagram: 13, web: 14, foto1: 15, 
      foto2: 16, foto3: 17, foto4: 18, lo_ultimo: 19, tipo_lugar: 20, valoracion: 21
    };

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) { throw new Error(`No se encontró la hoja: '${SHEET_NAME}'.`); }

    const allData = sheet.getDataRange().getValues().slice(1);
    if (allData.length === 0) { throw new Error("La hoja no tiene datos."); }

    let dataToProcess = allData;

    if (selection && selection.autonomia) { dataToProcess = dataToProcess.filter(row => row[COLS.autonomia] === selection.autonomia); }
    if (selection && selection.provincia) { dataToProcess = dataToProcess.filter(row => row[COLS.provincia] === selection.provincia); }
    if (selection && selection.ciudad) { dataToProcess = dataToProcess.filter(row => row[COLS.ciudad] === selection.ciudad); }
    if (selection && selection.barrio) { dataToProcess = dataToProcess.filter(row => row[COLS.barrio] === selection.barrio); }
    
    if (level === 'sitios') {
      return dataToProcess.map(row => {
        // --- INICIO DE LA CORRECCIÓN ---
        // Usamos el valor de la celda directamente como el ID de la foto.
        const foto1_id = row[COLS.foto1];
        const foto2_id = row[COLS.foto2];
        const foto3_id = row[COLS.foto3];
        const foto4_id = row[COLS.foto4];
        
        return {
          nombre: row[COLS.nombre],
          valoracion: row[COLS.valoracion],
          pintxo_tapa: row[COLS.pintxo_tapa],
          postnstagram: row[COLS.postnstagram],
          web: row[COLS.web],
          instagram: row[COLS.instagram],
          maps: row[COLS.maps],
          foto1: getImageAsBase64(foto1_id),
          foto2: getImageAsBase64(foto2_id),
          foto3: getImageAsBase64(foto3_id),
          foto4: getImageAsBase64(foto4_id)
        };
        // --- FIN DE LA CORRECCIÓN ---
      });
    } else {
      let key;
      if (level === 'ciudades') { key = 'ciudad'; } 
      else if (['autonomias', 'provincias', 'barrios'].includes(level)) { key = level.slice(0, -1); } 
      else { throw new Error('Nivel no válido.'); }
      
      const colToExtract = COLS[key];
      if (typeof colToExtract === 'undefined') { throw new Error(`La clave de columna '${key}' no es válida.`); }
      
      const uniqueValues = [...new Set(dataToProcess.map(row => (row[colToExtract] ? row[colToExtract].toString().trim() : "")))].filter(Boolean);
      return uniqueValues.sort();
    }
  } catch (error) {
    console.error(`ERROR en getTapeoData: ${error.stack}`);
    throw new Error(`Fallo al obtener datos: ${error.message}`);
  }
}
