import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { FORMATOS } from "../data/plataformas.js";
import { SECTORES_DATOS, type Pilar } from "../data/sectores.js";
import { CANALES, SECTORES, desdeIso, diasEntre, hoy, iso, nombreDia, respuesta, sumarDias, type Canal } from "../util.js";
import { fechasEnRango } from "./calendario.js";

/** Días de publicación (0 = domingo) según el número de publicaciones semanales. */
const DIAS_POR_FRECUENCIA: Record<number, number[]> = {
  1: [4],
  2: [2, 5],
  3: [1, 3, 5],
  4: [1, 3, 4, 6],
  5: [1, 2, 3, 4, 5],
  6: [1, 2, 3, 4, 5, 6],
  7: [1, 2, 3, 4, 5, 6, 0],
};

/** Proporción de pilares por objetivo, repetida en ciclo. Nunca más de ~1/3 de promoción. */
const MEZCLA: Record<string, Pilar[]> = {
  visibilidad: ["educar", "comunidad", "detras_de_escenas", "educar", "prueba_social", "comunidad", "promocion"],
  ventas: ["promocion", "educar", "prueba_social", "detras_de_escenas", "promocion", "comunidad", "prueba_social"],
  fidelizar: ["comunidad", "detras_de_escenas", "prueba_social", "educar", "comunidad", "promocion", "detras_de_escenas"],
};

// En España se consume contenido tarde: mediodía (13:30-14:30) y noche (20:30-22:00).
function horaSugerida(canal: Canal, diaSemana: number, indice: number): string {
  if (canal === "linkedin") return "08:30";
  if (canal === "google_business") return "10:00";
  if (diaSemana === 6) return "11:30";
  if (diaSemana === 0) return "19:30";
  return indice % 2 === 0 ? "13:30" : "21:00";
}

export function registrarPlan(server: McpServer) {
  server.registerTool(
    "plan_contenidos",
    {
      title: "Plan de contenidos para redes",
      description:
        "Genera un calendario editorial semana a semana para una pyme española: fecha, hora, canal, formato, pilar de contenido e idea concreta. " +
        "Integra automáticamente las fechas clave del sector. Úsalo como esqueleto y redacta después cada publicación.",
      inputSchema: {
        sector: z.enum(SECTORES).default("general"),
        canales: z.array(z.enum(CANALES)).min(1).default(["instagram"]),
        publicaciones_por_semana: z.number().int().min(1).max(7).default(3),
        semanas: z.number().int().min(1).max(8).default(4),
        objetivo: z.enum(["visibilidad", "ventas", "fidelizar"]).default("visibilidad"),
        desde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("AAAA-MM-DD. Por defecto, el próximo lunes."),
        comunidad_autonoma: z.string().optional(),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ sector, canales, publicaciones_por_semana, semanas, objetivo, desde, comunidad_autonoma }) => {
      // El plan siempre arranca en lunes: el indicado (o el siguiente) o el próximo desde hoy
      const base = desde ? desdeIso(desde) : hoy();
      const lunes = sumarDias(base, (8 - base.getUTCDay()) % 7);
      const fin = sumarDias(lunes, semanas * 7 - 1);
      const datos = SECTORES_DATOS[sector];
      const mezcla = MEZCLA[objetivo];
      const dias = DIAS_POR_FRECUENCIA[publicaciones_por_semana];

      const fechasClave = fechasEnRango({ desde: lunes, hasta: sumarDias(fin, 7), sector, region: comunidad_autonoma, incluirFestivos: true });
      const usadas = new Set<string>();
      const contadorPilar: Partial<Record<Pilar, number>> = {};
      const contadorFormato: Partial<Record<Canal, number>> = {};

      const publicaciones = [];
      let n = 0;
      for (let semana = 0; semana < semanas; semana++) {
        for (const diaSemana of dias) {
          // lunes + desfase: el domingo (0) va al final de la semana
          const fecha = sumarDias(lunes, semana * 7 + ((diaSemana + 6) % 7));
          const canal = canales[n % canales.length];
          const formatos = FORMATOS[canal].formatos;
          const iFormato = contadorFormato[canal] ?? 0;
          contadorFormato[canal] = iFormato + 1;

          // Si hay una fecha clave en los próximos 7 días, esta publicación se dedica a ella
          const clave = fechasClave.find((f) => {
            const faltan = diasEntre(fecha, f.fecha);
            return faltan >= 0 && faltan <= 7 && !usadas.has(f.nombre);
          });

          let pilar: Pilar | "fecha_clave";
          let idea: string;
          if (clave) {
            usadas.add(clave.nombre);
            pilar = "fecha_clave";
            idea = `${clave.nombre} (${iso(clave.fecha)}): ${clave.idea}`;
          } else {
            pilar = mezcla[n % mezcla.length];
            const iIdea = contadorPilar[pilar] ?? 0;
            contadorPilar[pilar] = iIdea + 1;
            idea = datos.ideas[pilar][iIdea % datos.ideas[pilar].length];
          }

          publicaciones.push({
            fecha: iso(fecha),
            dia: nombreDia(fecha),
            hora: horaSugerida(canal, diaSemana, n),
            canal,
            formato: formatos[iFormato % formatos.length],
            pilar,
            idea,
          });
          n++;
        }
      }

      return respuesta({
        periodo: { desde: iso(lunes), hasta: iso(fin) },
        sector,
        objetivo,
        publicaciones,
        consejos: [
          "Graba en bloque: dedica 2 horas a la semana a crear todo el contenido.",
          "Reutiliza: un reel de Instagram sirve para TikTok y para la ficha de Google (foto fija).",
          "Responde los comentarios en la primera hora: el algoritmo lo premia.",
          "Mide cada mes guardados, compartidos y mensajes recibidos, no solo los «me gusta».",
        ],
      });
    },
  );
}
