/**
 * Escaparate Inmobiliario — backend de agenda sobre Google Sheets.
 *
 * INSTALACIÓN
 * 1. Crea un Google Sheet nuevo. Cámbiale el nombre a lo que quieras.
 * 2. En la primera hoja, ponle el nombre exacto "Visitas" (pestaña inferior).
 * 3. En la fila 1 escribe estas cabeceras, una por columna:
 *    id | cliente | telefono | inmueble | fecha | hora | creado
 * 4. Menú Extensiones > Apps Script. Borra el contenido de Code.gs y pega
 *    este archivo entero.
 * 5. Menú Proyecto > Configuración del proyecto > Propiedades del script >
 *    añade una propiedad TOKEN con un valor secreto que te inventes
 *    (por ejemplo una cadena larga aleatoria). Ese token es la única
 *    "contraseña" que protege tu agenda: sin él nadie puede leer ni
 *    escribir visitas aunque encuentre la URL.
 * 6. Botón Implementar > Nueva implementación > tipo "Aplicación web".
 *    - Ejecutar como: Yo
 *    - Quién tiene acceso: Cualquier usuario
 *    Copia la URL que te da (termina en /exec). Esa URL + el TOKEN son
 *    los dos datos que pegarás en la app (index.html, panel Configuración).
 * 7. Cada vez que cambies este código tienes que crear una nueva versión
 *    en Implementar > Gestionar implementaciones > lápiz de editar > Nueva
 *    versión, si no los cambios no se aplican a la URL ya publicada.
 */

var SHEET_NAME = 'Visitas';

function doGet(e) {
  try {
    if (!checkToken(e.parameter && e.parameter.token)) {
      return jsonOut({ error: 'unauthorized' });
    }
    return jsonOut({ visits: getVisits() });
  } catch (err) {
    return jsonOut({ error: String(err) });
  }
}

function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents || '{}');
    if (!checkToken(body.token)) {
      return jsonOut({ error: 'unauthorized' });
    }
    if (body.action === 'add' && body.visit) {
      addVisit(body.visit);
    } else if (body.action === 'delete' && body.id) {
      deleteVisit(body.id);
    }
    return jsonOut({ visits: getVisits() });
  } catch (err) {
    return jsonOut({ error: String(err) });
  }
}

function checkToken(token) {
  var stored = PropertiesService.getScriptProperties().getProperty('TOKEN');
  return !!stored && token === stored;
}

function getSheet_() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error('No existe una hoja llamada "' + SHEET_NAME + '"');
  return sheet;
}

function getVisits() {
  var sheet = getSheet_();
  var data = sheet.getDataRange().getValues();
  var rows = data.slice(1);
  return rows
    .filter(function (r) { return r[0]; })
    .map(function (r) {
      return {
        id: String(r[0]),
        cliente: r[1],
        telefono: r[2],
        inmueble: r[3],
        fecha: r[4] instanceof Date ? Utilities.formatDate(r[4], Session.getScriptTimeZone(), 'yyyy-MM-dd') : r[4],
        hora: r[5]
      };
    })
    .sort(function (a, b) {
      return (a.fecha + a.hora).localeCompare(b.fecha + b.hora);
    });
}

function addVisit(v) {
  var sheet = getSheet_();
  sheet.appendRow([
    v.id, v.cliente || '', v.telefono || '', v.inmueble || '',
    v.fecha || '', v.hora || '', new Date()
  ]);
}

function deleteVisit(id) {
  var sheet = getSheet_();
  var data = sheet.getDataRange().getValues();
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][0]) === String(id)) {
      sheet.deleteRow(i + 1);
      break;
    }
  }
}

function jsonOut(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
