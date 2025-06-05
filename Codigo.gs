/**
 * @OnlyCurrentDoc
 *
 * Backend para la aplicación web ANeKI - GastroTurismo.
 * Autor: Gemini
 * Versión: 2.0 (Multi-página y Multi-hoja)
 * * Este script gestiona la obtención de datos desde un único libro de Google Sheets 
 * con varias hojas y sirve las páginas HTML correspondientes a la aplicación web.
 */

//================================================================================
// CONFIGURACIÓN CENTRAL - NO MODIFICAR
// ID del libro de cálculo que contiene todos los datos. Es la base de toda la aplicación.
const SPREADSHEET_ID = "1sZngQQr6loqWUoIWipG5IWFkraEsbHD8mfaf9iirfjw"; 
//================================================================================

/**
 * FUNCIÓN PRINCIPAL - PUNTO DE ENTRADA DE LA APP WEB
 * Se ejecuta cuando un usuario visita la URL de la aplicación.
 * Actúa como un "enrutador" (router), sirviendo diferentes archivos HTML 
 * según el parámetro 'page' en la URL (ej: .../exec?page=restaurantes).
 * @param {Object} e - El objeto de evento de Apps Script, que contiene los parámetros de la URL.
 * @return {HtmlOutput} El servicio HTML para mostrar la página solicitada.
 */
