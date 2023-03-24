#!/usr/bin/env node
import { extractLinksFromDirectory, extractLinksFromFile, countLinks } from '../src/myLibrary.mjs';
// Se importa el módulo fs de Node.js y se usa la propiedad promises para acceder a las funciones del módulo que retornan promesas.
import { promises as fs } from 'fs';
// Se importa el módulo path de Node.js para trabajar con rutas de archivos.
import path from 'path';

const filePath = process.argv[2]; // obtiene el primer argumento después del nombre del archivo
const options = {
  validate: process.argv.includes('--validate'), // verifica si se proporcionó la opción --validate
  stats: process.argv.includes('--stats') // verifica si se proporcionó la opción --stats
};

// Se recibe como argumento la ruta de un archivo o directorio y se extraen todos los enlaces presentes en el archivo Markdown, o en el caso de que sea un directorio, se ejecuta la función extractLinksFromDirectory.
function mdLinks(filePath, options) {
  const absolutePath = path.resolve(process.cwd(), filePath);
  return fs.stat(absolutePath)
  .then(stats => {
    if (stats.isDirectory()) {
      return extractLinksFromDirectory(absolutePath, options);  
    } else if (stats.isFile() && path.extname(absolutePath) === '.md') {
      return extractLinksFromFile(absolutePath, options);
    } else{
      // Si la ruta no es ni un archivo Markdown ni un directorio, se lanza un error.
      throw new Error('La ruta debe ser un archivo Markdown o un directorio.');
    }
  })
  
  };

// Llamado a la función mdLinks con una ruta de archivo o directorio
mdLinks(filePath, options)
.then(links => {
  if ((!options.stats && options.validate)||(!options.stats && !options.validate)) {
    return console.log(links)
  } 
    return console.log(countLinks(links, options)) 
})
.catch(error => {
  console.error(error);
});
 export{
  mdLinks
 }

