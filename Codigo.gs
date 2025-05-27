function doGet(e) {
  // Sirve el archivo HTML. Asegúrate de que el nombre 'index' coincida
  // con el nombre de tu archivo HTML en el proyecto de Apps Script.
  return HtmlService.createHtmlOutputFromFile('Index') 
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}
