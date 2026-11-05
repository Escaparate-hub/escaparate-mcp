import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { fechasDelAnio, type FechaClave } from "../data/fechas.js";
import { SECTORES, desdeIso, diasEntre, hoy, iso, nombreDia, respuesta, sinTildes, sumarDias, type Sector } from "../util.js";

export interface FiltroFechas {
  desde: Date;
  hasta: Date;
  sector: Sector;
  region?: string;
  incluirFestivos: boolean;
}

/** Fechas clave entre dos días, filtradas por sector y comunidad autónoma. */
export function fechasEnRango({ desde, hasta, sector, region, incluirFestivos }: FiltroFechas): FechaClave[] {
  const regionNorm = region ? sinTildes(region) : undefined;
  const anios = new Set([desde.getUTCFullYear(), hasta.getUTCFullYear()]);

  return [...anios]
    .flatMap(fechasDelAnio)
    .filter((f) => f.fecha >= desde && f.fecha <= hasta)
    .filter((f) => {
      if (f.tipo === "festivo_nacional") return incluirFestivos;
      if (f.tipo === "festivo_regional") {
        return incluirFestivos && !!regionNorm && f.regiones!.some((r) => regionNorm.includes(r) || r.includes(regionNorm));
      }
      return sector === "general" || f.sectores === "todos" || f.sectores.includes(sector);
    })
    .sort((a, b) => a.fecha.getTime() - b.fecha.getTime());
}

export function registrarCalendario(server: McpServer) {
  server.registerTool(
    "calendario_marketing",
    {
      title: "Calendario de marketing (España)",
      description:
        "Fechas clave comerciales, sociales y festivos de España en un periodo, filtradas por sector y comunidad autónoma. " +
        "Indica cuándo empezar a preparar cada campaña. Calcula las fechas móviles (Semana Santa, Día de la Madre, Black Friday...).",
      inputSchema: {
        desde: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().describe("Fecha de inicio AAAA-MM-DD (por defecto, hoy)"),
        meses: z.number().int().min(1).max(12).default(3).describe("Meses a cubrir"),
        sector: z.enum(SECTORES).default("general"),
        comunidad_autonoma: z.string().optional().describe("Ej.: Cataluña, Andalucía, Comunidad de Madrid. Activa los festivos regionales."),
        incluir_festivos: z.boolean().default(true),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ desde, meses, sector, comunidad_autonoma, incluir_festivos }) => {
      const inicio = desde ? desdeIso(desde) : hoy();
      const fin = sumarDias(inicio, Math.round(meses * 30.44));
      const referencia = hoy();

      const fechas = fechasEnRango({ desde: inicio, hasta: fin, sector, region: comunidad_autonoma, incluirFestivos: incluir_festivos }).map((f) => {
        const preparar = sumarDias(f.fecha, -f.antelacion);
        return {
          fecha: iso(f.fecha),
          dia: nombreDia(f.fecha),
          nombre: f.nombre,
          tipo: f.tipo,
          idea: f.idea,
          empezar_a_preparar: iso(preparar),
          dias_para_la_fecha: diasEntre(referencia, f.fecha),
          urgente: preparar <= referencia && f.fecha >= referencia,
        };
      });

      const notas = [
        "Los festivos regionales y locales cambian cada año: confírmalos en el BOE o en el boletín de tu comunidad.",
        "Los festivos locales del municipio (dos al año) no están incluidos.",
      ];
      if (!comunidad_autonoma) notas.unshift("Indica 'comunidad_autonoma' para añadir los festivos regionales.");

      return respuesta({ periodo: { desde: iso(inicio), hasta: iso(fin) }, sector, total: fechas.length, fechas, notas });
    },
  );
}
