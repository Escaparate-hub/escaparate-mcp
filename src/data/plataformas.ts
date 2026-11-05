import type { Canal } from "../util.js";

interface Formato {
  limite: number;
  /** Caracteres visibles antes del «ver más». */
  corte?: number;
  hashtags: { min: number; max: number };
  imagen: string;
  formatos: string[];
  notas: string[];
}

export const FORMATOS: Record<Canal, Formato> = {
  instagram: {
    limite: 2200,
    corte: 125,
    hashtags: { min: 3, max: 5 },
    imagen: "Feed 1080×1350 (4:5) · Reels y stories 1080×1920 (9:16)",
    formatos: ["reel", "carrusel", "foto", "story con encuesta"],
    notas: ["Los enlaces del texto no son clicables: usa «enlace en la bio» o una story con enlace."],
  },
  facebook: {
    limite: 63206,
    corte: 250,
    hashtags: { min: 0, max: 3 },
    imagen: "1080×1350 (4:5) o 1080×1080 (1:1)",
    formatos: ["foto", "vídeo corto", "evento", "enlace"],
    notas: ["Funciona bien con públicos de más de 40 años y grupos locales del barrio."],
  },
  tiktok: {
    limite: 4000,
    corte: 100,
    hashtags: { min: 3, max: 5 },
    imagen: "Vídeo 1080×1920 (9:16)",
    formatos: ["vídeo corto (15-45 s)", "tendencia con audio popular", "carrusel de fotos"],
    notas: ["Lo que cuenta es el gancho de los primeros 2 segundos, no el texto."],
  },
  linkedin: {
    limite: 3000,
    corte: 210,
    hashtags: { min: 0, max: 3 },
    imagen: "1200×1200 o 1080×1350; carrusel en PDF",
    formatos: ["texto + imagen", "carrusel PDF", "artículo corto"],
    notas: ["Mejor desde el perfil personal de quien dirige el negocio que desde la página de empresa."],
  },
  google_business: {
    limite: 1500,
    corte: 300,
    hashtags: { min: 0, max: 0 },
    imagen: "1200×900 (4:3)",
    formatos: ["novedad con foto", "oferta", "evento"],
    notas: [
      "Ideal entre 150 y 300 caracteres.",
      "No pongas el teléfono en el texto: Google puede rechazar la publicación. Usa el botón de llamada.",
      "Sin hashtags.",
    ],
  },
  x: {
    limite: 280,
    hashtags: { min: 0, max: 2 },
    imagen: "1600×900 (16:9)",
    formatos: ["texto", "texto + imagen", "hilo"],
    notas: ["Útil sobre todo para atención al cliente y noticias del sector."],
  },
};

/** Expresiones habituales en Latinoamérica y su equivalente en España. */
export const LATINOAMERICANISMOS: [string, string][] = [
  ["celular", "móvil"],
  ["computadora", "ordenador"],
  ["computador", "ordenador"],
  ["carro", "coche"],
  ["jugo", "zumo"],
  ["departamento", "piso"],
  ["platicar", "charlar"],
  ["ahorita", "ahora"],
  ["rentar", "alquilar"],
  ["boleto", "billete o entrada"],
  ["boletos", "billetes o entradas"],
  ["estacionar", "aparcar"],
  ["estacionamiento", "aparcamiento o parking"],
  ["parquear", "aparcar"],
  ["checar", "comprobar"],
  ["chévere", "genial"],
  ["padrísimo", "genial"],
  ["anteojos", "gafas"],
  ["alberca", "piscina"],
  ["pileta", "piscina"],
  ["playera", "camiseta"],
  ["remera", "camiseta"],
  ["durazno", "melocotón"],
  ["frutilla", "fresa"],
  ["mesero", "camarero"],
  ["mesera", "camarera"],
  ["cuadra", "manzana"],
  ["ustedes", "vosotros (si el tono es cercano; «ustedes» en España es formal)"],
];
