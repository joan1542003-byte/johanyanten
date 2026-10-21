// Static content for phase 2. Phase 3 moves this into Supabase with the same shape.

export type Category = "branding" | "info" | "uxui" | "motion" | "data";

type Localized = { es: string; en: string };

export type Img = { src: string; w: number; h: number };

export type Project = {
  slug: string;
  title: Localized;
  tagline: Localized;
  categories: Category[];
  isNew?: boolean;
  cover: Img;
  description: Localized[];
  youtube?: string;
  gallery: Img[];
};

const img = (folder: string, file: string, w: number, h: number): Img => ({
  src: `/work/${folder}/${file}`,
  w,
  h,
});

export const projects: Project[] = [
  {
    slug: "mi-mama-queria-que-estudiara",
    title: { es: "Mi Mamá Quería Que Estudiara", en: "Mi Mamá Quería Que Estudiara" },
    tagline: { es: "Diseño de marca · Podcast", en: "Brand design · Podcast" },
    categories: ["branding"],
    isNew: true,
    cover: img("naka", "cover.png", 1351, 1440),
    description: [
      {
        es: "La creación de la identidad de marca para «Mi mamá quería que estudiara», un podcast conducido por Cristianghost y Janojey, dos de las figuras más reconocidas del streaming en Chile.",
        en: "Brand identity for “Mi mamá quería que estudiara”, a podcast hosted by Cristianghost and Janojey, two of the best-known streamers in Chile.",
      },
      {
        es: "El objetivo fue construir un universo visual que representara la sinergia y el humor de ambos creadores para su nuevo podcast.",
        en: "The goal was to build a visual universe that captures the chemistry and humor of both creators for their new show.",
      },
    ],
    youtube: "91Z9RTg4pLE",
    gallery: [
      img("naka", "1.png", 1582, 1187),
      img("naka", "2.png", 4745, 2663),
      img("naka", "3.png", 4745, 2694),
      img("naka", "4.png", 4745, 2694),
    ],
  },
  {
    slug: "parque-nacional-nevado-de-tres-cruces",
    title: { es: "Parque Nacional Nevado de Tres Cruces", en: "Nevado de Tres Cruces National Park" },
    tagline: { es: "Branding", en: "Branding" },
    categories: ["branding"],
    isNew: true,
    cover: img("tres-cruces", "cover.png", 4745, 2694),
    description: [
      {
        es: "El Parque Nacional Nevado de Tres Cruces es un santuario natural en la Región de Atacama, Chile, donde la inmensidad del altiplano se fusiona con paisajes de salares, lagunas y cumbres nevadas.",
        en: "Nevado de Tres Cruces National Park is a natural sanctuary in the Atacama Region of Chile, where the vast highlands meet salt flats, lagoons and snowy peaks.",
      },
      {
        es: "Tomando como inspiración la majestuosidad de la zona, se elaboró un logotipo, paleta de colores y mascota para crear una nueva identidad de marca.",
        en: "Inspired by the grandeur of the area, I designed a logo, color palette and mascot to create a new brand identity.",
      },
    ],
    gallery: [
      img("tres-cruces", "1.png", 2462, 1476),
      img("tres-cruces", "2.png", 4354, 2694),
      img("tres-cruces", "3.png", 4686, 2694),
      img("tres-cruces", "4.png", 4745, 2694),
    ],
  },
  {
    slug: "zoo-nacional-condor",
    title: { es: "ZOO Nacional: Rehabilitación de un Cóndor", en: "National Zoo: Rehabilitating a Condor" },
    tagline: { es: "Diseño de información", en: "Information design" },
    categories: ["info"],
    isNew: true,
    cover: img("zoo", "cover.png", 2400, 1600),
    description: [
      {
        es: "El Zoológico Nacional, dentro del Parquemet, alberga cerca de 1.000 animales de unas 125 especies. Su programa de Rehabilitación busca rescatar, tratar y reinsertar fauna nativa herida, como el cóndor andino.",
        en: "The National Zoo, inside Parquemet, is home to around 1,000 animals from about 125 species. Its rehabilitation program rescues, treats and releases injured native wildlife such as the Andean condor.",
      },
      {
        es: "El desafío fue diseñar el punto de partida de la historia: la llegada de un cóndor herido. Transformar un momento de diagnóstico clínico, potencialmente complejo y estático, en una experiencia interactiva y comprensible para todos los visitantes.",
        en: "The challenge was to design the start of the story: the arrival of an injured condor. Turning a complex, static clinical diagnosis into an interactive experience every visitor can understand.",
      },
    ],
    gallery: [
      img("zoo", "1.png", 2048, 1152),
      img("zoo", "2.png", 4745, 2694),
      img("zoo", "3.png", 1395, 779),
    ],
  },
  {
    slug: "mirador-parquemet",
    title: { es: "Mirador Parquemet", en: "Parquemet Lookout" },
    tagline: { es: "Diseño de información", en: "Information design" },
    categories: ["info"],
    cover: img("parquemet", "cover.png", 2408, 1602),
    description: [
      {
        es: "El desafío: revelar la riqueza biológica oculta en una de las zonas más áridas del Parque Metropolitano, transformando un espacio de paso en un punto de conexión y aprendizaje, con la visión de la propia comunidad.",
        en: "The challenge: reveal the hidden biodiversity of one of the driest areas of Santiago’s Metropolitan Park, turning a place people pass through into a point of connection and learning, shaped by the community itself.",
      },
      {
        es: "Se diseñó una pieza de señalética interpretativa que funciona como una ventana narrativa al ecosistema local. La paleta se integra con el paisaje, informando sin generar ruido visual.",
        en: "I designed an interpretive sign that works as a narrative window into the local ecosystem. Its palette blends into the landscape, informing without visual noise.",
      },
    ],
    gallery: [
      img("parquemet", "1.png", 858, 432),
      img("parquemet", "2.png", 869, 434),
      img("parquemet", "3.png", 2048, 1152),
      img("parquemet", "4.png", 4745, 2694),
    ],
  },
  {
    slug: "darkwood",
    title: { es: "Darkwood", en: "Darkwood" },
    tagline: { es: "Edición de video · Inteligencia Artificial", en: "Video editing · AI" },
    categories: ["motion"],
    cover: img("darkwood", "cover.png", 2400, 1600),
    description: [
      {
        es: "DARKWOOD es un tráiler cinematográfico que explora la atmósfera del thriller psicológico y el terror paranormal.",
        en: "DARKWOOD is a cinematic trailer exploring the mood of psychological thriller and paranormal horror.",
      },
      {
        es: "Sigue a Sam Fisher, un detective cuya investigación en un pueblo remoto lo lleva a cuestionar su propia realidad, al descubrir que una enigmática versión de sí mismo podría ser la única clave para escapar.",
        en: "It follows Sam Fisher, a detective whose investigation in a remote town makes him question his own reality, as he finds that a strange version of himself may be the only way out.",
      },
    ],
    youtube: "D7U2krkC7TQ",
    gallery: [],
  },
  {
    slug: "cuerpo-completo",
    title: { es: "Cuerpo Completo", en: "Cuerpo Completo" },
    tagline: { es: "Visualización de datos", en: "Data visualization" },
    categories: ["data", "info"],
    cover: img("cuerpo-completo", "cover.png", 505, 505),
    description: [
      {
        es: "Cuerpo Completo traduce un concepto abstracto —el impacto a largo plazo de los hábitos alimenticios— en una experiencia visual y tangible.",
        en: "Cuerpo Completo turns an abstract idea, the long-term impact of eating habits, into a visual, tangible experience.",
      },
      {
        es: "Usando el «completo», ícono de la alimentación universitaria, como unidad de medida no oficial, la instalación proyecta las consecuencias acumulativas en la salud tras un consumo hipotético de cinco años.",
        en: "Using the “completo”, the Chilean hot dog that fuels university students, as an unofficial unit of measure, the installation projects the cumulative health effects of five years of hypothetical consumption.",
      },
    ],
    gallery: [
      img("cuerpo-completo", "1.jpg", 3024, 4032),
      img("cuerpo-completo", "2.jpg", 3024, 4032),
      img("cuerpo-completo", "3.jpg", 3024, 4032),
      img("cuerpo-completo", "4.jpg", 3024, 4032),
    ],
  },
  {
    slug: "disney-plus-ux",
    title: { es: "Caso de estudio UX/UI: Disney+", en: "UX/UI case study: Disney+" },
    tagline: { es: "UX/UI", en: "UX/UI" },
    categories: ["uxui"],
    cover: img("disneyplus", "cover.png", 2400, 1600),
    description: [
      {
        es: "Tras la fusión de los catálogos de Disney+ y Star+, la plataforma creció masivamente, pero generó una biblioteca extensa e inconexa que presentaba serias dificultades de navegación para sus usuarios.",
        en: "After merging the Disney+ and Star+ catalogs, the platform grew massively, but its library became large and disconnected, making it hard for users to navigate.",
      },
    ],
    gallery: [
      img("disneyplus", "1.png", 2113, 1483),
      img("disneyplus", "2.png", 2048, 1437),
      img("disneyplus", "3.png", 2594, 1629),
    ],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
