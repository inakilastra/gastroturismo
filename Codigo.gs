// VARIABLES WEB ================================================================================================================================
  const w_SS = SpreadsheetApp.openById('1sZngQQr6loqWUoIWipG5IWFkraEsbHD8mfaf9iirfjw');
  const w_Datos = w_SS.getSheetByName('Datos_Web');

function doGet(e) {
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
