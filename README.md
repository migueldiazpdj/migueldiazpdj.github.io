# migueldiazpdj.github.io

Portfolio personal de Miguel Díaz Pérez de Juan, Data Scientist. Sitio estático (HTML, CSS y JS sin dependencias) publicado con GitHub Pages.

## Archivos

- `index.html`: contenido, metadatos SEO y datos estructurados (schema.org `Person`)
- `style.css`: estilos (tema claro/oscuro, intro, escena botánica, responsive)
- `script.js`: tema, sonido y animación de la intro (los proyectos se editan a mano en `index.html`)
- `robots.txt`, `sitemap.xml`, `site.webmanifest` y favicons (`favicon.svg` es el original; los PNG/ICO se generan a partir de él)

## Ver en local

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

## Publicar cambios

```bash
git add .
git commit -m "Update portfolio"
git push
```

Si cambias el contenido, actualiza también `<lastmod>` en `sitemap.xml`.
