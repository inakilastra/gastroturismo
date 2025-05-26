// VARIABLES WEB ================================================================================================================================
  const w_SS = SpreadsheetApp.openById('14OADK1_szuLpL64LX45n6VS74VUrlwOCtWDPkk8FG5Q');
  const w_Sitio = w_SS.getSheetByName('w_Sitio');
  const w_Mapa = w_SS.getSheetByName('w_Mapa');

function doGet(e)
{
  //Obtener los datos de la hoja
  var data = w_Sitio.getDataRange().getValues();
  data.shift();

  var Autonomia_Pais = "Castilla y León";
  var Provincia_Pais = "León";
  var Ciudad	       = "León";
  var Barrio         = "Humedo";

  var Sitios      = [];
  var aSitios     = {
      Nombre:      String,
      Valoracion:  String,
    	Nota:        String,
    	Direccion:   String,
    	Horario:     String,
    	Pintxo_Tapa: String,
      Maps:        String,
    	Facebook:    String,
    	Instagram:   String,
    	Web:         String,
    	Foto_1:      String,
    	Foto_2:      String,
    	Foto_3:      String,
    	Foto_4:      String
  };

  // Relleno Array Sitios
  data.forEach( row =>{
    if(row[20] == Autonomia_Pais  && row[21] == Provincia_Pais && row[22] == Ciudad && row[23] == Barrio && (row[24] == "Bar" || row[24] =="Restaurante")){
      aSitios = {Nombre: row[0],Valoracion: row[25],Nota: row[8],Direccion: row[9],Horario: row[10],Pintxo_Tapa: row[11],Maps: row[12],Facebook: row[13],Instagram: row[14],Web: row[15],Foto_1: row[16],Foto_2: row[17],Foto_3: row[18],Foto_4: row[19],Autonomia_Pais: row[20],Provincia_Pais: row[21],Ciudad: row[22],Barrio: row[23]};
      Sitios.push(aSitios); 
    }
  });

      TipoSitio    = "Tienda";
  var Tiendas      = [];
  var aTiendas     = {
      Nombre:      String,
      Valoracion:  String,
    	Nota:        String,
    	Direccion:   String,
    	Horario:     String,
    	Pintxo_Tapa: String,
      Maps:        String,
    	Facebook:    String,
    	Instagram:   String,
    	Web:         String,
    	Foto_1:      String,
    	Foto_2:      String,
    	Foto_3:      String,
    	Foto_4:      String
  };
  // Relleno Array Tiendas
  data.forEach( row =>{
    if(row[20] == Autonomia_Pais  && row[21] == Provincia_Pais && row[22] == Ciudad && row[23] == Barrio && row[24] == "Tienda"){
      aTiendas = {Nombre: row[0],Valoracion: row[25],Nota: row[8],Direccion: row[9],Horario: row[10],Pintxo_Tapa: row[11],Maps: row[12],Facebook: row[13],Instagram: row[14],Web: row[15],Foto_1: row[16],Foto_2: row[17],Foto_3: row[18],Foto_4: row[19],Autonomia_Pais: row[20],Provincia_Pais: row[21],Ciudad: row[22],Barrio: row[23]};
      Tiendas.push(aTiendas);
    }
  });

  var Turismos      = [];
  var aTurismo     = {
      Nombre:      String,
      Valoracion:  String,
    	Nota:        String,
    	Direccion:   String,
    	Horario:     String,
      Maps:        String,
    	Facebook:    String,
    	Instagram:   String,
    	Web:         String,
    	Foto_1:      String,
    	Foto_2:      String,
    	Foto_3:      String,
    	Foto_4:      String
  };

  // Relleno Array Turismos
  data.forEach( row =>{
    if(row[20] == Autonomia_Pais  && row[21] == Provincia_Pais && row[22] == Ciudad && row[24] == "Turismo"){
      aTurismo = {Nombre: row[0],Valoracion: row[25],Nota: row[8],Direccion: row[9],Horario: row[10],Maps: row[12],Facebook: row[13],Instagram: row[14],Web: row[15],Foto_1: row[16],Foto_2: row[17],Foto_3: row[18],Foto_4: row[19],Autonomia_Pais: row[20],Provincia_Pais: row[21],Ciudad: row[22]};
      Turismos.push(aTurismo); 
    }
  });

  //Obtener los datos de la hoja
  var data = w_Mapa.getDataRange().getValues();
  data.shift();

  var Mapas      = [];
  var aMapas     = {
      Mapa:         String
  };

  // Relleno Array Mapas
  data.forEach( row =>{
    if(row[0] == Autonomia_Pais && row[1] == Provincia_Pais && row[2] == Ciudad && row[3] == Barrio){
      aMapas = {Mapa: row[4]};
      Mapas.push(aMapas);
    }
  });

  //Carga la pagina icluyendo los sitios
  var template = HtmlService.createTemplateFromFile('Index');
  template.Sitios = Sitios; 
  template.Tiendas = Tiendas;
  template.Turismos = Turismos;
  template.Mapas = Mapas;

  var output = template.evaluate();
  return output;
}

function include( filename ){
  return HtmlService.createHtmlOutputFromFile( filename ).getContent();
}  
