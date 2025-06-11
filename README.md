# Gastroturismo

## IMPORTANTE Tengo los datos en una hoja Google Sheet con difrendtes libros

## IMPORTANTE Uso Google Apps Script para generar las paginas

## IMPORTANTE Las paginas las coloco en un iframe en Google Sites

## Codigo.gs 
 * Sirve la carcasa principal de la Aplicación de Página Única (SPA).
 * Esta es la única página que se carga desde el navegador.

Quiero adpatar el codigo para que te mostrare con este resultado, pero adaptado al proyecto y sus estilos en tapeo.html modificando los ficheros necesarios:

1. Seleccionar una autonomia
  ![image](https://github.com/user-attachments/assets/b22f4ed8-9d98-4fce-914c-8c9659455e6c)
2. Seleccionar una provincia, en caso de que la autonomia tenga una sola provincia automaticamente mostrar las ciudades de la provincia
  ![image](https://github.com/user-attachments/assets/c12d534d-80e3-4ff5-bfc1-5415bceacdd0)
3. Seleccionar una ciudad, en caso de que la provincia tenga una sola ciudad automaticamente mostrar los barrios de la ciudad
  ![image](https://github.com/user-attachments/assets/705c005b-5cb5-49ca-9521-2640f1913ed2)
4. Seleccionar una barrio, en caso de que la ciudad tenga un solo barrios automaticamente mostrar los sitios de tapeo
  ![image](https://github.com/user-attachments/assets/5ec35f8e-e1de-4cb6-90c6-30f5b281305f)
5. Mostrar un listado de los sitios del barrio
   ![image](https://github.com/user-attachments/assets/ae4dd210-6309-4d0f-bcbf-af9918a524a0)

Cosas a tener en cuante el boton "volver" tiene que tener en cuenta si lo elegido tiene una o varias opciones para volver un paso o los necesarios

Los estilos CSS validos son lo ya exitentes adapta tapeo.html a ellos.

Este es el codigo que funciona y tienes que adaptar al proyecto SOLO para tapeo.html:

codigo.gs:
//
/**
 * @OnlyCurrentDoc
 */

// Nombre de la hoja de cálculo donde están los datos.
const SHEET_NAME = "Datos_Tapeo";

// OPCIONAL: Si quieres usar una hoja de cálculo específica por su ID en lugar de la vinculada al script.
const SPREADSHEET_ID = "1sZngQQr6loqWUoIWipG5IWFkraEsbHD8mfaf9iirfjw"; 

/**
 * Función principal que se ejecuta cuando se accede a la URL de la aplicación web.
 * Sirve el archivo HTML principal.
 * @param {Object} e - El objeto de evento.
 * @return {HtmlOutput} El servicio HTML para mostrar la página.
 */
function doGet(e) {
  return HtmlService.createTemplateFromFile('Index').evaluate()
      .setTitle('ANeKI - GastroTurismo Moderno')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/**
 * Incluye el contenido de otro archivo HTML dentro de una plantilla.
 * Esto es útil para modularizar el HTML (por ejemplo, para CSS o JavaScript).
 * @param {string} filename - El nombre del archivo HTML a incluir (sin la extensión .html).
 * @return {string} El contenido del archivo HTML.
 */
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}

/**
 * Obtiene todos los datos de la hoja especificada y los convierte en un array de objetos.
 * Asume que la primera fila de la hoja contiene los encabezados de las columnas.
 * @return {Array<Object>} Un array de objetos, donde cada objeto representa una fila.
 */
function getSheetData() {
  try {
    let ss;
    // Descomenta la siguiente línea y comenta la de getActiveSpreadsheet() si quieres usar SPREADSHEET_ID.
    // Asegúrate de haber definido SPREADSHEET_ID arriba con el ID correcto.
    ss = SpreadsheetApp.openById(SPREADSHEET_ID); 
    
    // Por defecto, usa la hoja de cálculo a la que está vinculado el script.
    //ss = SpreadsheetApp.getActiveSpreadsheet(); 

    const sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      console.error("Hoja no encontrada: " + SHEET_NAME);
      return [];
    }
    const range = sheet.getDataRange();
    const values = range.getValues();
    
    if (values.length < 2) { // Necesita al menos una fila de cabecera y una de datos
      console.log("No hay suficientes datos en la hoja: " + SHEET_NAME);
      return [];
    }

    const headers = values[0].map(header => String(header).trim()); // Primera fila como cabeceras
    const data = [];

    for (let i = 1; i < values.length; i++) {
      const row = values[i];
      // Solo procesar filas que tengan al menos un valor en la columna 'Nombre' (o la primera columna)
      if (row[headers.indexOf("Nombre")] || row[0]) { 
        const entry = {};
        headers.forEach((header, index) => {
          if (header) { // Solo añadir propiedad si la cabecera no está vacía
            entry[header] = row[index];
          }
        });
        data.push(entry);
      }
    }
    // console.log("Datos obtenidos de la hoja:", data.length > 0 ? data[0] : "Vacío"); // Log del primer objeto para depuración
    return data;
  } catch (error) {
    console.error("Error en getSheetData: " + error.toString());
    console.error("Stack: " + error.stack);
    return []; // Devuelve un array vacío en caso de error
  }
}

/**
 * Obtiene una lista única de autonomías/países.
 * @return {Array<Object>} Un array de objetos, cada uno con la propiedad "Autonomia".
 */
function getAutonomias() {
  const data = getSheetData();
  const autonomias = [...new Set(data.map(item => item.Autonomia))]
                      .filter(Boolean) // Filtra valores nulos o vacíos
                      .map(autonomia => ({ Autonomia: autonomia }));
  // console.log("Autonomías procesadas:", autonomias);
  return autonomias;
}

/**
 * Obtiene una lista única de provincias para una autonomía/país dada.
 * @param {string} autonomia - El nombre de la autonomía/país.
 * @return {Array<Object>} Un array de objetos, cada uno con la propiedad "Provincia".
 */
function getProvincias(autonomia) {
  const data = getSheetData();
  const provincias = [...new Set(data.filter(item => item.Autonomia === autonomia)
                                     .map(item => item.Provincia))]
                       .filter(Boolean)
                       .map(provincia => ({ Provincia: provincia }));
  // console.log("Provincias para " + autonomia + ":", provincias);
  return provincias;
}

/**
 * Obtiene una lista única de ciudades para una provincia dada.
 * @param {string} provincia - El nombre de la provincia.
 * @return {Array<Object>} Un array de objetos, cada uno con la propiedad "Ciudad".
 */
function getCiudades(provincia) {
  const data = getSheetData();
  const ciudades = [...new Set(data.filter(item => item.Provincia === provincia)
                                   .map(item => item.Ciudad))]
                     .filter(Boolean)
                     .map(ciudad => ({ Ciudad: ciudad }));
  // console.log("Ciudades para " + provincia + ":", ciudades);
  return ciudades;
}

/**
 * Obtiene una lista única de barrios para una ciudad dada.
 * @param {string} ciudad - El nombre de la ciudad.
 * @return {Array<Object>} Un array de objetos, cada uno con la propiedad "Barrio".
 */
function getBarrios(ciudad) {
  const data = getSheetData();
  const barrios = [...new Set(data.filter(item => item.Ciudad === ciudad)
                                 .map(item => item.Barrio))]
                   .filter(Boolean)
                   .map(barrio => ({ Barrio: barrio }));
  // console.log("Barrios para " + ciudad + ":", barrios);
  return barrios;
}

/**
 * Obtiene una lista de sitios para un barrio dado.
 * Devuelve todos los campos definidos en la hoja para esos sitios.
 * @param {string} barrio - El nombre del barrio.
 * @return {Array<Object>} Un array de objetos, donde cada objeto representa un sitio con todas sus propiedades.
 */
function getSitios(barrio) {
  const data = getSheetData();
  const sitios = data.filter(item => item.Barrio === barrio);
  // console.log("Sitios para " + barrio + ":", sitios.length > 0 ? sitios[0] : "Ninguno"); // Log del primer sitio para depuración
  return sitios; // Devuelve los objetos completos del sitio
}

/**
 * Obtiene una imagen de Google Drive como una cadena Base64.
 * @param {string} fileId - El ID del archivo de imagen en Google Drive.
 * @return {string|null} La imagen como una cadena Base64 (data URL), o null si ocurre un error.
 */
function getImageAsBase64(fileId) {
  if (!fileId || typeof fileId !== 'string' || fileId.trim() === "") {
    // console.log("getImageAsBase64: fileId inválido o vacío.");
    return null;
  }
  try {
    const file = DriveApp.getFileById(fileId);
    const contentType = file.getMimeType();
    if (contentType.startsWith("image/")) {
      const base64Image = "data:" + contentType + ";base64," + Utilities.base64Encode(file.getBlob().getBytes());
      return base64Image;
    } else {
      // console.warn("getImageAsBase64: El archivo con ID " + fileId + " no es una imagen. MimeType: " + contentType);
      return null;
    }
  } catch (e) {
    console.error("Error en getImageAsBase64 para fileId '" + fileId + "': " + e.toString());
    return null;
  }
}
//

tapeo.html
//
<!DOCTYPE html>
<html>
<head>
  <base target="_top">
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ANeKI - GastroTurismo Moderno</title>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
  <link href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css" rel="stylesheet">
  <script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js"></script>
  <?!= include('css'); ?>
  <style>
    /* Estilos para el botón "Ampliar información" */
    .aneki-info-button .mdc-button__label,
    .aneki-info-button .mdc-button__icon {
        color: var(--mdc-theme-on-surface, #000); /* Color negro/on-surface por defecto */
        transition: color 0.3s ease; /* Transición suave para el color */
    }

    .mdc-card__primary-action:hover .aneki-info-button .mdc-button__label,
    .mdc-card__primary-action:hover .aneki-info-button .mdc-button__icon {
        color: white !important; /* Color blanco en hover de la tarjeta */
    }

    /* Estilos para el texto truncado */
    .truncate-text {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .truncate-multiline-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 1.4em; /* Ajustar según el tamaño de fuente */
        max-height: 2.8em; /* line-height * número de líneas */
    }

  </style>
</head>
<body class="mdc-typography">

  <header class="mdc-top-app-bar">
    <div class="mdc-top-app-bar__row">
      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
        <button id="menu-button" class="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button" aria-label="Abrir menú de navegación" style="display:none;">menu</button>
        <span class="mdc-top-app-bar__title">GastroTurismo</span>
      </section>
      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
        </section>
    </div>
  </header>
  <div class="mdc-top-app-bar--fixed-adjust">
    <main class="main-content mdc-padding--16">
      <nav id="breadcrumb-nav" aria-label="breadcrumb" style="margin-bottom: 16px;">
      </nav>

      <div id="page-header-container" style="display: flex; align-items: center; margin-bottom: 16px;">
        <button id="main-back-button" class="mdc-button mdc-button--outlined" style="display: none; margin-right: 16px;">
          <span class="mdc-button__ripple"></span>
          <span class="mdc-button__label">Volver</span>
        </button>
        <h1 id="page-title" class="mdc-typography--headline4" style="margin-bottom: 0;">Bienvenido</h1>
      </div>
      
      <div id="list-container" class="mdc-layout-grid">
        <div class="mdc-layout-grid__inner">
        </div>
      </div>

      <div id="site-detail-container" style="display:none;">
      </div>

      <div id="loader" class="mdc-linear-progress mdc-linear-progress--indeterminate" role="progressbar" style="display:none;">
        <div class="mdc-linear-progress__buffer">
          <div class="mdc-linear-progress__buffer-bar"></div>
          <div class="mdc-linear-progress__buffer-dots"></div>
        </div>
        <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
          <span class="mdc-linear-progress__bar-inner"></span>
        </div>
        <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
          <span class="mdc-linear-progress__bar-inner"></span>
        </div>
      </div>

    </main>
  </div>

  <div id="snackbar" class="mdc-snackbar">
    <div class="mdc-snackbar__surface" role="status" aria-relevant="additions text">
      <div class="mdc-snackbar__label" aria-atomic="false">
        Mensaje aquí.
      </div>
      <div class="mdc-snackbar__actions" aria-atomic="true">
        <button type="button" class="mdc-button mdc-snackbar__action">
          <div class="mdc-button__ripple"></div>
          <span class="mdc-button__label">Cerrar</span>
        </button>
      </div>
    </div>
  </div>

  <script>
    // Initialize MDC components
    const topAppBar = new mdc.topAppBar.MDCTopAppBar(document.querySelector('.mdc-top-app-bar'));
    const snackbar = new mdc.snackbar.MDCSnackbar(document.getElementById('snackbar'));
    const linearProgress = new mdc.linearProgress.MDCLinearProgress(document.getElementById('loader'));
    
    const menuButton = document.getElementById('menu-button'); 
    const mainBackButton = document.getElementById('main-back-button');
    if (mainBackButton) {
        new mdc.ripple.MDCRipple(mainBackButton);
    }

    const pageTitle = document.getElementById('page-title');
    const listContainer = document.getElementById('list-container').querySelector('.mdc-layout-grid__inner');
    const siteDetailContainer = document.getElementById('site-detail-container');
    const breadcrumbNav = document.getElementById('breadcrumb-nav');

    let currentLevel = 'autonomias'; 
    let currentFilters = {}; 
    let breadcrumbs = []; 
    let currentPhotoIndex = 0;
    let photoElements = [];
    let isNavigatingBack = false; // Flag to control behavior when navigating back

    // --- Loading and Message Functions ---
    function showLoader() {
      document.getElementById('loader').style.display = 'block';
      linearProgress.open();
    }

    function hideLoader() {
      linearProgress.close();
      document.getElementById('loader').style.display = 'none';
    }

    function showMessage(message) {
      snackbar.labelText = message;
      snackbar.open();
    }

    // --- Breadcrumb Navigation and Back Button ---
    function updateBreadcrumbs() {
      breadcrumbNav.innerHTML = ''; 

      if (breadcrumbs.length <= 1 && currentLevel !== 'sitio_detail') { 
         menuButton.style.display = 'none'; 
         if(mainBackButton) mainBackButton.style.display = 'none';
         if (!menuButton.classList.contains('material-icons')) {
            menuButton.classList.add('material-icons');
         }
         menuButton.textContent = 'menu'; 
         menuButton.setAttribute('aria-label', 'Abrir menú de navegación');
      } else {
         menuButton.style.display = 'inline-flex'; 
         if (!menuButton.classList.contains('material-icons')) { 
            menuButton.classList.add('material-icons');
         }
         menuButton.textContent = 'arrow_back'; 
         menuButton.setAttribute('aria-label', 'Volver atrás');
         menuButton.onclick = goBack;

         if(mainBackButton) {
            mainBackButton.style.display = 'inline-block'; 
            mainBackButton.onclick = goBack;
         }
      }
      
      if (breadcrumbs.length === 0 || (breadcrumbs.length === 1 && breadcrumbs[0].level === 'autonomias' && currentLevel !== 'sitio_detail')) {
         return; 
      }

      const ol = document.createElement('ol');
      ol.className = 'breadcrumb'; 
      breadcrumbs.forEach((crumb, index) => {
        const li = document.createElement('li');
        li.className = 'breadcrumb-item';
        if (index === breadcrumbs.length - 1) {
          li.textContent = crumb.label;
          li.setAttribute('aria-current', 'page');
        } else {
          const a = document.createElement('a');
          a.href = '#'; 
          a.textContent = crumb.label;
          a.onclick = (e) => {
            e.preventDefault();
            isNavigatingBack = false; 
            breadcrumbs = breadcrumbs.slice(0, index + 1);
            
            const targetCrumbOnClick = breadcrumbs[breadcrumbs.length - 1];
            currentLevel = targetCrumbOnClick.level;
            currentFilters = { ...targetCrumbOnClick.filters }; 
            
            // Set pageTitle when clicking breadcrumb link
            if (targetCrumbOnClick.level === 'autonomias') {
                pageTitle.textContent = 'Autonomía / País';
            } else if (targetCrumbOnClick.level === 'provincias') {
                pageTitle.textContent = "Provincias de " + targetCrumbOnClick.label;
            } else if (targetCrumbOnClick.level === 'ciudades') {
                pageTitle.textContent = "Ciudades de " + targetCrumbOnClick.label;
            } else if (targetCrumbOnClick.level === 'barrios') {
                pageTitle.textContent = "Barrios de " + targetCrumbOnClick.label;
            } else if (targetCrumbOnClick.level === 'sitios') {
                pageTitle.textContent = "Sitios de " + targetCrumbOnClick.label;
            } else {
                 pageTitle.textContent = targetCrumbOnClick.label;
            }
            
            if (targetCrumbOnClick.level === 'autonomias') loadAutonomias();
            else if (targetCrumbOnClick.level === 'provincias') loadProvincias(targetCrumbOnClick.filters.autonomia);
            else if (targetCrumbOnClick.level === 'ciudades') loadCiudades(targetCrumbOnClick.filters.provincia);
            else if (targetCrumbOnClick.level === 'barrios') loadBarrios(targetCrumbOnClick.filters.ciudad);
            // updateBreadcrumbs(); // Called by load functions
          };
          li.appendChild(a);
        }
        ol.appendChild(li);
        if (index < breadcrumbs.length - 1) {
          const separator = document.createElement('span');
          separator.className = 'breadcrumb-separator';
          separator.textContent = '>'; 
          separator.style.margin = "0 8px";
          ol.appendChild(separator);
        }
      });
      breadcrumbNav.appendChild(ol);
    }
    
    function goBack() {
        if (currentLevel === 'autonomias' && breadcrumbs.length === 1 && breadcrumbs[0].level === 'autonomias') {
            return; 
        }

        isNavigatingBack = true; 

        if (currentLevel === 'sitio_detail') {
            if (breadcrumbs.length > 0) breadcrumbs.pop(); 
        } else if (breadcrumbs.length > 1) {
            breadcrumbs.pop(); 
        } else {
            isNavigatingBack = false; 
            return;
        }

        if (breadcrumbs.length === 0) { 
            isNavigatingBack = false;
            loadAutonomias(); 
            return;
        }

        const targetCrumb = breadcrumbs[breadcrumbs.length - 1];

        currentLevel = targetCrumb.level;
        currentFilters = { ...targetCrumb.filters }; 
        
        if (targetCrumb.level === 'autonomias') {
            pageTitle.textContent = 'Autonomía / País';
        } else if (targetCrumb.level === 'provincias') {
            pageTitle.textContent = "Provincias de " + targetCrumb.label;
        } else if (targetCrumb.level === 'ciudades') {
            pageTitle.textContent = "Ciudades de " + targetCrumb.label;
        } else if (targetCrumb.level === 'barrios') {
            pageTitle.textContent = "Barrios de " + targetCrumb.label;
        } else if (targetCrumb.level === 'sitios') {
            pageTitle.textContent = "Sitios de " + targetCrumb.label;
        }
        
        updateBreadcrumbs(); 

        if (targetCrumb.level === 'autonomias') {
            loadAutonomias();
        } else if (targetCrumb.level === 'provincias') {
            loadProvincias(targetCrumb.filters.autonomia);
        } else if (targetCrumb.level === 'ciudades') {
            loadCiudades(targetCrumb.filters.provincia);
        } else if (targetCrumb.level === 'barrios') {
            loadBarrios(targetCrumb.filters.ciudad);
        } else if (targetCrumb.level === 'sitios') { 
            loadSitios(targetCrumb.filters.barrio);
        } else {
            isNavigatingBack = false; 
            loadAutonomias();
        }
    }

    // --- Rendering Functions ---
    function renderList(items, type) { 
      listContainer.innerHTML = ''; 
      siteDetailContainer.style.display = 'none';
      listContainer.style.display = 'grid'; 

      if (!items || items.length === 0) {
        listContainer.innerHTML = `<p class="mdc-typography--body1 mdc-layout-grid__cell--span-12">No hay ${type}s disponibles.</p>`;
        return;
      }

      items.forEach((itemData, itemIndex) => { 
        const value = itemData[capitalizeFirstLetter(type)]; 
        if (!value && type !== 'sitio') return; 
        
        const name = type === 'sitio' ? itemData.Nombre : value;
        if(!name) return; 

        const cell = document.createElement('div');
        cell.className = 'mdc-layout-grid__cell mdc-layout-grid__cell--span-4-desktop mdc-layout-grid__cell--span-6-tablet mdc-layout-grid__cell--span-12-phone';

        const card = document.createElement('div');
        card.className = 'mdc-card mdc-card--outlined';
        card.style.width = '100%';
        card.style.marginBottom = '16px';

        const primaryAction = document.createElement('div');
        primaryAction.className = 'mdc-card__primary-action';
        primaryAction.tabIndex = 0;
        
        let cardContentHTML = ''; 

        if (type === 'sitio') {
            primaryAction.style.flexDirection = 'column'; // H2 on top, then row for image+text
            primaryAction.style.padding = '0';
            primaryAction.style.alignItems = 'stretch';
            primaryAction.style.overflow = 'hidden'; // Important for clipping children

            let sitioNombreHTML = `
                <div style="padding: 8px 8px 4px 8px;">
                    <h2 class="mdc-typography--headline6 truncate-text" style="margin: 0;">
                        ${itemData.Nombre || 'Sin nombre'}
                    </h2>
                </div>`;

            // Row for image and text content below the H2
            let contentRowContainerHTML = '<div style="display: flex; flex-direction: row; flex-grow: 1; min-height: 0; padding: 0 16px 16px 16px;">';

            let imageColHTML = '';
            const hasImage = itemData.Foto1;
            if (hasImage) {
                imageColHTML = `
                <div style="flex-shrink: 0; width: 40%; position: relative; background-color: #f0f0f0; margin-right: 16px;">
                    <div style="padding-top: 56.25%;"></div> <img id="list-thumb-img-${itemIndex}" src="" alt="${itemData.Nombre || 'sitio'}" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; display: none;">
                    <div id="list-thumb-loader-${itemIndex}" class="list-thumbnail-loader" style="position: absolute; top: 0; left: 0; width:100%; height:100%; display:flex; align-items:center; justify-content:center;">Cargando...</div>
                </div>`;
            }
            // If no image, imageColHTML remains empty, text column will use available space.

            let textColHTML = `<div style="flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between; min-width: 0; border: double;">`;
            textColHTML += `<div>`; // Top text block for Tipo_Lugar, Pintxo_Tapa
            if (itemData.Pintxo_Tapa) {
                const pintxoTapaConSaltos = itemData.Pintxo_Tapa.replace(/\n/g, '<br>');
                //textColHTML += `<p class="mdc-typography--caption truncate-multiline-2" style="margin:0 0 8px 0; font-size: 0.75rem; border: double;">${pintxoTapaConSaltos}</p>`;
                textColHTML += `${itemData.Valoracion ? ` ${itemData.Valoracion}` : ''}<br>`;
                textColHTML += `${pintxoTapaConSaltos}`;
            }
            textColHTML += `</div>`;
            textColHTML += `<button class="mdc-button mdc-button--text aneki-info-button">
                              <span class="mdc-button__ripple"></span>
                              <span class="mdc-button__label">+ Info</span>
                              <i class="material-icons mdc-button__icon" aria-hidden="true">arrow_forward</i>
                            </button>`;
            // Button block - pushed to bottom, closer to bottom by reducing padding-top
            /*textColHTML += `<div style="margin-top: auto; padding-bottom: 1px; text-align: center; border: double;">`
            textColHTML += `<button class="mdc-button mdc-button--text aneki-info-button">
                              <span class="mdc-button__ripple"></span>
                              <span class="mdc-button__label">+ Info</span>
                              <i class="material-icons mdc-button__icon" aria-hidden="true">arrow_forward</i>
                            </button>`;
            textColHTML += `</div>`; // Close textColHTML*/

            contentRowContainerHTML += imageColHTML;
            contentRowContainerHTML += textColHTML;
            contentRowContainerHTML += `</div>`; // Close contentRowContainerHTML

            cardContentHTML = sitioNombreHTML + contentRowContainerHTML;

        } else { // For 'autonomia', 'provincia', 'ciudad', 'barrio'
            primaryAction.style.flexDirection = 'column'; 
            primaryAction.style.alignItems = 'stretch';
            primaryAction.style.padding = '0px'; 

            cardContentHTML += `<div style="padding: 16px; width: 100%; box-sizing: border-box;">`; 
            cardContentHTML += `<h2 class="mdc-typography--headline6" style="margin: 0 0 8px 0;">${name}</h2>`; 
            cardContentHTML += `</div>`; 
        }
        
        primaryAction.innerHTML = cardContentHTML;

        const allMdcButtonsInAction = primaryAction.querySelectorAll('.mdc-button');
        allMdcButtonsInAction.forEach(buttonEl => {
            if (!buttonEl.mdcRipple) { 
                buttonEl.mdcRipple = new mdc.ripple.MDCRipple(buttonEl);
            }
        });

        primaryAction.onclick = (event) => {
            if (event.target.closest('a[target="_blank"]')) {
                return;
            }
            isNavigatingBack = false; 
            if (type === 'autonomia') loadProvincias(name);
            else if (type === 'provincia') loadCiudades(name);
            else if (type === 'ciudad') loadBarrios(name);
            else if (type === 'barrio') loadSitios(name);
            else if (type === 'sitio') showSiteDetail(itemData);
        };

        card.appendChild(primaryAction);
        cell.appendChild(card);
        listContainer.appendChild(cell);
        
        if (!primaryAction.mdcRipple) { 
           primaryAction.mdcRipple = new mdc.ripple.MDCRipple(primaryAction);
        }

        if (type === 'sitio' && itemData.Foto1) {
            const thumbImgElement = document.getElementById(`list-thumb-img-${itemIndex}`);
            const thumbLoaderElement = document.getElementById(`list-thumb-loader-${itemIndex}`);
            if (thumbImgElement && thumbLoaderElement) {
                google.script.run
                    .withSuccessHandler(function(base64Image) {
                        if (thumbLoaderElement) thumbLoaderElement.style.display = 'none';
                        if (base64Image) {
                            thumbImgElement.src = base64Image;
                            thumbImgElement.style.display = 'block';
                        } else {
                            thumbImgElement.style.display = 'none'; 
                            console.warn("No se recibió base64 para miniatura (ID: " + itemData.Foto1 + ").");
                        }
                    })
                    .withFailureHandler(function(error) {
                        if (thumbLoaderElement) thumbLoaderElement.style.display = 'none';
                        thumbImgElement.style.display = 'none';
                        console.error("Error cargando miniatura " + itemData.Foto1 + ": " + error.message);
                    })
                    .getImageAsBase64(itemData.Foto1);
            }
        }
      }); 
    }

    function showSiteDetail(sitioData) {
      console.log("Datos del sitio para detalle:", sitioData); // Para depuración
      currentLevel = 'sitio_detail';
      pageTitle.textContent = sitioData.Nombre || "Detalle del Sitio"; 
      listContainer.style.display = 'none'; 
      siteDetailContainer.innerHTML = ''; 
      siteDetailContainer.style.display = 'block'; 

      let detailHTML = `<div class="mdc-card mdc-card--outlined" style="padding:16px;">`;
      detailHTML += `<h2 class="mdc-typography--headline5">${sitioData.Nombre || 'Sin nombre'}`;
      if (sitioData.Valoracion) detailHTML += ` ${sitioData.Valoracion}`; 
      detailHTML += `</h2>`;
      detailHTML += `<div style="margin-top: 24px;">`;
      if (sitioData.PostInstagram) detailHTML += `<a href="${sitioData.PostInstagram}" target="_blank" class="mdc-button mdc-button--outlined" style="margin-right: 8px;"><span class="mdc-button__ripple"></span><span class="material-icons mdc-button__icon" aria-hidden="true">language</span><span class="mdc-button__label">Nuestra Útima Visita en Instagram</span></a>`;
      if (sitioData.GoogleResenas) detailHTML += `<a href="${sitioData.GoogleResenas}" target="_blank" class="mdc-button mdc-button--outlined" style="margin-right: 8px;"><span class="mdc-button__ripple"></span><span class="material-icons mdc-button__icon" aria-hidden="true">language</span><span class="mdc-button__label">Google Reseñas</span></a>`;
      detailHTML += `</div>`;
      if (sitioData.Nota) detailHTML += `<p class="mdc-typography--body1">${sitioData.Nota}</p>`;
      if (sitioData.Direccion) detailHTML += `<p class="mdc-typography--body1"><span class="material-icons" style="vertical-align: bottom;">place</span> ${sitioData.Direccion}</p>`;
      if (sitioData.Horario) detailHTML += `<p class="mdc-typography--body1"><span class="material-icons" style="vertical-align: bottom;">schedule</span> ${sitioData.Horario}</p>`;
      if (sitioData.Pintxo_Tapa) {
        const pintxoTapaConSaltos = sitioData.Pintxo_Tapa.replace(/\n/g, '<br>');
        detailHTML += `<p class="mdc-typography--caption" style="margin:0; font-size: 0.75rem;">${pintxoTapaConSaltos}</p>`;
      }

      const fotoIds = [sitioData.Foto1, sitioData.Foto2, sitioData.Foto3, sitioData.Foto4].filter(Boolean);
      photoElements = []; 

      if (fotoIds.length > 0) {
        detailHTML += `<h3 class="mdc-typography--headline6" style="margin-top:24px; margin-bottom: 12px;">Galería</h3>`;
        detailHTML += `<div class="carousel-container">`;
        fotoIds.forEach((idFoto, index) => {
          detailHTML += `<div class="carousel-slide ${index === 0 ? 'active' : ''}" data-index="${index}">
                           <img id="carousel-img-${index}" src="" alt="Foto ${index + 1} de ${sitioData.Nombre}" style="display:none; width:100%; height:auto; max-height: 450px; object-fit: contain;">
                           <div id="carousel-loader-${index}" class="image-loader-placeholder" style="display:flex; align-items:center; justify-content:center; height:300px; background-color:#eee;">Cargando foto...</div>
                         </div>`;
        });
        detailHTML += `<button class="carousel-button prev" onclick="changePhoto(-1)">&#10094;</button>`;
        detailHTML += `<button class="carousel-button next" onclick="changePhoto(1)">&#10095;</button>`;
        detailHTML += `</div>`;
      }
      
      detailHTML += `<div style="margin-top: 24px;">`;
      if (sitioData.Maps) detailHTML += `<a href="${sitioData.Maps}" target="_blank" class="mdc-button mdc-button--outlined" style="margin-right: 8px;"><span class="mdc-button__ripple"></span><span class="material-icons mdc-button__icon" aria-hidden="true">map</span><span class="mdc-button__label">Como llegar</span></a>`;
      if (sitioData.Web) detailHTML += `<a href="${sitioData.Web}" target="_blank" class="mdc-button mdc-button--outlined" style="margin-right: 8px;"><span class="mdc-button__ripple"></span><span class="material-icons mdc-button__icon" aria-hidden="true">language</span><span class="mdc-button__label">Sitio Web</span></a>`;
      if (sitioData.Facebook) detailHTML += `<a href="${sitioData.Facebook}" target="_blank" class="mdc-button mdc-button--outlined" style="margin-right: 8px;"><span class="mdc-button__ripple"></span><span class="material-icons mdc-button__icon" aria-hidden="true">groups</span><span class="mdc-button__label">Facebook</span></a>`; 
      if (sitioData.Instagram) detailHTML += `<a href="${sitioData.Instagram}" target="_blank" class="mdc-button mdc-button--outlined"><span class="mdc-button__ripple"></span><span class="mdc-button__label">Instagram</span></a>`;
      if (sitioData.PostInstagram) detailHTML += `<a href="${sitioData.Instagram}" target="_blank" class="mdc-button mdc-button--outlined"><span class="mdc-button__ripple"></span><span class="mdc-button__label">Post Instagram</span></a>`;

      detailHTML += `</div>`;
      detailHTML += `</div>`; 
      siteDetailContainer.innerHTML = detailHTML;
      
      const mdcButtonsInDetail = siteDetailContainer.querySelectorAll('.mdc-button');
      mdcButtonsInDetail.forEach(button => {
        if (!button.mdcRipple) {
            button.mdcRipple = new mdc.ripple.MDCRipple(button);
        }
      });

      if (fotoIds.length > 0) {
        fotoIds.forEach((idFoto, index) => {
          if (!idFoto) return;
          const imgElement = document.getElementById(`carousel-img-${index}`);
          const loaderElement = document.getElementById(`carousel-loader-${index}`);
          google.script.run
            .withSuccessHandler(function(base64Image) {
              if (loaderElement) loaderElement.style.display = 'none';
              if (imgElement && base64Image) {
                imgElement.src = base64Image;
                imgElement.style.display = '';
              } else if (imgElement) {
                imgElement.alt = "Error al cargar imagen (ID: " + idFoto + ")";
                imgElement.style.display = '';
              }
            })
            .withFailureHandler(function(error) {
              if (loaderElement) loaderElement.style.display = 'none';
              if (imgElement) {
                imgElement.alt = "Fallo al cargar: " + idFoto;
                imgElement.style.display = '';
              }
              showMessage("Error cargando imagen: " + idFoto);
            })
            .getImageAsBase64(idFoto);
        });
        photoElements = Array.from(siteDetailContainer.querySelectorAll('.carousel-slide'));
        currentPhotoIndex = 0;
        updatePhotoDisplay(); 
      }

      const siteDetailCrumbIndex = breadcrumbs.findIndex(b => b.level === 'sitio_detail' && b.filters.sitio === sitioData.Nombre);
      if (siteDetailCrumbIndex !== -1) { 
          breadcrumbs = breadcrumbs.slice(0, siteDetailCrumbIndex + 1);
      } else {
          let siteListCrumbIdx = breadcrumbs.findIndex(b => b.level === 'sitios' && b.filters.barrio === currentFilters.barrio);
          if (siteListCrumbIdx !== -1) {
              breadcrumbs = breadcrumbs.slice(0, siteListCrumbIdx + 1);
          }
           breadcrumbs.push({ label: sitioData.Nombre, level: 'sitio_detail', filters: {...currentFilters, sitio: sitioData.Nombre} });
      }
      updateBreadcrumbs();
    }
    
    function updatePhotoDisplay() {
        if (!photoElements || photoElements.length === 0) return;
        photoElements.forEach((slide, index) => {
            slide.style.display = (index === currentPhotoIndex) ? 'block' : 'none';
            if (index === currentPhotoIndex) slide.classList.add('active');
            else slide.classList.remove('active');
        });
        const prevButton = siteDetailContainer.querySelector('.carousel-button.prev');
        const nextButton = siteDetailContainer.querySelector('.carousel-button.next');
        if (prevButton) prevButton.disabled = currentPhotoIndex === 0;
        if (nextButton) nextButton.disabled = currentPhotoIndex === photoElements.length - 1;
    }

    function changePhoto(direction) {
        if (!photoElements || photoElements.length === 0) return;
        const newIndex = currentPhotoIndex + direction;
        if (newIndex >= 0 && newIndex < photoElements.length) {
            currentPhotoIndex = newIndex;
            updatePhotoDisplay();
        }
    }

    function capitalizeFirstLetter(string) {
      if (!string) return string;
      return string.charAt(0).toUpperCase() + string.slice(1);
    }

    // --- Data Loading Functions ---
    function loadAutonomias() {
      showLoader();
      if (!isNavigatingBack) { 
        currentLevel = 'autonomias';
        currentFilters = {};
        pageTitle.textContent = 'Autonomía / País';
        breadcrumbs = [{label: 'Inicio', level: 'autonomias', filters: {}}];
        updateBreadcrumbs(); 
      }

      google.script.run
        .withSuccessHandler(autonomias => {
          const shouldAutoAdvance = !isNavigatingBack && autonomias && autonomias.length === 1 && autonomias[0] && autonomias[0].Autonomia;
          if (shouldAutoAdvance) {
            loadProvincias(autonomias[0].Autonomia);
          } else {
            renderList(autonomias, 'autonomia');
            hideLoader(); 
          }
          if (isNavigatingBack) isNavigatingBack = false; 
        })
        .withFailureHandler(err => {
          showMessage('Error al cargar autonomías: ' + err.message);
          if (isNavigatingBack) isNavigatingBack = false; 
          hideLoader();
        })
        .getAutonomias(); 
    }

    function loadProvincias(autonomiaName) {
      showLoader();
      if (!isNavigatingBack) {
        currentLevel = 'provincias';
        currentFilters = { autonomia: autonomiaName }; 
        pageTitle.textContent = "Provincias de " + autonomiaName;
        const inicioCrumb = breadcrumbs.find(b => b.level === 'autonomias');
        if (inicioCrumb) {
            breadcrumbs = [inicioCrumb]; 
        } else { 
            breadcrumbs = [{label: 'Inicio', level: 'autonomias', filters: {}}];
        }
        breadcrumbs.push({label: autonomiaName, level: 'provincias', filters: {autonomia: autonomiaName}});
        updateBreadcrumbs();
      }

      google.script.run
        .withSuccessHandler(provincias => {
          const shouldAutoAdvance = !isNavigatingBack && provincias && provincias.length === 1 && provincias[0] && provincias[0].Provincia;
          if (shouldAutoAdvance) {
            loadCiudades(provincias[0].Provincia);
          } else {
            renderList(provincias, 'provincia');
            hideLoader();
          }
          if (isNavigatingBack) isNavigatingBack = false;
        })
        .withFailureHandler(err => {
          showMessage('Error al cargar provincias: ' + err.message);
          if (isNavigatingBack) isNavigatingBack = false;
          hideLoader();
        })
        .getProvincias(autonomiaName); 
    }

    function loadCiudades(provinciaName) {
      showLoader();
      if (!isNavigatingBack) {
        currentLevel = 'ciudades';
        currentFilters.provincia = provinciaName; 
        pageTitle.textContent = "Ciudades de " + provinciaName;
        
        const autonomiaCrumbLabel = currentFilters.autonomia;
        breadcrumbs = [
            {label: 'Inicio', level: 'autonomias', filters: {}},
            {label: autonomiaCrumbLabel, level: 'provincias', filters: {autonomia: autonomiaCrumbLabel}}
        ];
        breadcrumbs.push({label: provinciaName, level: 'ciudades', filters: {...currentFilters}});
        updateBreadcrumbs();
      }

      google.script.run
        .withSuccessHandler(ciudades => {
          const shouldAutoAdvance = !isNavigatingBack && ciudades && ciudades.length === 1 && ciudades[0] && ciudades[0].Ciudad;
          if (shouldAutoAdvance) {
            loadBarrios(ciudades[0].Ciudad);
          } else {
            renderList(ciudades, 'ciudad');
            hideLoader();
          }
          if (isNavigatingBack) isNavigatingBack = false;
        })
        .withFailureHandler(err => {
          showMessage('Error al cargar ciudades: ' + err.message);
          if (isNavigatingBack) isNavigatingBack = false;
          hideLoader();
        })
        .getCiudades(provinciaName); 
    }

    function loadBarrios(ciudadName) {
      showLoader();
      if (!isNavigatingBack) {
        currentLevel = 'barrios';
        currentFilters.ciudad = ciudadName; 
        pageTitle.textContent = "Barrios de " + ciudadName;

        const autonomiaCrumbLabel = currentFilters.autonomia;
        const provinciaCrumbLabel = currentFilters.provincia;
        breadcrumbs = [
            {label: 'Inicio', level: 'autonomias', filters: {}},
            {label: autonomiaCrumbLabel, level: 'provincias', filters: {autonomia: autonomiaCrumbLabel}},
            {label: provinciaCrumbLabel, level: 'ciudades', filters: {autonomia: autonomiaCrumbLabel, provincia: provinciaCrumbLabel}}
        ];
        breadcrumbs.push({label: ciudadName, level: 'barrios', filters: {...currentFilters}});
        updateBreadcrumbs();
      }

      google.script.run
        .withSuccessHandler(barrios => {
          const shouldAutoAdvance = !isNavigatingBack && barrios && barrios.length === 1 && barrios[0] && barrios[0].Barrio;
          if (shouldAutoAdvance) {
            loadSitios(barrios[0].Barrio);
          } else {
            renderList(barrios, 'barrio');
            hideLoader();
          }
          if (isNavigatingBack) isNavigatingBack = false;
        })
        .withFailureHandler(err => {
          showMessage('Error al cargar barrios: ' + err.message);
          if (isNavigatingBack) isNavigatingBack = false;
          hideLoader();
        })
        .getBarrios(ciudadName); 
    }
    
    function loadSitios(barrioName) {
      showLoader();
      if (!isNavigatingBack) {
        currentLevel = 'sitios'; 
        currentFilters.barrio = barrioName; 
        pageTitle.textContent = "Sitios de " + barrioName;

        const autonomiaCrumbLabel = currentFilters.autonomia;
        const provinciaCrumbLabel = currentFilters.provincia;
        const ciudadCrumbLabel = currentFilters.ciudad;
        breadcrumbs = [
            {label: 'Inicio', level: 'autonomias', filters: {}},
            {label: autonomiaCrumbLabel, level: 'provincias', filters: {autonomia: autonomiaCrumbLabel}},
            {label: provinciaCrumbLabel, level: 'ciudades', filters: {autonomia: autonomiaCrumbLabel, provincia: provinciaCrumbLabel}},
            {label: ciudadCrumbLabel, level: 'barrios', filters: {autonomia: autonomiaCrumbLabel, provincia: provinciaCrumbLabel, ciudad: ciudadCrumbLabel}}
        ];
        breadcrumbs.push({label: barrioName, level: 'sitios', filters: {...currentFilters}}); 
        updateBreadcrumbs();
      }

      google.script.run
        .withSuccessHandler(sitios => {
          renderList(sitios, 'sitio'); 
          hideLoader(); 
          if (isNavigatingBack) isNavigatingBack = false; 
        })
        .withFailureHandler(err => {
          showMessage('Error al cargar sitios: ' + err.message);
          if (isNavigatingBack) isNavigatingBack = false; 
          hideLoader();
        })
        .getSitios(barrioName); 
    }

    // Initial Load
    document.addEventListener('DOMContentLoaded', () => {
      isNavigatingBack = false; 
      loadAutonomias();
    });

  </script>
</body>
</html>

css.html
//
<style>

//
//
