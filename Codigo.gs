const CSV_URLS = {
  tapeo: "https://docs.google.com/spreadsheets/d/e/2PACX-1vTwnZA7s0yysf5rIflyyj6WNhe_XddN2OCZ6SBJfB06LFm7fANQeZfHTs7GtSlLVXmNoG16BhVStAkD/pub?gid=47128061&single=true&output=csv",
  // Añade aquí tus otras URLs de CSV cuando las tengas
};

function doGet(e) {
  return HtmlService.createTemplateFromFile('inicio')
    .evaluate()
    .setTitle("ANeKI - Gastroturismo")
    .addMetaTag('viewport', 'width=device-width, initial-scale=1.0');
}

function getPageData(pageName) {
  try {
    if (CSV_URLS[pageName]) {
      const url = CSV_URLS[pageName];
      if (url.startsWith("URL_PARA_")) { throw new Error(`La URL del CSV para '${pageName}' no está configurada.`); }
      const csvText = UrlFetchApp.fetch(url).getContentText();
      const headers = csvText.slice(0, csvText.indexOf("\n")).trim().split(",");
      const data = Utilities.parseCsv(csvText).slice(1).map(row => {
        const obj = {};
        headers.forEach((header, i) => obj[header.trim()] = row[i]);
        return obj;
      });
      return { page: pageName, data: data };
    }
    return { page: pageName, data: null };
  } catch (e) {
    return { page: pageName, error: e.toString() };
  }
}
