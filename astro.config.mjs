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
        github: "https://github.com/withastro/starlight",
      },
      sidebar: [
        {
          label: "Acerca de este libro",
          items: [
            { label: "Portada", slug: "intro/portada" },
            { label: "Presentación", slug: "intro/presentation" },
          ],
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
      ],
    }),
  ],
});