function doGet(e) {
  const baseUrl = ScriptApp.getService().getUrl();
  let pageFile = 'Index.html'; // Página por defecto
  let activePage = 'inicio';
  let title = "ANeKI - GastroTurismo"; // Título por defecto

  // Router para decidir qué archivo de contenido cargar
  if (e.parameter.page === 'tapeo') {
    pageFile = 'Tapeo.html';
    activePage = 'tapeo';
    title = "ANeKI - Tapeo";
  } else if (e.parameter.page === 'restaurantes') {
    pageFile = 'Restaurantes.html';
    activePage = 'restaurantes';
    title = "ANeKI - Restaurantes";
  } else if (e.parameter.page === 'bodegas') {
    pageFile = 'Bodegas.html';
    activePage = 'bodegas';
    title = "ANeKI - Bodegas";
  } else if (e.parameter.page === 'turismo') {
    pageFile = 'Turismo.html';
    activePage = 'turismo';
    title = "ANeKI - Turismo";
  } else if (e.parameter.page === 'tiendas') {
    pageFile = 'Tiendas.html';
    activePage = 'tiendas';
    title = "ANeKI - Tiendas";
  } else if (e.parameter.page === 'eventosculinarios') {
    pageFile = 'EventosCulinarios.html';
    activePage = 'eventosculinarios';
    title = "ANeKI - Eventos Culinarios";
  } else if (e.parameter.page === 'eventosturisticos') {
    pageFile = 'EventosTuristicos.html';
    activePage = 'eventosturisticos';
    title = "ANeKI - Eventos Turisticos";
  } else if (e.parameter.page === 'carteles') {
    pageFile = 'Carteles.html';
    activePage = 'carteles';
    title = "ANeKI - Carteles";
  }

  // Carga el contenido de la página específica
  const pageContent = HtmlService.createHtmlOutputFromFile(pageFile).getContent();
  
  // Carga la plantilla principal (el layout)
  const layout = HtmlService.createTemplateFromFile('Layout.html');
  
  // Pasa las variables a la plantilla
  layout.baseUrl = baseUrl;
  layout.activePage = activePage
  layout.pageContent = pageContent;
  layout.heroImageUrl = null; // Valor por defecto
  layout.aboutUsImageUrl = null; // Valor por defecto
  
  
  // Si es la página de inicio, pasa también la URL de la imagen del hero
  if (pageFile === 'Index.html') {
    const idImagenLandin = '1_ac1UF-huYLYVO2pCSK-eFqk3k67l3zZ';
    layout.heroImageUrl = getImageAsBase64(idImagenLandin);
    const idImagenAboutUs = '17yV5z7LQUheTWPq6Bx4-GqNrlwh5PxiE';
    layout.aboutUsImageUrl = getImageAsBase64(idImagenAboutUs);
  } else {
    layout.heroImageUrl = null; // O undefined, o no la definas
    layout.aboutUsImageUrl = null; // Asegúrate de que también se maneje
  }
  // Esto permite que el JavaScript del cliente sepa qué datos pedir.
  //layout.sheetName = page === 'tapeo' ? 'Datos_Tapeo' : 
  //                   page === 'restaurantes' ? 'Datos_Restaurante' :
  //                   page === 'turismo' ? 'Datos_Turismo' : '';

Logger.log('Revisando todas las propiedades de layout:');
for (var key in layout) {
  if (layout.hasOwnProperty(key)) {
    var value = layout[key];
    // Si el valor es una cadena larga (como Base64), loguea solo una parte
    var logValue = (typeof value === 'string' && value.length > 100) ? value.substring(0,100) + '...' : value;
    Logger.log(key + ': ' + logValue);
  }
}
  // Procesa y devuelve el HTML final y completo
  return layout.evaluate()
      .setTitle(title)
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
function doGetOLD(e) {
  // Obtiene la URL base de la aplicación web. Esencial para construir los enlaces.
  const baseUrl = ScriptApp.getService().getUrl();
  let page = e.parameter.page;
  let template;
  let title = "ANeKI - GastroTurismo"; // Título por defecto

  // Si no se especifica ninguna página en la URL, se carga 'tapeo' por defecto.
  if (!page) {
    page = 'Index';
  }

  // Seleccionamos la plantilla HTML y el título según la página solicitada.
  switch (page.toLowerCase()) {
    case 'tapeo':
      template = HtmlService.createTemplateFromFile('Tapeo'); // Requiere archivo Tapeo.html
      title = "ANeKI - Tapeo";
      break;
    case 'restaurantes':
      template = HtmlService.createTemplateFromFile('Restaurantes'); // Requiere archivo Restaurantes.html
      title = "ANeKI - Restaurantes";
      break;
    case 'bodegas':
      template = HtmlService.createTemplateFromFile('Bodegas'); // Requiere archivo Bodegas.html
      title = "ANeKI - Bodegas";
      break;
    case 'turismo':
      template = HtmlService.createTemplateFromFile('Turismo'); // Requiere archivo Turismo.html
      title = "ANeKI - Turismo";
      break;
    case 'tiendas':
      template = HtmlService.createTemplateFromFile('Tiendas'); // Requiere archivo Tiendas.html
      title = "ANeKI - Tiendas Gourmet";
      break;      
    case 'eventosculinarios':
      template = HtmlService.createTemplateFromFile('EventosCulinarios'); // Requiere archivo EventosCulinarios.html
      title = "ANeKI - Eventos Culinarios";
      break; 
    case 'eventosturisticos':
      template = HtmlService.createTemplateFromFile('EventosTuristicos'); // Requiere archivo EventosTuristicos.html
      title = "ANeKI - Eventos Turisticos";
      break;         
    case 'carteles':
      template = HtmlService.createTemplateFromFile('Carteles'); // Requiere archivo Carteles.html
      title = "ANeKI - Carteles";
      break;                
    default:
      // Si la página no existe, mostramos una página principal o de error.
      template = HtmlService.createTemplateFromFile('Index'); // Requiere archivo Index.html
      title = "ANeKI - Bienvenido";
      // Aquí es donde pones el ID de tu imagen que copiaste en el Paso 1.
      //const fondo_landin = '17yV5z7LQUheTWPq6Bx4-GqNrlwh5PxiE'; // Delirios
      const fondo_landin = '1_ac1UF-huYLYVO2pCSK-eFqk3k67l3zZ'; //Jamon Jamon
      // Llama a la función para obtener la imagen y la añade a una variable para el HTML.
      template.heroImageUrl = getImageAsBase64(fondo_landin);
  }

  // Obtiene la URL base de la aplicación (ej: .../exec) y la añade a una variable 'baseUrl'
  //template.baseUrl = ScriptApp.getService().getUrl();
  // Pasamos la URL base a la plantilla para que la use en los enlaces.
  template.baseUrl = baseUrl;
  // Pasamos el nombre de la hoja de datos a la plantilla HTML.
  // Esto permite que el JavaScript del cliente sepa qué datos pedir.
  template.sheetName = page === 'tapeo' ? 'Datos_Tapeo' : 
                       page === 'restaurantes' ? 'Datos_Restaurante' :
                       page === 'turismo' ? 'Datos_Turismo' : '';
  
  return template.evaluate()
    .setTitle(title)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Incluye el contenido de otro archivo HTML dentro de una plantilla.
 * Útil para modularizar el código (ej: CSS o JS comunes).
 * @param {string} filename - El nombre del archivo a incluir (sin .html).
 * @return {string} El contenido del archivo como texto.
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}


/**
 * FUNCIÓN CENTRAL DE OBTENCIÓN DE DATOS
 * Obtiene todos los datos de una hoja especificada DENTRO del libro definido por SPREADSHEET_ID.
 * @param {string} sheetName - El nombre de la hoja de la que se quieren obtener los datos (ej: "Datos_Tapeo").
 * @return {Array<Object>} Un array de objetos, donde cada objeto representa una fila.
 */
function getSheetData(sheetName) {
  if (!sheetName) {
    console.error("Error en getSheetData: No se proporcionó un nombre de hoja (sheetName).");
    return [];
  }
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    const sheet = ss.getSheetByName(sheetName);

    if (!sheet) {
      console.error("Hoja no encontrada: " + sheetName);
      return [];
    }
    const range = sheet.getDataRange();
    const values = range.getValues();

    if (values.length < 2) { // Requiere cabecera + al menos 1 fila de datos
      console.log("No hay suficientes datos en la hoja: " + sheetName);
      return [];
    }

    const headers = values[0].map(header => String(header).trim());
    const data = [];

    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      // Solo procesar filas que tengan un valor en la primera columna.
      if (row[0]) {
        const entry = {};
        headers.forEach((header, index) => {
          if (header) { // Solo añadir si la cabecera tiene nombre
            entry[header] = row[index];
          }
        });
        data.push(entry);
      }
    }
    return data;
  } catch (error) {
    console.error("Error en getSheetData para la hoja '" + sheetName + "': " + error.toString());
    console.error("Stack: " + error.stack);
    return []; // Devuelve un array vacío en caso de error para no romper la app.
  }
}

