/* Código.gs */
/**
 * Sirve la carcasa principal de la Aplicación de Página Única (SPA).
 * Esta es la única página que se carga desde el navegador.
 */
function doGet(e) {
  return HtmlService.createTemplateFromFile('AppShell')
      .evaluate()
      .setTitle('ANeKI - Gastroturismo')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL); // Importante para Google Sites
}

/**
 * Esta función es llamada por el JavaScript del cliente para obtener el contenido de cada página.
 * @param {string} pageName El nombre de la página de contenido a cargar (ej. "inicio", "Tapeo").
 * @return {string} El contenido HTML del fichero solicitado.
 */
function getPageContent(pageName) {
  // Una lista blanca de páginas permitidas por seguridad.
  const allowedPages = ['inicio', 'tapeo', 'restaurantes', 'bodegas', 'turismo', 'eventosculinarios', 'eventosturisticos', 'tiendas', 'curiosidades'];
  
  // Si la página solicitada no está en la lista, se carga 'inicio' por defecto.
  const fileName = allowedPages.includes(pageName) ? pageName : 'inicio';
  
  // CORRECCIÓN: Se usa createHtmlOutputFromFile().getContent() para obtener el contenido como texto.
  return HtmlService.createHtmlOutputFromFile(fileName).getContent();
}
