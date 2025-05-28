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

/**
 * Obtiene una imagen de Google Drive por su ID y la devuelve como una cadena Base64.
 *
 * @param {string} driveId El ID del archivo en Google Drive.
 * @return {string|null} La cadena de datos Base64 de la imagen (ej: "data:image/jpeg;base64,...") o null si hay un error.
 */
function getImageAsBase64(driveId) {
  if (!driveId) {
    console.error("No se proporcionó un ID de Drive.");
    return null;
  }
  try {
    const file = DriveApp.getFileById(driveId);
    const MimeType = file.getMimeType(); // Obtener el tipo MIME del archivo

    // Asegurarse de que es un tipo de imagen soportado
    if (MimeType && MimeType.startsWith("image/")) {
      const blob = file.getBlob();
      const base64Data = Utilities.base64Encode(blob.getBytes());
      console.log("Imagen " + driveId + " convertida a Base64 exitosamente. Tipo MIME: " + MimeType);
      return "data:" + MimeType + ";base64," + base64Data;
    } else {
      console.error("El archivo con ID '" + driveId + "' no es un tipo de imagen reconocido o no tiene tipo MIME. Tipo detectado: " + MimeType);
      return null;
    }
  } catch (e) {
    console.error("Error al obtener imagen de Drive (ID: '" + driveId + "'): " + e.toString());
    // Podrías querer devolver un indicador de error específico o una imagen placeholder en Base64 aquí
    return null;
  }
}

