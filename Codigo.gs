// VARIABLES WEB ================================================================================================================================
  const w_SS = SpreadsheetApp.openById('1sZngQQr6loqWUoIWipG5IWFkraEsbHD8mfaf9iirfjw');
  const w_Datos = w_SS.getSheetByName('Datos_Web');

// Code.gs

// Hoja de cálculo donde tienes tus datos. Reemplaza con tu ID y nombres de hoja.
const SPREADSHEET_ID = "1sZngQQr6loqWUoIWipG5IWFkraEsbHD8mfaf9iirfjw"; 
/*const SHEET_AUTONOMIAS = "Autonomias_Pais"; // Asumiendo que tienes una hoja para cada nivel o una principal
const SHEET_PROVINCIAS = "Provincias";
const SHEET_CIUDADES = "Ciudades";
const SHEET_BARRIOS = "Barrios";
const SHEET_SITIOS = "Sitios"; // Tu hoja principal con todos los datos de los sitios*/
const SHEET_AUTONOMIAS = "Datos_AutonomiaPais";
const SHEET_PROVINCIAS = "Datos_Web";
const SHEET_CIUDADES = "Datos_Web";
const SHEET_BARRIOS = "Datos_Web";
const SHEET_SITIOS = "Datos_Web"; 

function doGet(e) {
  // Podrías manejar parámetros aquí si quieres cargar un estado específico inicialmente
  // Ejemplo: if (e.parameter.page === 'provincia' && e.parameter.autonomia) { ... }
  return HtmlService.createTemplateFromFile('Index').evaluate()
      .setTitle('ANeKI - GastroTurismo')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL) // Necesario para embeber en Google Sites
      .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

// --- Funciones para obtener datos (a llamar desde el cliente con google.script.run) ---

// Asume que tu hoja "Sitios" tiene columnas como: Autonomia, Provincia, Ciudad, Barrio, Nombre, Nota, etc.
// Y que las otras hojas (Autonomias_Pais, Provincias, Ciudades, Barrios) solo tienen una columna con el nombre respectivo.

function getAutonomias() {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_AUTONOMIAS);
    // Si la hoja SHEET_AUTONOMIAS solo tiene una columna con los nombres:
    //const data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
    //return data.map(row => ({ Autonomia: row[0] })).filter(item => item.Autonomia && item.Autonomia.trim() !== "");
    
    // Si obtienes autonomías de la hoja principal "Sitios" (columna "Autonomia")
    const allDataSheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_SITIOS);
    const autonomiasColumn = getColumnValues(allDataSheet, "Autonomia"); // Necesitas una función para obtener el índice de la columna por nombre
    const uniqueAutonomias = [...new Set(autonomiasColumn)].filter(Boolean); // Elimina duplicados y vacíos
    return uniqueAutonomias.map(autonomia => ({ Autonomia: autonomia }));

  } catch (error) {
    console.error("Error en getAutonomias: " + error.toString());
    throw new Error("No se pudieron cargar las autonomías. " + error.message);
  }
}

function getProvincias(autonomiaSeleccionada) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_SITIOS);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const autonomiaColIndex = headers.indexOf("Autonomia"); // O como se llame tu columna
    const provinciaColIndex = headers.indexOf("Provincia");

    if (autonomiaColIndex === -1 || provinciaColIndex === -1) {
      throw new Error("No se encontraron las columnas 'Autonomia' o 'Provincia' en la hoja " + SHEET_SITIOS);
    }

    const provincias = new Set();
    data.slice(1).forEach(row => {
      if (row[autonomiaColIndex] === autonomiaSeleccionada && row[provinciaColIndex]) {
        provincias.add(row[provinciaColIndex]);
      }
    });
    return Array.from(provincias).map(prov => ({ Provincia: prov }));
  } catch (error) {
    console.error("Error en getProvincias: " + error.toString());
    throw new Error("No se pudieron cargar las provincias. " + error.message);
  }
}

function getCiudades(provinciaSeleccionada) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_SITIOS);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const provinciaColIndex = headers.indexOf("Provincia");
    const ciudadColIndex = headers.indexOf("Ciudad");

    if (provinciaColIndex === -1 || ciudadColIndex === -1) {
      throw new Error("No se encontraron las columnas 'Provincia' o 'Ciudad' en la hoja " + SHEET_SITIOS);
    }

    const ciudades = new Set();
    data.slice(1).forEach(row => {
      if (row[provinciaColIndex] === provinciaSeleccionada && row[ciudadColIndex]) {
        ciudades.add(row[ciudadColIndex]);
      }
    });
    return Array.from(ciudades).map(city => ({ Ciudad: city }));
  } catch (error) {
    console.error("Error en getCiudades: " + error.toString());
    throw new Error("No se pudieron cargar las ciudades. " + error.message);
  }
}

