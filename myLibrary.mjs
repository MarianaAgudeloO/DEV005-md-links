// Se importa el módulo fs de Node.js y se usa la propiedad promises para acceder a las funciones del módulo que retornan promesas.
import { promises as fs } from 'fs';
// Se importa el módulo path de Node.js para trabajar con rutas de archivos.
import path from 'path';
// Se importa el módulo axios para hacer peticiones HTTP
import axios from 'axios';
import { marked } from 'marked';
import { load } from 'cheerio';

function extractLinksFromFile(filePath, options) {
  // Leer el contenido del archivo en la ruta especificada
  return fs.readFile(filePath, 'utf8')
    .then(fileContent => {
      // Tomar el contenido del archivo leído y lo convierte a HTML
      const htmlContent = marked(fileContent);
      // Crear un objeto DOM virtual en memoria del HTML
      //$ es una convención utilizada por cheerio para hacer referencia a este objeto.
      const $ = load(htmlContent);

      const links = $('a').map((_, el) => {
        const href = $(el).attr('href');
        const text = $(el).text();
        return { href, text };
      }).get(); //.get() convierte el objeto jQuery en una matriz JavaScript simple que contiene los elementos resultantes del método map().

      if (!options.validate) {
        return links.map(link => ({
          href: link.href,
          text: link.text,
          file: filePath
        }));
      } else {
        const linkPromises = links.map(link => {
          return axios.head(link.href)
            .then(response => ({
              href: link.href,
              text: link.text,
              file: filePath,
              status: response.status,
              ok: response.status >= 200 && response.status < 300 ? 'ok' : 'fail'
            }))
            .catch(error => ({
              href: link.href,
              text: link.text,
              file: filePath,
              status: error.response ? error.response.status : 'unknown',
              ok: 'fail'
            }));
        });
        return Promise.all(linkPromises);
      }
    });
}

// Se recibe como argumento la ruta de un directorio y se encarga de extraer todos los enlaces presentes en los archivos Markdown.
function extractLinksFromDirectory(directoryPath, validate) {
  return fs.readdir(directoryPath)
    .then(files => {
      const promises = files.map(file => {
        const filePath = path.join(directoryPath, file);
        return fs.stat(filePath)
          .then(stats => {
            if (stats.isDirectory()) {
              return extractLinksFromDirectory(filePath, validate);
            } else if (stats.isFile() && path.extname(file) === '.md') {
              return extractLinksFromFile(filePath, validate);
            } else {
              return Promise.resolve([]);
            }
          })
      });
      return Promise.all(promises).then(linksArray => [].concat(...linksArray));
    });
}

// Se recibe como argumento la ruta de un archivo o directorio y se extraen todos los enlaces presentes en el archivo Markdown, o en el caso de que sea un directorio, se ejecuta la función extractLinksFromDirectory.
function mdLinks(firstPath, options = { validate: false }) {
  const absolutePath = path.resolve(process.cwd(), firstPath);
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
  });
}

// Se exporta la función mdLinks para que pueda ser utilizada desde otro archivo.
export { mdLinks };