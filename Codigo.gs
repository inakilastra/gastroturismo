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
    //const SHEET_NAME = 'Datos_Tapeo';
    const SHEET_NAME = 'Tapeando';
    const COLS = { 
      autonomia: 0, provincia: 1, ciudad: 2, barrio: 3, nombre: 4, nota: 5, 
      direccion: 6, horario: 7, pintxo_tapa: 8, googleresenas: 9, maps: 10, 
      facebook: 11, instagram: 12, postinstagram: 13, web: 14, foto1: 15, 
      foto2: 16, foto3: 17, foto4: 18, foto5: 19, foto6: 20, foto7: 21,
      foto8: 22, foto9: 23, foto10: 24, foto11: 25, foto12: 26, foto13: 27,
      foto14: 28, foto15: 29, foto16: 30, foto17: 31, foto18: 32, foto19: 33,
      foto20: 34, lo_ultimo: 35, tipo_lugar: 36, valoracion: 37, codprecio: 38,	precio: 39,	precioultimo: 40
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
        const foto5_id = row[COLS.foto5];
        const foto6_id = row[COLS.foto6];
        const foto7_id = row[COLS.foto7];
        const foto8_id = row[COLS.foto8];
        const foto9_id = row[COLS.foto9];
        const foto10_id = row[COLS.foto10];
        const foto11_id = row[COLS.foto11];
        const foto12_id = row[COLS.foto12];
        const foto13_id = row[COLS.foto13];
        const foto14_id = row[COLS.foto14];
        const foto15_id = row[COLS.foto15];
        const foto16_id = row[COLS.foto16];
        const foto17_id = row[COLS.foto17];
        const foto18_id = row[COLS.foto18];
        const foto19_id = row[COLS.foto19];
        const foto20_id = row[COLS.foto20];
        
        return {
          nombre: row[COLS.nombre],
          nota: row[COLS.nota],
          valoracion: row[COLS.valoracion],
          direccion: row[COLS.direccion],
          horario: row[COLS.horario],
          pintxo_tapa: row[COLS.pintxo_tapa],
          lo_ultimo: row[COLS.lo_ultimo],
          postinstagram: row[COLS.postinstagram],
          googleresenas: row[COLS. googleresenas],
          web: row[COLS.web],
          instagram: row[COLS.instagram],
          maps: row[COLS.maps],
          facebook: row[COLS.facebook],
          foto1: getImageAsBase64(foto1_id),
          foto2: getImageAsBase64(foto2_id),
          foto3: getImageAsBase64(foto3_id),
          foto4: getImageAsBase64(foto4_id),
          foto5: getImageAsBase64(foto5_id),
          foto6: getImageAsBase64(foto6_id),
          foto7: getImageAsBase64(foto7_id),
          foto8: getImageAsBase64(foto8_id),
          foto9: getImageAsBase64(foto9_id),
          foto10: getImageAsBase64(foto10_id),
          foto11: getImageAsBase64(foto11_id),
          foto12: getImageAsBase64(foto12_id),
          foto13: getImageAsBase64(foto13_id),
          foto14: getImageAsBase64(foto14_id),
          foto15: getImageAsBase64(foto15_id),
          foto16: getImageAsBase64(foto16_id),
          foto17: getImageAsBase64(foto17_id),
          foto18: getImageAsBase64(foto18_id),
          foto19: getImageAsBase64(foto19_id),
          foto20: getImageAsBase64(foto20_id),                                     
          codprecio: row[COLS.codprecio],
          precio: row[COLS.precio],
          precioultimo: row[COLS.precioultimo]
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
