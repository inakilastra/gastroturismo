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

function getTapeoData(level, selection) {
  try {
    const SPREADSHEET_ID = '1sZngQQr6loqWUoIWipG5IWFkraEsbHD8mfaf9iirfjw'; 
    const SHEET_NAME = 'Datos_Tapeo';
    const COLS = { autonomia: 0, provincia: 1, ciudad: 2, barrio: 3, nombre: 4, nota: 5, direccion: 6, horario: 7, pintxo_tapa: 8 };

    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) { throw new Error(`No se encontró la hoja con el nombre '${SHEET_NAME}'.`); }

    const allData = sheet.getDataRange().getValues().slice(1);
    if (allData.length === 0) { throw new Error("La hoja de cálculo no tiene datos."); }

    let dataToProcess = allData;

    // Lógica de filtrado acumulativo
    if (selection.autonomia) { dataToProcess = dataToProcess.filter(row => row[COLS.autonomia] === selection.autonomia); }
    if (selection.provincia) { dataToProcess = dataToProcess.filter(row => row[COLS.provincia] === selection.provincia); }
    if (selection.ciudad) { dataToProcess = dataToProcess.filter(row => row[COLS.ciudad] === selection.ciudad); }
    if (selection.barrio) { dataToProcess = dataToProcess.filter(row => row[COLS.barrio] === selection.barrio); }
    
    // Lógica de extracción
    if (level === 'sitios') {
      return dataToProcess.map(row => ({ nombre: row[COLS.nombre], descripcion: row[COLS.nota], imagen_url: '' }));
    } else {
      let key;
      if (level === 'ciudades') { key = 'ciudad'; } 
      else if (['autonomias', 'provincias', 'barrios'].includes(level)) { key = level.slice(0, -1); } 
      else { throw new Error('Nivel no válido.'); }
      
      const colToExtract = COLS[key];
      if (typeof colToExtract === 'undefined') { throw new Error(`La clave de columna '${key}' no es válida.`); }
      
      const uniqueValues = [...new Set(dataToProcess.map(row => (row[colToExtract] ? row[colToExtract].toString().trim() : "")))].filter(Boolean);
      if (uniqueValues.length === 0) { throw new Error(`No se encontraron datos válidos en la columna '${key}'.`); }
      return uniqueValues.sort();
    }
  } catch (error) {
    console.error(`ERROR en getTapeoData: ${error.stack}`);
    throw new Error(`Fallo al obtener datos: ${error.message}`);
  }
}