function getBarrios(ciudadSeleccionada) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_SITIOS);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const ciudadColIndex = headers.indexOf("Ciudad");
    const barrioColIndex = headers.indexOf("Barrio");

    if (ciudadColIndex === -1 || barrioColIndex === -1) {
      throw new Error("No se encontraron las columnas 'Ciudad' o 'Barrio' en la hoja " + SHEET_SITIOS);
    }
    
    const barrios = new Set();
    data.slice(1).forEach(row => {
      if (row[ciudadColIndex] === ciudadSeleccionada && row[barrioColIndex]) {
        barrios.add(row[barrioColIndex]);
      }
    });
    // Si un barrio es "", puede que quieras filtrarlo o manejarlo específicamente.
    // Aquí se devuelve tal cual, el frontend lo puede filtrar si es necesario.
    return Array.from(barrios).map(hood => ({ Barrio: hood }));
  } catch (error) {
    console.error("Error en getBarrios: " + error.toString());
    throw new Error("No se pudieron cargar los barrios. " + error.message);
  }
}

function getSitios(barrioSeleccionado) {
  try {
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_SITIOS);
    const data = sheet.getDataRange().getValues();
    const headers = data[0];
    const barrioColIndex = headers.indexOf("Barrio");
    // Asegúrate de que los nombres de las columnas aquí coincidan EXACTAMENTE con tu hoja de cálculo
    const nombreColIndex = headers.indexOf("Nombre");
    const notaColIndex = headers.indexOf("Nota");
    const direccionColIndex = headers.indexOf("Direccion");
    const horarioColIndex = headers.indexOf("Horario");
    const pintxoTapaColIndex = headers.indexOf("Pintxo_Tapa");
    const mapsColIndex = headers.indexOf("Maps");
    const facebookColIndex = headers.indexOf("Facebook");
    const instagramColIndex = headers.indexOf("Instagram");
    const webColIndex = headers.indexOf("Web");
    const foto1ColIndex = headers.indexOf("Foto1");
    const foto2ColIndex = headers.indexOf("Foto2");
    const foto3ColIndex = headers.indexOf("Foto3");
    const foto4ColIndex = headers.indexOf("Foto4");
    const tipoLugarColIndex = headers.indexOf("Tipo_Lugar");
    const valoracionColIndex = headers.indexOf("Valoracion");

    // Validar que todas las columnas necesarias existen
    if ([barrioColIndex, nombreColIndex /*, ... otras columnas obligatorias */].some(index => index === -1)) {
        let missingCols = [];
        if(barrioColIndex === -1) missingCols.push("Barrio");
        if(nombreColIndex === -1) missingCols.push("Nombre");
        // Añadir más si son críticas
        throw new Error("Faltan columnas esenciales en la hoja 'Sitios': " + missingCols.join(", "));
    }

    const sitios = [];
    data.slice(1).forEach(row => {
      if (row[barrioColIndex] === barrioSeleccionado && row[nombreColIndex]) { // Asegurarse de que el sitio tiene un nombre
        sitios.push({
          Nombre: row[nombreColIndex],
          Nota: row[notaColIndex] || '', // Devuelve cadena vacía si es undefined/null
          Direccion: row[direccionColIndex] || '',
          Horario: row[horarioColIndex] || '',
          Pintxo_Tapa: row[pintxoTapaColIndex] || '',
          Maps: row[mapsColIndex] || '',
          Facebook: row[facebookColIndex] || '',
          Instagram: row[instagramColIndex] || '',
          Web: row[webColIndex] || '',
          Foto1: row[foto1ColIndex] || '',
          Foto2: row[foto2ColIndex] || '',
          Foto3: row[foto3ColIndex] || '',
          Foto4: row[foto4ColIndex] || '',
          Tipo_Lugar: row[tipoLugarColIndex] || '',
          Valoracion: row[valoracionColIndex] || ''
        });
      }
    });
    return sitios;
  } catch (error) {
    console.error("Error en getSitios: " + error.toString());
    throw new Error("No se pudieron cargar los sitios. " + error.message);
  }
}


// Función auxiliar para obtener todos los valores de una columna específica por su nombre de cabecera
function getColumnValues(sheet, columnName) {
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const columnIndex = headers.indexOf(columnName);
  if (columnIndex === -1) {
    // Logger.log("Columna no encontrada: " + columnName);
    return []; // O lanzar un error: throw new Error("Columna no encontrada: " + columnName);
  }
  // Obtener todos los valores de la columna, excluyendo la cabecera
  const columnValues = sheet.getRange(2, columnIndex + 1, sheet.getLastRow() - 1, 1)
                          .getValues()
                          .map(row => row[0]) // Extraer el valor de cada celda
                          .filter(value => value !== null && value !== undefined && value.toString().trim() !== ""); // Filtrar vacíos
  return columnValues;
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
