/**
 * @OnlyCurrentDoc
 */

function doGet(e) {
  var pageParameter = e.parameter.page; // Renombrado para claridad
  var pageName = 'Index'; // Página por defecto
  var activePage = 'inicio'; // Valor para la clase activa

  if (pageParameter === 'tapeo') {
    pageName = 'Tapeo';
    activePage = 'tapeo';
  } else if (pageParameter === 'restaurantes') {
    pageName = 'Restaurantes';
    activePage = 'restaurantes';
  } else if (pageParameter === 'bodegas') {
    pageName = 'Bodegas';
    activePage = 'bodegas';
  } else if (pageParameter === 'turismo') {
    pageName = 'Turismo';
    activePage = 'turismo';
  } else if (pageParameter === 'eventosculinarios') {
    pageName = 'EventosCulinarios';
    activePage = 'eventosculinarios';
  } else if (pageParameter === 'eventosturisticos') {
    pageName = 'EventosTuristicos';
    activePage = 'eventosturisticos';
  } else if (pageParameter === 'tiendas') {
    pageName = 'Tiendas';
    activePage = 'tiendas';
  } else if (pageParameter === 'curiosidades') {
    pageName = 'Curiosidades';
    activePage = 'curiosidades';
  }

  return loadPageWithModularTemplates_(pageName, activePage);
}

function loadPageWithModularTemplates_(pageName, activePage) {
  var plantillaCssHtml = HtmlService.createTemplateFromFile('PlantillaCSS').evaluate().getContent();
  var plantillaHeaderHtml = HtmlService.createTemplateFromFile('PlantillaHeader').evaluate().getContent();
  
  var plantillaAsideTemplate = HtmlService.createTemplateFromFile('PlantillaAside');
  plantillaAsideTemplate.url = getWebAppUrl(); // URL base para enlaces
  plantillaAsideTemplate.activePage = activePage; // Para la clase 'mdc-list-item--activated'
  var plantillaAsideHtml = plantillaAsideTemplate.evaluate().getContent();
  
  var plantillaFooterHtml = HtmlService.createTemplateFromFile('PlantillaFooter').evaluate().getContent();
  var plantillaJavaScriptHtml = HtmlService.createTemplateFromFile('PlantillaJavaScript').evaluate().getContent();

  var mainPageTemplate = HtmlService.createTemplateFromFile(pageName);
  mainPageTemplate.plantillaCSS = plantillaCssHtml;
  mainPageTemplate.plantillaHeader = plantillaHeaderHtml;
  mainPageTemplate.plantillaAside = plantillaAsideHtml;
  mainPageTemplate.plantillaFooter = plantillaFooterHtml;
  mainPageTemplate.plantillaJS = plantillaJavaScriptHtml;

    var titlePrefix = 'ANeKI - ';
  var pageTitleName;

  switch (pageName) {
    case 'Index':
      pageTitleName = 'Inicio';
      break;
    case 'EventosCulinarios':
      pageTitleName = 'Eventos Culinarios'; // Añadir espacio para legibilidad
      break;
    case 'EventosTuristicos':
      pageTitleName = 'Eventos Turísticos'; // Añadir espacio para legibilidad
      break;
    // Para los demás casos, podemos usar el pageName directamente si es legible
    // o añadir más casos si se necesita una transformación específica.
    default:
      pageTitleName = pageName; // Ej: "Tapeo", "Restaurantes", "Bodegas", etc.
      break;
  }
  var title = titlePrefix + pageTitleName;
  return mainPageTemplate.evaluate().setTitle(title).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

function getWebAppUrl() {
  return ScriptApp.getService().getUrl();
}
