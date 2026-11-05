export const SECTORES = [
  "hosteleria",
  "belleza",
  "comercio",
  "salud",
  "fitness",
  "inmobiliaria",
  "servicios",
  "educacion",
  "general",
] as const;
export type Sector = (typeof SECTORES)[number];

export const CANALES = ["instagram", "facebook", "tiktok", "linkedin", "google_business", "x"] as const;
export type Canal = (typeof CANALES)[number];

export const AVISO_LEGAL =
  "Orientación general, no asesoramiento legal ni fiscal. Confirma los detalles con tu gestoría o asesor antes de actuar.";

/** Envuelve un objeto como respuesta de herramienta MCP. */
export function respuesta(datos: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(datos, null, 2) }] };
}

// Fechas: se trabaja siempre en UTC a medianoche para evitar saltos por zona horaria.

export function iso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function desdeIso(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function hoy(): Date {
  const n = new Date();
  return new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()));
}

export function sumarDias(d: Date, dias: number): Date {
  const r = new Date(d);
  r.setUTCDate(r.getUTCDate() + dias);
  return r;
}

export function diasEntre(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / 86_400_000);
}

/** n-ésimo día de la semana de un mes (diaSemana: 0 = domingo). */
export function nEsimoDiaSemana(anio: number, mes: number, diaSemana: number, n: number): Date {
  const primero = new Date(Date.UTC(anio, mes - 1, 1));
  const desfase = (diaSemana - primero.getUTCDay() + 7) % 7;
  return new Date(Date.UTC(anio, mes - 1, 1 + desfase + (n - 1) * 7));
}

/** Domingo de Pascua (algoritmo gregoriano anónimo). */
export function domingoDePascua(anio: number): Date {
  const a = anio % 19;
  const b = Math.floor(anio / 100);
  const c = anio % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);
  const dia = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(anio, mes - 1, dia));
}

const DIAS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];
export function nombreDia(d: Date): string {
  return DIAS[d.getUTCDay()];
}

/** Minúsculas y sin tildes, para comparar texto. */
export function sinTildes(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

/** Convierte "Peluquería Malasaña" en "peluqueriamalasana" para usar como hashtag. */
export function aHashtag(s: string): string {
  return sinTildes(s).replace(/ñ/g, "n").replace(/[^a-z0-9]/g, "");
}
