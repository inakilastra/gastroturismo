// Fichero: Codigo.gs

/**
 * @description Punto de entrada principal para la aplicación web cuando se accede a través de una petición GET.
 * Esta función se ejecuta cuando un usuario visita la URL de la aplicación.
 * @returns {HtmlOutput} Un objeto HTML que representa la página principal de la aplicación.
 */
function doGet() {
  // Crea una plantilla HTML a partir del fichero 'AppShell.html'.
  // 'AppShell' actúa como el esqueleto o contenedor principal de la interfaz de usuario.
  return HtmlService.createTemplateFromFile('AppShell')
    .evaluate() // Procesa la plantilla para resolver cualquier scriptlet de Apps Script que contenga.
    .setTitle("ANeKI - Gastroturismo") // Establece el título que se mostrará en la pestaña del navegador.
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0'); // Añade una meta etiqueta viewport para asegurar que la página se vea bien en dispositivos móviles (diseño responsive).
}

/**
 * @description Obtiene el contenido HTML de una página específica de forma dinámica.
 * Esta función es llamada desde el lado del cliente (JavaScript) para cargar diferentes secciones sin recargar la página completa.
 * @param {string} pageName - El nombre del fichero HTML (sin la extensión .html) que se desea cargar.
 * @returns {string} El contenido HTML de la página solicitada o un mensaje de error en formato HTML.
 */
function getPageContent(pageName) {
  try {
    // Caso especial para la página 'tapeo', que requiere datos iniciales.
    if (pageName === 'tapeo') {
      // Crea una plantilla a partir del fichero 'tapeo.html'.
      const template = HtmlService.createTemplateFromFile('tapeo');
      
      // Obtiene los datos iniciales (la lista de autonomías) llamando a getTapeoData.
      const initialData = getTapeoData('autonomias', {}); // El segundo argumento es un objeto vacío porque no hay selección previa.
      
      // Inyecta los datos iniciales en la plantilla como una variable 'initialData'.
      // Se convierten a formato JSON para que puedan ser fácilmente parseados por el JavaScript del cliente.
      template.initialData = JSON.stringify(initialData);
      
      // Evalúa la plantilla con los datos inyectados y devuelve el contenido HTML resultante.
      return template.evaluate().getContent();
    }
    
    // Para cualquier otra página, simplemente devuelve el contenido del fichero HTML correspondiente.
    return HtmlService.createHtmlOutputFromFile(pageName).getContent();
    
  } catch (error) {
    // Registra el error detallado en los logs de Apps Script para depuración.
    console.error(`ERROR FATAL en getPageContent para '${pageName}': ${error.stack}`);
    
    // Devuelve un bloque HTML con un mensaje de error amigable para el usuario.
    // Esto evita que la aplicación se rompa y proporciona feedback útil.
    return `<div style="padding: 20px; background-color: #ffebee; color: #c62828; border: 1px solid #c62828; border-radius: 8px;"><h2>Error del Servidor</h2><p>No se pudo cargar la página '<strong>${pageName}</strong>'.</p><p><strong>Mensaje:</strong> ${error.message}</p></div>`;
  }
}

/**
 * @description Obtiene y filtra datos desde una hoja de cálculo de Google Sheets.
 * La función es jerárquica: puede devolver autonomías, provincias (filtradas por autonomía), 
 * ciudades (filtradas por provincia), etc., hasta llegar a los sitios específicos.
 * @param {string} level - El nivel de datos a obtener ('autonomias', 'provincias', 'ciudades', 'barrios', 'sitios').
 * @param {object} selection - Un objeto con las selecciones hechas por el usuario en niveles anteriores (ej: { autonomia: 'País Vasco', provincia: 'Bizkaia' }).
 * @returns {Array} Un array de strings (para niveles jerárquicos) o un array de objetos (para 'sitios').
 * @throws {Error} Lanza un error si el nivel no es válido, la hoja no se encuentra o no hay datos.
 */
