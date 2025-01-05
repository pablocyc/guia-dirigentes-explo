import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

// https://astro.build/config
export default defineConfig({
  integrations: [
    starlight({
      title: "Guía Scout",
      customCss: [
        './src/styles/custom.css',
      ],
      defaultLocale: 'es',
      locales: {
        root: {
          label: 'Spanish',
          lang: 'es',
        }
      },
      social: {
        github: "https://github.com/pablocyc/guia-dirigentes-explo",
      },
      sidebar: [
        {
          label: "Acerca de este libro",
          autogenerate: { directory: "intro" },
        },
        {
          label: "Capítulo 1 - Los Jóvenes de 11 a 15 años",
          autogenerate: { directory: "capitulo1" },
        },
        {
          label: "Capítulo 2 - El Marco Simbólico", 
          autogenerate: { directory: "capitulo2" },
        },
        {
          label: "Capítulo 3 - La Patrulla",
          autogenerate: { directory: "capitulo3" },
        },
        {
          label: "Capítulo 4 - Los Elementos del Método Scout",
          autogenerate: { directory: "capitulo4" },
        },
        {
          label: "Capítulo 5 - Unidad Scout",
          autogenerate: { directory: "capitulo5" },
        },
        {
          label: "Capítulo 6 - Ley y Promesa",
          autogenerate: { directory: "capitulo6" },
        },
        {
          label: "Capítulo 7 - El Papel de los Dirigentes Scouts",
          autogenerate: { directory: "capitulo7" },
        },
        {
          label: "Capítulo 8 - Las Áreas de Crecimiento",
          autogenerate: { directory: "capitulo8" },
        },
        {
          label: "Capítulo 9 - Los Objetivos Educativos",
          autogenerate: { directory: "capitulo9" },
        },
        {
          label: "Capítulo 10 - Las Activiadades Educativas",
          autogenerate: { directory: "capitulo10" },
        },
        {
          label: "Capítulo 11 - Evaluación de la Progresión Personal",
          autogenerate: { directory: "capitulo11" },
        },
        {
          label: "Capítulo 12 - El Ciclo de Programa",
          autogenerate: { directory: "capitulo12" },
        },
      ],
    }),
  ],
});
