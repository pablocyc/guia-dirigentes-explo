import { readdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "url";
import { dirname, join, parse } from "node:path";
import matter from "gray-matter";

// Obtener la ruta del archivo actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Ruta raíz de los capítulos
const rootPath = join(__dirname, "content", "docs");

// Ruta para el archivo Markdown que se generará
const outputPath = join(rootPath, "intro", "sumario.mdx");

// Función para extraer el `title` desde el frontmatter de un archivo
async function extractTitle(filePath) {
  try {
    const content = await readFile(filePath, "utf8");
    const { data } = matter(content);
    return (
      data.title || parse(filePath).name.replace(/^\d+-/, "").replace(/-/g, " ")
    );
  } catch (error) {
    console.error(`No se pudo leer el título del archivo: ${filePath}`, error);
    return parse(filePath).name.replace(/^\d+-/, "").replace(/-/g, " ");
  }
}

// Función para generar el sumario con el componente FileTree
async function generateSummary() {
  try {
    // Validar si la carpeta raíz existe
    const dirEntries = await readdir(rootPath, { withFileTypes: true });
    const chapters = dirEntries
      .filter(
        (dirent) => dirent.isDirectory() && /^capitulo\d+$/.test(dirent.name)
      )
      .map((dirent) => dirent.name);

    let markdownContent = `---
title: "Sumario"
description: "Página que contiene todo el contenido del libro"
---

import { FileTree } from '@astrojs/starlight/components';

<FileTree>
`;

    // Procesar cada capítulo
    for (const chapter of chapters) {
      const chapterPath = join(rootPath, chapter);
      const chapterFiles = await readdir(chapterPath);

      const validFiles = chapterFiles.filter(
        (file) => file.endsWith(".md") || file.endsWith(".mdx")
      );

      // Agregar título del capítulo
      const chapterTitle =
        chapter.charAt(0).toUpperCase() + chapter.slice(1).replace(/-/g, " ");
        markdownContent += `- **${chapterTitle.replace(/(\d+)/, " $1")}**\n`;

      // Agregar links a los archivos del capítulo
      for (const file of validFiles) {
        const filePath = join(chapterPath, file);
        const title = await extractTitle(filePath); // Extraer el título del archivo
        markdownContent += `  - [${title}](/${chapter}/${parse(file).name})\n`;
      }
    }

    markdownContent += `</FileTree>`;

    // Escribir el archivo Markdown
    await writeFile(outputPath, markdownContent);
    console.log(`Archivo sumario generado en: ${outputPath}`);
  } catch (error) {
    console.error("Error generando el sumario:", error.message);
  }
}

// Ejecutar la función
generateSummary();
