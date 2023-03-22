"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.mdLinks = mdLinks;
var _fs = require("fs");
var _path = _interopRequireDefault(require("path"));
var _axios = _interopRequireDefault(require("axios"));
var _marked = require("marked");
var _cheerio = require("cheerio");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function extractLinksFromFile(filePath, options) {
  // Leer el contenido del archivo en la ruta especificada
  return _fs.promises.readFile(filePath, 'utf8').then(function (fileContent) {
    // Tomar el contenido del archivo leído y lo convierte a HTML
    var htmlContent = (0, _marked.marked)(fileContent);
    // Crear un objeto DOM virtual en memoria del HTML
    //$ es una convención utilizada por cheerio para hacer referencia a este objeto.
    var $ = (0, _cheerio.load)(htmlContent);
    var links = $('a').map(function (_, el) {
      var href = $(el).attr('href');
      var text = $(el).text();
      return {
        href: href,
        text: text
      };
    }).get(); //.get() convierte el objeto jQuery en una matriz JavaScript simple que contiene los elementos resultantes del método map().

    if (!options.validate) {
      return links.map(function (link) {
        return {
          href: link.href,
          text: link.text,
          file: filePath
        };
      });
    } else {
      var linkPromises = links.map(function (link) {
        return _axios["default"].head(link.href).then(function (response) {
          return {
            href: link.href,
            text: link.text,
            file: filePath,
            status: response.status,
            ok: response.status >= 200 && response.status < 300 ? 'ok' : 'fail'
          };
        })["catch"](function (error) {
          return {
            href: link.href,
            text: link.text,
            file: filePath,
            status: error.response ? error.response.status : 'unknown',
            ok: 'fail'
          };
        });
      });
      return Promise.all(linkPromises);
    }
  });
}

// Se recibe como argumento la ruta de un directorio y se encarga de extraer todos los enlaces presentes en los archivos Markdown.
function extractLinksFromDirectory(directoryPath, validate) {
  return _fs.promises.readdir(directoryPath).then(function (files) {
    var promises = files.map(function (file) {
      var filePath = _path["default"].join(directoryPath, file);
      return _fs.promises.stat(filePath).then(function (stats) {
        if (stats.isDirectory()) {
          return extractLinksFromDirectory(filePath, validate);
        } else if (stats.isFile() && _path["default"].extname(file) === '.md') {
          return extractLinksFromFile(filePath, validate);
        } else {
          return Promise.resolve([]);
        }
      });
    });
    return Promise.all(promises).then(function (linksArray) {
      var _ref;
      return (_ref = []).concat.apply(_ref, _toConsumableArray(linksArray));
    });
  });
}

// Se recibe como argumento la ruta de un archivo o directorio y se extraen todos los enlaces presentes en el archivo Markdown, o en el caso de que sea un directorio, se ejecuta la función extractLinksFromDirectory.
function mdLinks(firstPath) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {
    validate: false
  };
  var absolutePath = _path["default"].resolve(process.cwd(), firstPath);
  return _fs.promises.stat(absolutePath).then(function (stats) {
    if (stats.isDirectory()) {
      return extractLinksFromDirectory(absolutePath, options);
    } else if (stats.isFile() && _path["default"].extname(absolutePath) === '.md') {
      return extractLinksFromFile(absolutePath, options);
    } else {
      // Si la ruta no es ni un archivo Markdown ni un directorio, se lanza un error.
      throw new Error('La ruta debe ser un archivo Markdown o un directorio.');
    }
  });
}

// Se exporta la función mdLinks para que pueda ser utilizada desde otro archivo.