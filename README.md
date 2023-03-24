# md-links
Este es un módulo de Node.js que analiza archivos Markdown y devuelve los links encontrados. También puede validar los links y proporcionar estadísticas sobre los mismos.

### Instalación
Para instalar el módulo, ejecuta el siguiente comando:
***npm install <MarianaAgudeloO>/md-links*** 

### Uso desde la línea de comandos
Puedes usar el módulo desde la línea de comandos ejecutando el siguiente comando:
***md-links <path-to-file-or-directory> [--validate] [--stats]***

**Donde:**
- **path-to-file-or-directory**: Ruta del archivo o directorio Markdown a analizar.
- **--validate**: Opción que permite validar los links encontrados.
- **--stats**: Opción que permite obtener estadísticas de los links encontrados.

**Ejemplos**
- Para obtener los links encontrados en el archivo README.md, ejecuta el siguiente comando:
***md-links README.md***
- Para validar los links encontrados en el archivo README.md, ejecuta el siguiente comando:
***md-links README.md --validate***
- Para obtener estadísticas de los links encontrados en el archivo README.md, ejecuta el siguiente comando:
***md-links README.md --stats***
- Para obtener estadísticas y validar los links encontrados en el archivo README.md, ejecuta el siguiente comando:
***md-links README.md --validate --stats***

### Uso desde una aplicación Node.js
También puedes usar el módulo desde una aplicación Node.js. Para ello, importa la función mdLinks desde el módulo y llámala con los parámetros correspondientes:
*const mdLinks = require('<github-user>/md-links').mdLinks;* **//Usando CommonJS**
*import { mdLinks } from '<github-user>/md-links';* **//Usando ES Modules**
*mdLinks('<path-to-file-or-directory>', { validate: true, stats: true })
.then(links => {
  console.log(links);
})
.catch(error => {
  console.error(error);
});*

**Donde:**
- ***path-to-file-or-directory***: Ruta del archivo o directorio Markdown a analizar.
- ***{ validate: true, stats: true }***: Objeto con opciones que permiten validar los links y obtener estadísticas de los mismos.

#### Aquí puedes ver cómo fue la planeación del proyecto
[Planeación] **https://github.com/users/MarianaAgudeloO/projects/1**
[Diagrama de flujo] **https://lucid.app/lucidchart/ba241cab-73d4-479d-b0dd-8bfe4114cd31/edit?viewport_loc=-659%2C174%2C2560%2C1152%2C0_0&invitationId=inv_0e1768c6-76c2-490a-a04d-7e46ede35266**