function doGet_OLD(e) {
  var output;
  var template;

  // Obtener los datos de la hoja
  var data = w_Datos.getDataRange().getValues();
  data.shift(); // Eliminar la fila de encabezados

  // Logger.log("Parámetro page: " + e.parameter.page);
  // Logger.log("Todos los parámetros: " + JSON.stringify(e.parameter));

  if (e.parameter.page === "Sitio") {
    // Logger.log("Entrando en page === Sitio");
    template = HtmlService.createTemplateFromFile('Sitio');
    var eBarrio = e.parameter.barrio;
    template.barrio = eBarrio;

    // Filtrar sitios basados en el barrio.
    var SitiosBarrio = data.filter(function(fila) {
      return fila[3] === eBarrio && 
             fila[4] && fila[4].toString().trim() !== "" && // Nombre del sitio en fila[4]
             fila[5] !== undefined && // Nota del sitio en fila[5], puede ser string vacío
             fila[6] !== undefined &&
             fila[7] !== undefined &&
             fila[8] !== undefined &&
             fila[9] !== undefined &&
             fila[10] !== undefined &&
             fila[11] !== undefined &&
             fila[12] !== undefined &&
             fila[13] !== undefined &&
             fila[14] !== undefined &&
             fila[15] !== undefined &&
             fila[16] !== undefined &&
             fila[17] !== undefined &&
             fila[18] !== undefined;
    }).map(function(fila) {
      return { 
        Nombre: fila[4].toString().trim(),
        Nota: fila[5] !== null && fila[5] !== undefined ? fila[5].toString().trim() : "", // Manejar si la nota es null o undefined
        Direccion: fila[6] !== null && fila[6] !== undefined ? fila[6].toString().trim() : "",	
        Horario: fila[7] !== null && fila[7] !== undefined ? fila[7].toString().trim() : "",
        Pintxo_Tapa: fila[8] !== null && fila[8] !== undefined ? fila[8].toString().trim() : "",	
        Maps: fila[9] !== null && fila[9] !== undefined ? fila[9].toString().trim() : "",	
        Facebook: fila[10] !== null && fila[10] !== undefined ? fila[10].toString().trim() : "",	
        Instagram: fila[11] !== null && fila[11] !== undefined ? fila[11].toString().trim() : "",	
        Web: fila[12] !== null && fila[12] !== undefined ? fila[12].toString().trim() : "",	
        Foto1: fila[13] !== null && fila[13] !== undefined ? fila[13].toString().trim() : "",	
        Foto2: fila[14] !== null && fila[14] !== undefined ? fila[14].toString().trim() : "",	
        Foto3: fila[15] !== null && fila[15] !== undefined ? fila[15].toString().trim() : "",	
        Foto4: fila[16] !== null && fila[16] !== undefined ? fila[16].toString().trim() : "",	
        Tipo_Lugar: fila[17] !== null && fila[17] !== undefined ? fila[17].toString().trim() : "",	
        Valoracion: fila[18] !== null && fila[18] !== undefined ? fila[18].toString().trim() : ""
      };
    });

    // Ordenar los objetos de sitio por la propiedad 'Nombre'
    SitiosBarrio.sort(function(a, b) {
      return a.Nombre.localeCompare(b.Nombre);
    });

    var Sitios = [];
    var NombreSitio_Actual = ""; // Para asegurar sitios únicos por nombre

    SitiosBarrio.forEach(function(datosSitio) { 
      if (datosSitio.Nombre !== NombreSitio_Actual) {
        Sitios.push({ 
          Nombre: datosSitio.Nombre,
          Nota: datosSitio.Nota,
          Direccion: datosSitio.Direccion,	
          Horario: datosSitio.Horario,
          Pintxo_Tapa: datosSitio.Pintxo_Tapa,	
          Maps: datosSitio.Maps,	
          Facebook: datosSitio.Facebook,	
          Instagram: datosSitio.Instagram,	
          Web: datosSitio.Web,	
          Foto1: datosSitio.Foto1,	
          Foto2: datosSitio.Foto2,	
          Foto3: datosSitio.Foto3,
          Foto4: datosSitio.Foto4,
          Tipo_Lugar: datosSitio.Tipo_Lugar,	
          Valoracion: datosSitio.Valoracion
        });
        NombreSitio_Actual = datosSitio.Nombre;
      }
    }); 
    
    template.Sitios = Sitios; 
    output = template.evaluate().setTitle("Sitios de " + eBarrio);

  } else if (e.parameter.page === "Barrio") {
    // Logger.log("Entrando en page === Barrio");
    var eCiudad = e.parameter.ciudad;

    var todosLosNombresDeBarriosParaCiudad = data.filter(function(fila) {
      return fila[2] === eCiudad && fila[3] && fila[3].toString().trim() !== "";
    }).map(function(fila) {
      return fila[3].toString().trim();
    });

    var nombresDeBarriosUnicosParaCiudad = todosLosNombresDeBarriosParaCiudad.filter(function(value, index, self) {
      return value && value.toString().trim() !== "" && self.indexOf(value) === index;
    });
    
    if (nombresDeBarriosUnicosParaCiudad.length === 1 && nombresDeBarriosUnicosParaCiudad[0] === eCiudad) {
      // Logger.log("Condición cumplida: Un solo barrio único y es igual al de la ciudad. Cargando plantilla Sitio.");
      template = HtmlService.createTemplateFromFile('Sitio'); 
      var nombreBarrioUnico = nombresDeBarriosUnicosParaCiudad[0]; 
      
      template.barrio = nombreBarrioUnico; 

      // Lógica para cargar sitios, AHORA CONSISTENTE con la sección "Sitio"
      var SitiosDelBarrioUnico = data.filter(function(fila) {
        return fila[3] === nombreBarrioUnico && 
               fila[4] && fila[4].toString().trim() !== "" && // Nombre del sitio en fila[4]
               fila[5] !== undefined && // Nota del sitio en fila[5]
               fila[6] !== undefined &&
              fila[7] !== undefined &&
              fila[8] !== undefined &&
              fila[9] !== undefined &&
              fila[10] !== undefined &&
              fila[11] !== undefined &&
              fila[12] !== undefined &&
              fila[13] !== undefined &&
              fila[14] !== undefined &&
              fila[15] !== undefined &&
              fila[16] !== undefined &&
              fila[17] !== undefined &&
              fila[18] !== undefined;
      }).map(function(fila) {
        return {
          Nombre: fila[4].toString().trim(),
          Nota: fila[5] !== null && fila[5] !== undefined ? fila[5].toString().trim() : "",
          Direccion: fila[6] !== null && fila[6] !== undefined ? fila[6].toString().trim() : "",	
          Horario: fila[7] !== null && fila[7] !== undefined ? fila[7].toString().trim() : "",
          Pintxo_Tapa: fila[8] !== null && fila[8] !== undefined ? fila[8].toString().trim() : "",	
          Maps: fila[9] !== null && fila[9] !== undefined ? fila[9].toString().trim() : "",	
          Facebook: fila[10] !== null && fila[10] !== undefined ? fila[10].toString().trim() : "",	
          Instagram: fila[11] !== null && fila[11] !== undefined ? fila[11].toString().trim() : "",	
          Web: fila[12] !== null && fila[12] !== undefined ? fila[12].toString().trim() : "",	
          Foto1: fila[13] !== null && fila[13] !== undefined ? fila[13].toString().trim() : "",	
          Foto2: fila[14] !== null && fila[14] !== undefined ? fila[14].toString().trim() : "",	
          Foto3: fila[15] !== null && fila[15] !== undefined ? fila[15].toString().trim() : "",	
          Foto4: fila[16] !== null && fila[16] !== undefined ? fila[16].toString().trim() : "",	
          Tipo_Lugar: fila[17] !== null && fila[17] !== undefined ? fila[17].toString().trim() : "",	
          Valoracion: fila[18] !== null && fila[18] !== undefined ? fila[18].toString().trim() : ""
        };
      });

      SitiosDelBarrioUnico.sort(function(a, b) {
        return a.Nombre.localeCompare(b.Nombre);
      });

      var SitiosParaPlantilla = [];
      var NombreSitioActualParaPlantilla = "";

      SitiosDelBarrioUnico.forEach(function(datosSitio) {
        if (datosSitio.Nombre !== NombreSitioActualParaPlantilla) {
          SitiosParaPlantilla.push({ 
            Nombre: datosSitio.Nombre,
          Nota: datosSitio.Nota,
          Direccion: datosSitio.Direccion,	
          Horario: datosSitio.Horario,
          Pintxo_Tapa: datosSitio.Pintxo_Tapa,	
          Maps: datosSitio.Maps,	
          Facebook: datosSitio.Facebook,	
          Instagram: datosSitio.Instagram,	
          Web: datosSitio.Web,	
          Foto1: datosSitio.Foto1,	
          Foto2: datosSitio.Foto2,	
          Foto3: datosSitio.Foto3,
          Foto4: datosSitio.Foto4,
          Tipo_Lugar: datosSitio.Tipo_Lugar,	
          Valoracion: datosSitio.Valoracion
          });
          NombreSitioActualParaPlantilla = datosSitio.Nombre;
        }
      }); 
      
      template.Sitios = SitiosParaPlantilla; 
      output = template.evaluate().setTitle("Sitios en " + nombreBarrioUnico);

    } else {
      // Logger.log("Condición NO cumplida o hay múltiples barrios únicos. Cargando plantilla Barrio.");
      template = HtmlService.createTemplateFromFile('Barrio');
      template.ciudad = eCiudad; 
      
      nombresDeBarriosUnicosParaCiudad.sort(); 
      
      var BarriosParaPlantilla = [];
      nombresDeBarriosUnicosParaCiudad.forEach(function(nombreBarrio) {
        BarriosParaPlantilla.push({ Barrio: nombreBarrio }); 
      }); 
      
      template.Barrios = BarriosParaPlantilla; 
      output = template.evaluate().setTitle("Barrios de " + eCiudad);
    }

  } else if (e.parameter.page === "Ciudad") {
    // Logger.log("Entrando en page === Ciudad");
    var eProvincia = e.parameter.provincia;

    var todosLosNombresDeCiudadesParaProvincia = data.filter(function(fila) {
      return fila[1] === eProvincia && fila[2] && fila[2].toString().trim() !== "";
    }).map(function(fila) {
      return fila[2].toString().trim();
    });

    var nombresDeCiudadesUnicasParaProvincia = todosLosNombresDeCiudadesParaProvincia.filter(function(value, index, self) {
        return value && value.toString().trim() !== "" && self.indexOf(value) === index;
    });

    if (nombresDeCiudadesUnicasParaProvincia.length === 1 && nombresDeCiudadesUnicasParaProvincia[0] === eProvincia) {
        // Logger.log("Condición cumplida: Una sola ciudad única y su nombre es igual al de la provincia. Cargando plantilla Barrio.");
        template = HtmlService.createTemplateFromFile('Barrio');
        var nombreCiudadUnica = nombresDeCiudadesUnicasParaProvincia[0];

        template.ciudad = nombreCiudadUnica; 

        var todosLosNombresDeBarriosParaCiudadUnica = data.filter(function(fila) {
            return fila[2] === nombreCiudadUnica && fila[3] && fila[3].toString().trim() !== "";
        }).map(function(fila) {
            return fila[3].toString().trim();
        });
        
        var nombresDeBarriosUnicosParaCiudadUnica = todosLosNombresDeBarriosParaCiudadUnica.filter(function(value, index, self) {
            return value && value.toString().trim() !== "" && self.indexOf(value) === index;
        });

        nombresDeBarriosUnicosParaCiudadUnica.sort();
        var BarriosParaPlantilla = [];
        nombresDeBarriosUnicosParaCiudadUnica.forEach(function(nombreBarrio) {
            BarriosParaPlantilla.push({ Barrio: nombreBarrio });
        });

        template.Barrios = BarriosParaPlantilla;
        output = template.evaluate().setTitle("Barrios en " + nombreCiudadUnica);

    } else {
        template = HtmlService.createTemplateFromFile('Ciudad');
        template.provincia = eProvincia;

        nombresDeCiudadesUnicasParaProvincia.sort();
        var CiudadesParaPlantilla = [];
        nombresDeCiudadesUnicasParaProvincia.forEach(function(nombreCiudad) {
            CiudadesParaPlantilla.push({ Ciudad: nombreCiudad });
        });
        
        template.Ciudades = CiudadesParaPlantilla; 
        output = template.evaluate().setTitle("Ciudades de " + eProvincia);
    }

  } else if (e.parameter.page === "Provincia") {
    var eAutonomia = e.parameter.autonomia;

    var todasLasProvinciasParaAutonomia = data.filter(function(fila) {
      return fila[0] === eAutonomia && fila[1] && fila[1].toString().trim() !== "";
    }).map(function(fila) {
      return fila[1].toString().trim();
    });
    
    var nombresDeProvinciasUnicasParaAutonomia = todasLasProvinciasParaAutonomia.filter(function(value, index, self) {
        return value && value.toString().trim() !== "" && self.indexOf(value) === index;
    });

    if (nombresDeProvinciasUnicasParaAutonomia.length === 1 && nombresDeProvinciasUnicasParaAutonomia[0] === eAutonomia) {
        template = HtmlService.createTemplateFromFile('Ciudad');
        var nombreProvinciaUnica = nombresDeProvinciasUnicasParaAutonomia[0];

        template.provincia = nombreProvinciaUnica; 

        var todasLasCiudadesParaProvinciaUnica = data.filter(function(fila) {
            return fila[1] === nombreProvinciaUnica && fila[2] && fila[2].toString().trim() !== "";
        }).map(function(fila) {
            return fila[2].toString().trim();
        });

        var nombresDeCiudadesUnicasParaProvinciaUnica = todasLasCiudadesParaProvinciaUnica.filter(function(value, index, self) {
            return value && value.toString().trim() !== "" && self.indexOf(value) === index;
        });
        
        nombresDeCiudadesUnicasParaProvinciaUnica.sort();
        var CiudadesParaPlantilla = [];
        nombresDeCiudadesUnicasParaProvinciaUnica.forEach(function(nombreCiudad) {
            CiudadesParaPlantilla.push({ Ciudad: nombreCiudad });
        });

        template.Ciudades = CiudadesParaPlantilla;
        output = template.evaluate().setTitle("Ciudades en " + nombreProvinciaUnica);

    } else {
        template = HtmlService.createTemplateFromFile('Provincia');
        template.autonomia = eAutonomia;

        nombresDeProvinciasUnicasParaAutonomia.sort();
        var ProvinciasParaPlantilla = [];
        nombresDeProvinciasUnicasParaAutonomia.forEach(function(nombreProvincia) {
            ProvinciasParaPlantilla.push({ Provincia: nombreProvincia });
        });
        
        template.Provincias = ProvinciasParaPlantilla;
        output = template.evaluate().setTitle("Provincias de " + eAutonomia);
    }

  } 
  else 
  { 
    template = HtmlService.createTemplateFromFile('Index');
    var AutonomiasUnicas = data.map(function(fila) {
      return fila[0]; 
    }).filter(function(value, index, self) {
      return value && value.toString().trim() !== "" && self.indexOf(value) === index; 
    });

    AutonomiasUnicas.sort();
    var Autonomia_Pais = [];

    AutonomiasUnicas.forEach( function(nombreAutonomia){
      Autonomia_Pais.push({Autonomia: nombreAutonomia});
    });
    
    template.Autonomia_Pais = Autonomia_Pais; 
    output = template.evaluate().setTitle("ANeKI - GastroTurismo");
  }
  output.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  return output;
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
