function fAutonomiaUM(nombreAutonomia) 
{
  if (fsht_Web().status == "OK") 
  {
    var lastRow = sht_Web.getLastRow();
    if (lastRow > 1) 
    {
      // Obtener valores de las columnas L (Nombre), M (Provincias), N (Usar)
      // desde la fila 2 hasta la última fila con datos.
      const datos = sht_Web.getRange("L2:M" + lastRow).getValues();
      
      for (var i = 0; i < datos.length; i++) 
      {
        if (datos[i][0] && datos[i][0].toString().trim() === nombreAutonomia.trim()) 
        {
          let tipoAuto = datos[i][1]; // Columna M: "U" o "M"

          return {
            nombre: datos[i][0],         // Nombre de la Autonomía (Col L)
            tipo: tipoAuto, // Valor original "U" o "M" (Col M)
          };
        }
      }
      // Si no se encuentra la autonomía
      return { 
        nombre: nombreAutonomia, 
        error: "Autonomía no encontrada.",
        tipo: "N/D",
      };
    }
    return { error: "Error al cargar datos. fsht_Web_rows " + lastRow };
  }
  return { error: "Error al cargar datos. fsht_Web"};
}

function fProvincias(nombreAutonomia) 
{
  if (fsht_Web().status == "OK") 
  {
    var lastRow = sht_Web.getLastRow();
    if (lastRow > 1) 
    {
      // Obtener valores de las columnas V (Nombre Autonomía) y W (Provincias como string)
      const rangoDatos = sht_Web.getRange("V2:W" + lastRow);
      const valores = rangoDatos.getValues();

      for (let i = 0; i < valores.length; i++) 
      {
        const autonomiaEnHoja = valores[i][0]; // Contenido de la columna V
        
        // Comprobar si la celda de la autonomía no está vacía antes de procesar
        if (autonomiaEnHoja && autonomiaEnHoja.toString().trim().toLowerCase() === nombreAutonomia.trim().toLowerCase()) 
        {
          const provinciasString = valores[i][1]; // Contenido de la columna W
          let listaDeProvincias = [];

          if (provinciasString && provinciasString.toString().trim() !== "") 
          {
            // Convertir la cadena de provincias (separadas por coma) en un array
            listaDeProvincias = provinciasString.toString().split(',')
                                            .map(provincia => provincia.trim()) // Quitar espacios extra de cada provincia
                                            .filter(provincia => provincia !== ""); // Quitar elementos vacíos si hay comas extra
          }
          // ÉXITO: Devuelve directamente el array de provincias
          return listaDeProvincias; 
        }
      }
          
      // Si el bucle termina, la autonomía no se encontró
      return null;
    }
    return { error: "Error al cargar datos. fsht_Web_rows " + lastRow };
  }
  return { error: "Error al cargar datos. fsht_Web"};
}

function fsht_Web()
{
  if (!sht_Web) 
  {
    return { 
      status: "Error"
    };
  }
  return { 
    status: "OK"
  };
}
