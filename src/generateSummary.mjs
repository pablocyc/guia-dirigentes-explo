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

// Ruta al archivo astro.config.mjs
const configPath = join(__dirname, "../astro.config.mjs");

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

// Función para cargar los nombres de los capítulos desde astro.config.mjs usando readFile
async function loadChapterNames() {
  try {
    const configContent = await readFile(configPath, "utf8");

    // Extraer el contenido de la propiedad "sidebar"
    const sidebarMatch = configContent.match(/sidebar: \[(.*?)\]/s);
    if (!sidebarMatch) {
      throw new Error("No se encontró la propiedad 'sidebar' en astro.config.mjs");
    }

    // Procesar cada entrada del sidebar manualmente
    const sidebarRaw = sidebarMatch[1]
      .split("},") // Dividir las entradas del sidebar
      .map(item => `${item}}`); // Asegurar que cada entrada termina con }

    const chapterMap = {};

    sidebarRaw.forEach(entry => {
      const directoryMatch = entry.match(/directory: ['"]([^'"]+)['"]/);
      const labelMatch = entry.match(/label: ['"]([^'"]+)['"]/);

      if (directoryMatch && labelMatch) {
        const directory = directoryMatch[1];
        const label = labelMatch[1].split(" - ")[1]; // Extraer el nombre después del número
        chapterMap[directory] = label;
      }
    });

    return chapterMap;
  } catch (error) {
    console.error("Error cargando nombres de los capítulos desde astro.config.mjs:", error);
    return {};
  }
}

// Función para generar el sumario con el componente FileTree
async function generateSummary() {
  try {
    const chapterNames = await loadChapterNames();

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

      // Obtener el título del capítulo
      const chapterNumber = chapter.replace(/^\D+/, ""); // Extraer número del capítulo
      const chapterLabel = chapterNames[chapter] || ""; // Obtener etiqueta específica
      const chapterTitle = `**Capítulo ${chapterNumber}** ${
        chapterLabel ? `${chapterLabel}` : ""
      }`;

      markdownContent += `- ${chapterTitle}\n`;

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
