import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { FORMATOS, LATINOAMERICANISMOS } from "../data/plataformas.js";
import { SECTORES_DATOS } from "../data/sectores.js";
import { CANALES, SECTORES, aHashtag, respuesta } from "../util.js";

const RE_HASHTAG = /#[\p{L}\p{N}_]+/gu;
const RE_EMOJI = /\p{Extended_Pictographic}/gu;
const RE_URL = /https?:\/\/|www\./i;
const RE_TELEFONO = /(?:\+34[\s.-]?)?[6789](?:[\s.-]?\d){8}/;
const RE_CTA =
  /(?<!\p{L})(reserva|reservar|llama|llámanos|escríbenos|escribe|visítanos|ven|pide|compra|descubre|apúntate|inscríbete|enlace|link|bio|contacta|comenta|guarda|comparte|whatsapp|md|dm|pásate|consulta)(?!\p{L})/iu;
const RE_MAYUSCULAS = /(?<!\p{L})[A-ZÁÉÍÓÚÑÜ]{4,}(?!\p{L})/gu;

/** Busca una palabra completa respetando tildes (no confunde «papas» con «papás»). */
function contiene(texto: string, palabra: string): boolean {
  return new RegExp(`(?<![\\p{L}])${palabra}(?![\\p{L}])`, "iu").test(texto);
}

export function registrarRedes(server: McpServer) {
  server.registerTool(
    "revisar_post",
    {
      title: "Revisar publicación",
      description:
        "Revisa el texto de una publicación antes de publicarla: longitud y corte del «ver más», hashtags, llamada a la acción, " +
        "emojis, enlaces o teléfonos no permitidos y expresiones latinoamericanas que suenan raras en España. Devuelve avisos y el formato de imagen.",
      inputSchema: {
        texto: z.string().min(1),
        plataforma: z.enum(CANALES),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ texto, plataforma }) => {
      const f = FORMATOS[plataforma];
      const caracteres = [...texto].length;
      const hashtags = texto.match(RE_HASHTAG) ?? [];
      const emojis = (texto.match(RE_EMOJI) ?? []).length;
      const avisos: string[] = [];
      const sugerencias: string[] = [];

      if (caracteres > f.limite) avisos.push(`Supera el límite de ${f.limite} caracteres (tiene ${caracteres}).`);
      if (f.corte && caracteres > f.corte) {
        sugerencias.push(`Solo se ven los primeros ~${f.corte} caracteres antes del «ver más»: pon ahí el gancho. Ahora se ve: «${[...texto].slice(0, f.corte).join("")}…»`);
      }
      if (hashtags.length > f.hashtags.max) avisos.push(`Demasiados hashtags (${hashtags.length}); recomendado: ${f.hashtags.min}-${f.hashtags.max}.`);
      if (hashtags.length < f.hashtags.min) sugerencias.push(`Añade entre ${f.hashtags.min} y ${f.hashtags.max} hashtags (usa la herramienta hashtags_locales).`);
      if (!RE_CTA.test(texto)) sugerencias.push("No hay llamada a la acción clara: di qué quieres que haga quien lo lee (reservar, escribir, guardar...).");
      if (emojis > 8) sugerencias.push(`Hay ${emojis} emojis: pueden restar credibilidad. Con 2-5 suele bastar.`);
      if (plataforma === "instagram" && RE_URL.test(texto)) avisos.push("En Instagram los enlaces del texto no son clicables: usa «enlace en la bio».");
      if (plataforma === "google_business" && RE_TELEFONO.test(texto)) avisos.push("Google puede rechazar publicaciones con teléfono en el texto: usa el botón de llamada.");

      const mayusculas = texto.match(RE_MAYUSCULAS) ?? [];
      if (mayusculas.length > 3) sugerencias.push("Demasiadas palabras en MAYÚSCULAS: se lee como si gritaras.");

      const variantes = LATINOAMERICANISMOS.filter(([palabra]) => contiene(texto, palabra)).map(([palabra, espana]) => ({ palabra, en_espana: espana }));
      if (variantes.length) sugerencias.push("Hay expresiones que en España suenan a traducción o a otro país: revisa «variantes».");

      return respuesta({
        plataforma,
        caracteres,
        limite: f.limite,
        hashtags,
        emojis,
        listo_para_publicar: avisos.length === 0,
        avisos,
        sugerencias,
        variantes,
        formato_imagen: f.imagen,
        notas_plataforma: f.notas,
      });
    },
  );

  server.registerTool(
    "hashtags_locales",
    {
      title: "Hashtags locales",
      description:
        "Propone hashtags en español combinando ciudad, barrio, actividad y sector, y recomienda una mezcla de 3-5 (local + nicho + marca). " +
        "Los hashtags locales atraen clientes que pueden venir; los genéricos solo dan alcance.",
      inputSchema: {
        ciudad: z.string().min(2),
        sector: z.enum(SECTORES).default("general"),
        actividad: z.string().optional().describe("Lo que haces en una o dos palabras: «cafetería», «fisioterapia», «uñas»"),
        barrio: z.string().optional(),
        nombre_negocio: z.string().optional(),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ ciudad, sector, actividad, barrio, nombre_negocio }) => {
      const datos = SECTORES_DATOS[sector];
      const c = aHashtag(ciudad);
      const a = aHashtag(actividad ?? datos.palabra);
      const b = barrio ? aHashtag(barrio) : undefined;

      const local = [`#${a}${c}`, `#${c}`, `#${c}${datos.palabra === a ? "" : datos.palabra}`, ...(b ? [`#${b}`, `#${a}${b}`, `#barrio${b}`] : []), `#comerciolocal${c}`];
      const nicho = [`#${a}`, ...datos.hashtags.map((h) => `#${h}`)];
      const marca = nombre_negocio ? [`#${aHashtag(nombre_negocio)}`] : [];
      const unicos = (xs: string[]) => [...new Set(xs)].filter((h) => h.length > 2);

      const recomendada = unicos([local[0], ...(b ? [`#${a}${b}`] : [local[1]]), nicho[0], nicho[1], ...marca]).slice(0, 5);

      return respuesta({
        local: unicos(local),
        nicho: unicos(nicho),
        marca,
        mezcla_recomendada: recomendada,
        consejos: [
          "En Instagram y TikTok, 3-5 hashtags relevantes funcionan mejor que 30 genéricos.",
          "Cambia la mezcla de vez en cuando; no pegues siempre el mismo bloque.",
          "Etiqueta también la ubicación en la publicación: pesa más que el hashtag de ciudad.",
        ],
      });
    },
  );
}
