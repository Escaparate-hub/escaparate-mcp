import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { respuesta } from "../util.js";

interface Criterio {
  campo: string;
  peso: number;
  /** Fracción del peso conseguida (0-1) según el valor declarado. */
  nota: (v: number | boolean) => number;
  accion: string;
}

const escalones = (pasos: [number, number][]) => (v: number | boolean) => {
  const n = Number(v);
  for (const [umbral, fraccion] of pasos) if (n >= umbral) return fraccion;
  return 0;
};
const si = (v: number | boolean) => (v ? 1 : 0);

// Pesos orientativos basados en los factores de posicionamiento local conocidos (relevancia, distancia, prominencia).
const CRITERIOS: Criterio[] = [
  { campo: "categoria_principal_correcta", peso: 10, nota: si, accion: "Elige la categoría principal más específica posible (p. ej. «Peluquería unisex», no «Salón de belleza»). Es el factor que más pesa." },
  { campo: "categorias_secundarias", peso: 5, nota: escalones([[2, 1], [1, 0.6]]), accion: "Añade 2-4 categorías secundarias que describan servicios reales." },
  { campo: "caracteres_descripcion", peso: 5, nota: escalones([[500, 1], [250, 0.6]]), accion: "Escribe una descripción de 500-750 caracteres con qué haces, para quién, en qué barrio y qué te diferencia." },
  { campo: "horario_completo", peso: 5, nota: si, accion: "Completa el horario de todos los días." },
  { campo: "horarios_especiales_festivos", peso: 5, nota: si, accion: "Configura los horarios especiales de festivos: Google avisa a los usuarios y penaliza las fichas con información incorrecta." },
  { campo: "tiene_web", peso: 4, nota: si, accion: "Enlaza una web (aunque sea una sola página) con la misma dirección y teléfono." },
  { campo: "tiene_telefono", peso: 4, nota: si, accion: "Añade un teléfono local o móvil que se conteste." },
  { campo: "nap_consistente", peso: 8, nota: si, accion: "Unifica el nombre, la dirección y el teléfono (NAP) en Google, la web, las redes y los directorios (Páginas Amarillas, TripAdvisor, Doctoralia...)." },
  { campo: "productos_o_servicios", peso: 5, nota: si, accion: "Añade la lista de productos o servicios con precio orientativo y foto." },
  { campo: "atributos", peso: 3, nota: si, accion: "Marca los atributos (accesible, wifi, pago con tarjeta, terraza...)." },
  { campo: "fotos_totales", peso: 8, nota: escalones([[50, 1], [20, 0.6], [5, 0.25]]), accion: "Sube fotos reales: fachada (para que la reconozcan), interior, equipo y productos. Objetivo: más de 50." },
  { campo: "fotos_ultimo_mes", peso: 4, nota: escalones([[4, 1], [1, 0.5]]), accion: "Sube al menos una foto nueva por semana: indica a Google que el negocio está activo." },
  { campo: "numero_resenas", peso: 10, nota: escalones([[100, 1], [50, 0.8], [20, 0.5], [5, 0.2]]), accion: "Pide reseñas de forma sistemática: un QR en el mostrador o en el ticket y un mensaje tras el servicio. Pídeselo a todos, no solo a los clientes contentos." },
  { campo: "resenas_ultimo_mes", peso: 5, nota: escalones([[4, 1], [1, 0.4]]), accion: "Busca un ritmo constante de reseñas nuevas (al menos una por semana)." },
  { campo: "valoracion_media", peso: 6, nota: escalones([[4.6, 1], [4.3, 0.7], [4.0, 0.35]]), accion: "Detecta en las reseñas negativas qué se repite y arréglalo en el negocio; luego responde contando el cambio." },
  { campo: "porcentaje_resenas_respondidas", peso: 8, nota: escalones([[90, 1], [50, 0.5], [1, 0.15]]), accion: "Responde a todas las reseñas en menos de 48 h (usa la herramienta guia_resena)." },
  { campo: "publicaciones_ultimo_mes", peso: 5, nota: escalones([[4, 1], [1, 0.4]]), accion: "Publica novedades en la ficha cada semana (ofertas, eventos, fotos de producto)." },
];

export function registrarAuditoria(server: McpServer) {
  const forma: Record<string, z.ZodOptional<z.ZodBoolean> | z.ZodOptional<z.ZodNumber>> = {};
  for (const c of CRITERIOS) {
    const booleano = c.nota === si;
    forma[c.campo] = (booleano ? z.boolean() : z.number().min(0)).optional();
  }

  server.registerTool(
    "auditoria_ficha_google",
    {
      title: "Auditoría de la ficha de Google Business",
      description:
        "Puntúa de 0 a 100 la ficha de Google Business Profile de un negocio a partir de los datos que indiques, y devuelve las acciones ordenadas por impacto. " +
        "Pregunta al usuario los datos que falten; los campos sin respuesta no cuentan para la nota.",
      inputSchema: forma,
      annotations: { readOnlyHint: true },
    },
    async (datos) => {
      let conseguido = 0;
      let posible = 0;
      const acciones: { accion: string; puntos_a_ganar: number }[] = [];
      const faltan: string[] = [];

      for (const c of CRITERIOS) {
        const v = datos[c.campo] as number | boolean | undefined;
        if (v === undefined) {
          faltan.push(c.campo);
          continue;
        }
        const puntos = c.peso * c.nota(v);
        conseguido += puntos;
        posible += c.peso;
        if (puntos < c.peso) acciones.push({ accion: c.accion, puntos_a_ganar: Math.round((c.peso - puntos) * 10) / 10 });
      }

      const puntuacion = posible ? Math.round((conseguido / posible) * 100) : null;
      acciones.sort((a, b) => b.puntos_a_ganar - a.puntos_a_ganar);

      return respuesta({
        puntuacion,
        nivel: puntuacion === null ? "sin datos" : puntuacion >= 75 ? "buena" : puntuacion >= 50 ? "mejorable" : "básica",
        cobertura: `${CRITERIOS.length - faltan.length}/${CRITERIOS.length} criterios evaluados`,
        acciones_prioritarias: acciones,
        datos_que_faltan: faltan,
        nota: "Los pesos son orientativos; Google no publica su algoritmo. La distancia al usuario también influye y no depende de ti.",
      });
    },
  );
}
