// VARIABLES WEB ================================================================================================================================
  const sps = SpreadsheetApp.openById('1sZngQQr6loqWUoIWipG5IWFkraEsbHD8mfaf9iirfjw');
  const sht_Web = sps.getSheetByName('Gastroturismo_Web');

function doGet(e) 
{
  var vista = e.parameter.vista || 'Index'; // Si no se especifica 'vista', se asume 'inicio'
  var template;
  var tituloPagina = "Aneki Gastroturismo"; // Título por defecto

  if (vista === 'Index') 
  {
    template = HtmlService.createTemplateFromFile('Index'); // Tu página principal actual
    
    // Lógica para obtener Autonomia_Pais
    var lastRow = sht_Web.getLastRow();
    var columnLN;
    if (lastRow < 2) 
    { 
      columnLN = []; 
    }
    else 
    { 
      columnLN = sht_Web.getRange("L2:N" + lastRow).getValues(); 
    }
    var columnLNdatos = columnLN.filter(function(rowItem) { return rowItem[0] !== ""; });
    var Autonomia_Pais = [];
    columnLNdatos.forEach(function(rowLNdatos) {
      Autonomia_Pais.push({ Nombre: rowLNdatos[0], Provincias: rowLNdatos[1], Usar: rowLNdatos[2] });
    });
    template.Autonomia_Pais = Autonomia_Pais;
  } 
  else if (vista === 'detalle_autonomia') 
  {
    var nombreAutonomia = e.parameter.autonomia; // Obtener el nombre de la autonomía del parámetro URL
    if (!nombreAutonomia) 
    {
        // Redirigir o mostrar error si no hay nombreAutonomia
        template = HtmlService.createTemplateFromFile('NoEncontrado');
        template.vistaSolicitada = "detalle_autonomia (sin parámetro)";
        tituloPagina = "Error: Autonomía no especificada";
    } 
    else 
    {
        tituloPagina = "Detalles de " + nombreAutonomia;
        template = HtmlService.createTemplateFromFile('DetalleAutonomia'); // Un nuevo archivo HTML para los detalles
        
        var datosDetalle = cargarDatosDetalle(nombreAutonomia);
        template.autonomia = datosDetalle; // Pasamos el objeto directamente
    }
  } 
  else if (vista === 'Sitios') 
  {
    var nombreAutonomia = e.parameter.autonomia; // Obtener el nombre de la autonomía del parámetro URL
    if (!nombreAutonomia) 
    {
        // Redirigir o mostrar error si no hay nombreAutonomia
        template = HtmlService.createTemplateFromFile('NoEncontrado');
        template.vistaSolicitada = "Sitios (sin parámetro)";
        tituloPagina = "Error: Autonomía no especificada";
    } 
    else 
    {
        template = HtmlService.createTemplateFromFile('Sitios'); // Un nuevo archivo HTML para los detalles
        
        var datosAutonomiaUM = fAutonomiaUM(nombreAutonomia);
        template.autonomia = datosAutonomiaUM; // Pasamos el objeto directamente
    }
  } 
  else if (vista === 'contacto') 
  {
    tituloPagina = "Página de Contacto";
    template = HtmlService.createTemplateFromFile('Contacto'); // Otro archivo HTML
    // No se necesitan datos especiales para este ejemplo, pero podrías cargar algunos si es necesario
  } 
  else 
  {
    tituloPagina = "Página no encontrada";
    template = HtmlService.createTemplateFromFile('NoEncontrado'); // Una página para errores 404
    template.vistaSolicitada = vista;
  }

  return template.evaluate().setTitle(tituloPagina).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Carga los detalles de una autonomía específica desde la hoja de cálculo.
 * @param {string} nombreAutonomia El nombre de la autonomía a buscar.
 * @return {object} Un objeto con los detalles de la autonomía o un mensaje de error.
 */
function cargarDatosDetalle(nombreAutonomia) {
  if (!sht_Web) {
    Logger.log("Error: La hoja 'Gastroturismo_Web' no se pudo cargar.");
    return { 
      nombre: nombreAutonomia, 
      error: "Error al cargar datos de la hoja de cálculo.",
      tipoProvincia: "N/D",
      usar: "N/D",
      descripcionProvincias: "No disponible",
      estado: "No disponible"
    };
  }

  var lastRow = sht_Web.getLastRow();
  if (lastRow < 2) { // Asumiendo que la fila 1 es de encabezados
    return { 
      nombre: nombreAutonomia, 
      error: "No hay datos para buscar.",
      tipoProvincia: "N/D",
      usar: "N/D",
      descripcionProvincias: "No disponible",
      estado: "No disponible"
    };
  }

  // Obtener valores de las columnas L (Nombre), M (Provincias), N (Usar)
  // desde la fila 2 hasta la última fila con datos.
  const datos = sht_Web.getRange("L2:N" + lastRow).getValues();
  
  for (var i = 0; i < datos.length; i++) {
    if (datos[i][0] && datos[i][0].toString().trim() === nombreAutonomia.trim()) {
      let tipoProv = datos[i][1]; // Columna M: "U" o "M"
      let usarVal = datos[i][2];  // Columna N: 1 o 0

      let descProvincias = "";
      if (tipoProv === "U") {
        descProvincias = "Uniprovincial";
      } else if (tipoProv === "M") {
        descProvincias = "Multiprovincial";
      } else {
        descProvincias = "No especificado";
      }

      let estadoActual = "";
      if (usarVal == 1) { // Usar comparación no estricta por si el valor es numérico o texto
        estadoActual = "Activa";
      } else if (usarVal == 0) {
        estadoActual = "Inactiva";
      } else {
        estadoActual = "No especificado";
      }

      return {
        nombre: datos[i][0],         // Nombre de la Autonomía (Col L)
        tipoProvinciaOriginal: tipoProv, // Valor original "U" o "M" (Col M)
        usarOriginal: usarVal,           // Valor original 1 o 0 (Col N)
        descripcionProvincias: descProvincias, // Texto descriptivo para tipoProvincia
        estado: estadoActual                 // Texto descriptivo para usar
        // Puedes añadir más campos aquí si los necesitas
      };
    }
  }

  // Si no se encuentra la autonomía
  return { 
    nombre: nombreAutonomia, 
    error: "Autonomía no encontrada.",
    tipoProvincia: "N/D",
    usar: "N/D",
    descripcionProvincias: "No disponible",
    estado: "No disponible"
  };
}

// Tu función include sigue siendo útil
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
