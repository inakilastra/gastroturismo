// VARIABLES WEB ================================================================================================================================
  const w_SS = SpreadsheetApp.openById('1sZngQQr6loqWUoIWipG5IWFkraEsbHD8mfaf9iirfjw');
  const w_Datos = w_SS.getSheetByName('Datos_Web');


function doGet(e)
{
  var page = e.parameter.page || 'Index'; // Si no se especifica 'vista', se asume 'inicio'
  var template;

  //Obtener los datos de la hoja
  var data = w_Datos.getDataRange().getValues();
  data.shift();

  if (page === 'Index') {
    var Autonomias = data.map(function(fila) {
      return [fila[0]];
    });
    Autonomias.sort();
    var Autonomia_Pais      = [];
    var aAutonomia_Pais     = {
        Autonomia_Pais:         String
    };
    var Autonomia_Actual = "";

    // Relleno Array Autonomia_Pais
    Autonomias.forEach( row =>{
      if(row[0] != Autonomia_Actual){
        aAutonomia_Pais = {Autonomia: row[0]};
        Autonomia_Pais.push(aAutonomia_Pais);
        Autonomia_Actual = row[0];
      }
    });

    //Carga la pagina icluyendo los sitios
    template = HtmlService.createTemplateFromFile('Index');
    template.Autonomia_Pais = Autonomia_Pais;
  } 
  else if (page === 'Provincia') 
  {
    var nombreAutonomia = e.parameter.autonomia; // Obtener el nombre de la autonomía del parámetro URL
    if (!nombreAutonomia) 
    {
      // Redirigir o mostrar error si no hay nombreAutonomia
      template = HtmlService.createTemplateFromFile('NoEncontrado');
      template.vistaSolicitada = "detalle_autonomia (sin parámetro)";
    }    
    else 
    {
      // Si la URL solicita la página 'Provincias'
      var autonomiaSeleccionada = e.parameter.autonomia; // Obtiene el parámetro 'autonomia'
      template = HtmlService.createTemplateFromFile('Provincia');
      template.autonomia = autonomiaSeleccionada; // Pasa el nombre de la autonomía a la plantilla Provincias.html    
      
      var ProvinciasAutomomia = data.filter(function(fila) {
        return fila[0] === autonomiaSeleccionada && fila[1] && fila[1].toString().trim() !== "";
      }).map(function(fila) {
        return fila[1].toString().trim();
      });


      ProvinciasAutomomia.sort();
      var Provincias      = [];
      var Provincia_Actual = "";

      // Relleno Array Provincias
      ProvinciasAutomomia.forEach(function(nombreProvincia) {
        if (nombreProvincia !== Provincia_Actual) {
          Provincias.push({ NombreProvincia: nombreProvincia });
          Provincia_Actual = nombreProvincia;
        }
      }); 
           
      //template = HtmlService.createTemplateFromFile('Provincia'); // Un nuevo archivo HTML para los detalles
      template.Provincias = Provincias; // Pasamos el objeto directamente
    }
  } 
  var output = template.evaluate();
  return output;
}

function include( filename ){
  return HtmlService.createHtmlOutputFromFile( filename ).getContent();
}  

