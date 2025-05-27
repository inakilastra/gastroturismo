// VARIABLES WEB ================================================================================================================================
// Abre el Spreadsheet (hoja de cálculo) por su ID.
const w_SS = SpreadsheetApp.openById('1sZngQQr6loqWUoIWipG5IWFkraEsbHD8mfaf9iirfjw');
// Obtiene la hoja específica dentro del Spreadsheet por su nombre.
const w_Datos = w_SS.getSheetByName('Datos_Web');

/**
 * Esta función se ejecuta cuando se accede a la URL de la aplicación web desplegada mediante una petición GET.
 * Lee los datos de la hoja 'w_Datos', omite la primera fila (encabezados),
 * y devuelve los datos restantes como una respuesta JSON.
 *
 * @param {Object} e El objeto de evento pasado a la función doGet, puede contener parámetros de la URL. No se usa en esta versión simple.
 * @return {GoogleAppsScript.Content.TextOutput} Una respuesta de texto en formato JSON conteniendo los datos de la hoja o un mensaje de error.
 */
function doGet(e) {
  try {
    // Verifica si la hoja w_Datos se cargó correctamente.
    if (!w_Datos) {
      Logger.log("Error: La hoja 'w_Datos' no fue encontrada en el spreadsheet con ID '14OADK1_szuLpL64LX45n6VS74VUrlwOCtWDPkk8FG5Q'.");
      return ContentService
        .createTextOutput(JSON.stringify({ error: "La hoja 'w_Datos' no fue encontrada. Verifica el nombre y el ID del Spreadsheet." }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Obtener todos los valores del rango de datos de la hoja.
    // Esto devuelve un array de arrays, donde cada array interno es una fila.
    var data = w_Datos.getDataRange().getValues();
    
    // Eliminar la primera fila del array 'data'.
    // Se asume que la primera fila contiene los encabezados de las columnas y no los datos reales.
    if (data.length > 0) {
      data.shift(); 
    } else {
      // Si no hay datos (o solo una fila de encabezado que se eliminó), devuelve un array vacío.
      Logger.log("La hoja 'w_Datos' está vacía o solo contiene encabezados.");
      // No es necesariamente un error, podría ser que la hoja esté vacía.
    }
    
    // Prepara el objeto resultado que se convertirá a JSON.
    // La clave 'values' contendrá el array de arrays (las filas de datos).
    var resultado = {
      values: data 
    };

    // Convierte el objeto 'resultado' a una cadena JSON.
    // Establece el tipo MIME de la respuesta a JSON.
    return ContentService
      .createTextOutput(JSON.stringify(resultado))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    // Si ocurre cualquier error durante la ejecución, regístralo y devuelve un mensaje de error JSON.
    Logger.log("Error en la función doGet: " + error.toString() + " Stack: " + error.stack);
    return ContentService
      .createTextOutput(JSON.stringify({ error: "Error interno del servidor al procesar la solicitud: " + error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/*
// Función de prueba opcional:
// Puedes ejecutar esta función desde el editor de Apps Script para verificar
// que doGet() funciona como se espera y ver la salida JSON en los registros.
function probarMiDoGet() {
  var mockEvent = {}; // Simula un evento 'e' vacío, ya que doGet no lo usa activamente aquí.
  var respuestaJson = doGet(mockEvent);
  Logger.log("Contenido de la respuesta JSON:");
  Logger.log(respuestaJson.getContent());
}
*/