//================================================================================
// FUNCIONES DE FILTRADO DE DATOS (API para el Frontend)
// Todas estas funciones aceptan 'sheetName' para saber en qué hoja buscar.
//================================================================================

function getAutonomias(sheetName) {
  const data = getSheetData(sheetName);
  return [...new Set(data.map(item => item.Autonomia))].filter(Boolean).map(autonomia => ({ Autonomia: autonomia }));
}

function getProvincias(sheetName, autonomia) {
  const data = getSheetData(sheetName);
  return [...new Set(data.filter(item => item.Autonomia === autonomia).map(item => item.Provincia))].filter(Boolean).map(provincia => ({ Provincia: provincia }));
}

function getCiudades(sheetName, provincia) {
  const data = getSheetData(sheetName);
  return [...new Set(data.filter(item => item.Provincia === provincia).map(item => item.Ciudad))].filter(Boolean).map(ciudad => ({ Ciudad: ciudad }));
}

function getBarrios(sheetName, ciudad) {
  const data = getSheetData(sheetName);
  return [...new Set(data.filter(item => item.Ciudad === ciudad).map(item => item.Barrio))].filter(Boolean).map(barrio => ({ Barrio: barrio }));
}

function getSitios(sheetName, barrio) {
  const data = getSheetData(sheetName);
  return data.filter(item => item.Barrio === barrio); // Devuelve los objetos completos
}

//================================================================================
// FUNCIONES DE UTILIDAD
//================================================================================

/**
 * Obtiene una imagen de Google Drive como una cadena Base64 para incrustarla en HTML.
 * @param {string} fileId - El ID del archivo de imagen en Google Drive.
 * @return {string|null} La imagen como una cadena Base64 (data URL), o null si hay un error.
 */
function getImageAsBase64OLD(fileId) {
  if (!fileId || typeof fileId !== 'string' || fileId.trim() === "") {
    return null;
  }
  try {
    const file = DriveApp.getFileById(fileId);
    const contentType = file.getMimeType();
    if (contentType && contentType.startsWith("image/")) {
      return "data:" + contentType + ";base64," + Utilities.base64Encode(file.getBlob().getBytes());
    } else {
      console.warn("getImageAsBase64: El archivo con ID " + fileId + " no es una imagen. MimeType: " + contentType);
      return null;
    }
  } catch (e) {
    console.error("Error en getImageAsBase64 para fileId '" + fileId + "': " + e.toString());
    return null;
  }
}
/**
 * Obtiene una imagen de Google Drive y la convierte a una cadena de datos Base64.
 * @param {string} id El ID del archivo de imagen en Google Drive.
 * @return {string} La cadena de datos Base64 de la imagen.
 */
function getImageAsBase64(id) {
  try {
    const file = DriveApp.getFileById(id);
    const contentType = file.getMimeType();
    const base64Data = Utilities.base64Encode(file.getBlob().getBytes());
    return `data:${contentType};base64,${base64Data}`;
  } catch (e) {
    Logger.log(`Error al obtener la imagen: ${e.message}`);
    // Devuelve una imagen de marcador de posición o una cadena vacía en caso de error.
    return 'https://placehold.co/1920x1080/FF0000/FFFFFF?text=Error+cargando+imagen';
  }
}