function getTapeoData(level, selection) {
  try {
    // --- CONFIGURACIÓN ---
    // ID de la hoja de cálculo de Google. Es más seguro y robusto que usar el nombre.
    const SPREADSHEET_ID = '1sZngQQr6loqWUoIWipG5IWFkraEsbHD8mfaf9iirfjw'; 
    // Nombre de la pestaña específica dentro de la hoja de cálculo.
    const SHEET_NAME = 'Datos_Tapeo';
    // Objeto para mapear nombres de columnas a sus índices (base 0). Facilita la lectura y el mantenimiento del código.
    const COLS = { autonomia: 0, provincia: 1, ciudad: 2, barrio: 3, nombre: 4, nota: 5, direccion: 6, horario: 7, pintxo_tapa: 8 };

    // --- ACCESO A DATOS ---
    // Abre la hoja de cálculo por su ID y obtiene la pestaña por su nombre.
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) {
      // Si la pestaña no existe, lanza un error claro.
      throw new Error(`No se encontró la hoja con el nombre '${SHEET_NAME}'.`);
    }

    // Obtiene todos los datos de la hoja desde la fila 2 para saltar la cabecera.
    const allData = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn()).getValues();
    let dataToProcess = allData;

    // --- LÓGICA DE FILTRADO EN CASCADA ---
    // Filtra los datos basándose en el nivel y la selección del usuario.
    // Los filtros se aplican de forma secuencial y explícita.
    if (level === 'provincias') {
      dataToProcess = allData.filter(row => row[COLS.autonomia] === selection.autonomia);
    } else if (level === 'ciudades') {
      dataToProcess = allData.filter(row => row[COLS.autonomia] === selection.autonomia && row[COLS.provincia] === selection.provincia);
    } else if (level === 'barrios') {
      dataToProcess = allData.filter(row => row[COLS.autonomia] === selection.autonomia && row[COLS.provincia] === selection.provincia && row[COLS.ciudad] === selection.ciudad);
    } else if (level === 'sitios') {
      dataToProcess = allData.filter(row => row[COLS.autonomia] === selection.autonomia && row[COLS.provincia] === selection.provincia && row[COLS.ciudad] === selection.ciudad && row[COLS.barrio] === selection.barrio);
    }
    // Si el nivel es 'autonomias', no se aplica ningún filtro y se usan todos los datos ('allData').
    
    // --- PROCESAMIENTO Y EXTRACCIÓN DE DATOS ---
    let colToExtract;
    switch (level) {
      case 'autonomias':
      case 'provincias':
      case 'ciudades':
      case 'barrios':
        switch (level) {
            case 'autonomias': 
                key = 'autonomia'; 
                break;
            case 'provincias': 
                key = 'provincia'; 
                break;
            case 'ciudades':   
                key = 'ciudad';
                break;
            case 'barrios':    
                key = 'barrio';    
                break;
        }
        
        // Procesa los datos para obtener una lista de valores únicos y limpios.
        const uniqueValues = [...new Set( // 1. Crea un Set para obtener valores únicos automáticamente.
          dataToProcess.map(row => { // 2. Mapea cada fila al valor de la columna deseada.
            const cellValue = row[colToExtract];
            // 3. Se asegura de que el valor sea un string y elimina espacios en blanco.
            return cellValue ? cellValue.toString().trim() : "";
          })
        )].filter(Boolean); // 4. Convierte el Set de nuevo a un Array y filtra valores vacíos (como '').

        // Comprueba si se encontraron resultados.
        if (uniqueValues.length === 0) {
          throw new Error(`No se encontraron datos válidos en la columna '${key}' para la selección actual.`);
        }
        // Devuelve los valores únicos ordenados alfabéticamente.
        return uniqueValues.sort();

      case 'sitios':
        // Para el nivel 'sitios', mapea los datos filtrados a un array de objetos estructurados.
        const sitios = dataToProcess.map(row => ({ 
            nombre: row[COLS.nombre], 
            descripcion: row[COLS.nota], // Se usa la columna 'nota' como descripción.
            imagen_url: '' // Campo reservado para una futura URL de imagen.
        }));
        return sitios;

      default:
        // Si el 'level' solicitado no es uno de los casos válidos, lanza un error.
        throw new Error(`Nivel no válido: '${level}'.`);
    }

  } catch (error) {
    // Registra el error completo (con stack trace) en los logs del servidor para una depuración fácil.
    console.error(`ERROR en getTapeoData: ${error.stack}`);
    // Lanza un nuevo error con un mensaje más conciso que será capturado por la función llamante (getPageContent).
    throw new Error(`Fallo al obtener datos: ${error.message}`);
  }
}
