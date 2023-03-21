import { mdLinks } from './myLibrary.mjs';

// Llamado a la función mdLinks con una ruta de archivo o directorio
mdLinks('./README.md', { validate: true })
  .then(links => console.log(links))
  .catch(error => console.error(error));


