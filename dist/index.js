"use strict";

var _myLibrary = require("./myLibrary.mjs");
// Llamado a la función mdLinks con una ruta de archivo o directorio
(0, _myLibrary.mdLinks)('./README.md', {
  validate: false
}).then(function (links) {
  return console.log(links);
})["catch"](function (error) {
  return console.error(error);
});