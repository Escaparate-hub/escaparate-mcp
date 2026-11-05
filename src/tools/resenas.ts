import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { SECTORES, respuesta, sinTildes } from "../util.js";

// Raíces sin tildes que deben aparecer al inicio de una palabra del texto normalizado.
// Admiten sintaxis de regex: «ocu(?![a-z])» evita confundir OCU con «ocurrió».
const TEMAS: Record<string, string[]> = {
  atencion: ["atencion", "trato", "camarer", "personal", "dependient", "amable", "borde", "maleducad", "simpatic", "antipatic"],
  espera: ["espera", "tarda", "lento", "lenta", "colas?(?![a-z])", "retraso", "puntual"],
  precio: ["precio", "caros?(?![a-z])", "caras?(?![a-z])", "barato", "calidad-precio", "calidad precio", "cobr", "factura", "cuenta"],
  calidad: ["calidad", "sabor", "frio", "fria", "rico", "delicios", "malisim", "excelente", "resultado", "profesional"],
  limpieza: ["limpi", "sucio", "sucia", "higiene", "bano", "aseo"],
  ambiente: ["ambiente", "ruido", "musica", "decoracion", "terraza"],
  reserva: ["reserva", "cita", "mesa", "hueco", "telefono", "no contestan"],
};

const RIESGOS = [
  "intoxica", "alergi", "gluten", "celiac", "denuncia", "abogad", "ocu(?![a-z])", "consumo", "hoja de reclamaciones",
  "sanidad", "inspeccion", "robo", "robaron", "discrimin", "racis", "acoso", "cucaracha", "ratas?(?![a-z])", "ratones", "herida", "quemadura", "negligencia",
];

const NEGATIVOS = ["pero(?![a-z])", "aunque", "lastima", "pena que", "mejorar", "fallo"];

function aparece(texto: string, raiz: string): boolean {
  return new RegExp(`(?<![a-z])${raiz}`).test(texto);
}

export function registrarResenas(server: McpServer) {
  server.registerTool(
    "guia_resena",
    {
      title: "Guía para responder una reseña",
      description:
        "Analiza una reseña de Google (estrellas y texto) y devuelve el tipo de reseña, los temas mencionados, los riesgos legales o reputacionales, " +
        "la estructura de respuesta recomendada, una plantilla y lo que no hay que hacer. Úsala antes de redactar la respuesta final.",
      inputSchema: {
        estrellas: z.number().int().min(1).max(5),
        texto: z.string().default(""),
        nombre_negocio: z.string(),
        nombre_cliente: z.string().optional(),
        sector: z.enum(SECTORES).default("general"),
        tono: z.enum(["cercano", "formal"]).default("cercano").describe("cercano = tú; formal = usted"),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ estrellas, texto, nombre_negocio, nombre_cliente, sector, tono }) => {
      const t = sinTildes(texto);
      const temas = Object.entries(TEMAS).filter(([, raices]) => raices.some((r) => aparece(t, r))).map(([tema]) => tema);
      const riesgos = RIESGOS.filter((r) => aparece(t, r)).map((r) => r.replace(/\W.*$/, ""));

      const tipo =
        estrellas <= 2 ? "negativa" : estrellas === 3 ? "mixta" : NEGATIVOS.some((p) => aparece(t, p)) ? "positiva_con_pegas" : "positiva";
      const sinTexto = texto.trim().length === 0;
      const posibleNoCliente = estrellas <= 2 && texto.trim().split(/\s+/).length < 6;

      const usted = tono === "formal";
      const saludo = nombre_cliente ? `Hola, ${nombre_cliente}` : "Hola";
      const firma = `[Nombre de quien responde], de ${nombre_negocio}`;

      const estructura: string[] = {
        positiva: [
          "Agradece usando su nombre.",
          "Menciona algo concreto de su reseña (que no parezca copiado y pegado).",
          "Añade un detalle que refuerce tu marca (plato, servicio o persona del equipo).",
          "Invita a volver con algo específico.",
          "Firma con un nombre real.",
        ],
        positiva_con_pegas: [
          "Agradece la valoración positiva.",
          "Reconoce la pega sin excusas.",
          "Explica brevemente qué haces para mejorarlo.",
          "Invita a volver y comprobarlo.",
          "Firma con un nombre real.",
        ],
        mixta: [
          "Agradece que se tome el tiempo de escribir.",
          "Reconoce lo bueno y lo que falló, en concreto.",
          "Explica qué cambias (si es cierto).",
          "Ofrece hablarlo por privado.",
          "Firma con un nombre real.",
        ],
        negativa: [
          "Responde en menos de 24 horas y con calma (escríbela, espera 1 hora y revísala).",
          "Agradece y pide disculpas por la experiencia, sin discutir los hechos en público.",
          "Reconoce el problema concreto.",
          "Explica qué has hecho o vas a hacer, solo si es verdad.",
          "Lleva la conversación a privado: email o teléfono del negocio.",
          "Firma con un nombre real (genera confianza en quien lee después).",
        ],
      }[tipo];

      const tu = (a: string, b: string) => (usted ? b : a);
      const plantilla = {
        positiva: `${saludo}, ¡muchísimas gracias por ${tu("tu", "su")} reseña! Nos alegra un montón que ${tu("disfrutaras", "disfrutara")} de [detalle concreto que menciona]. [Frase sobre el equipo o el producto]. ${tu("Te esperamos", "Le esperamos")} pronto para [algo específico]. Un abrazo, ${firma}.`,
        positiva_con_pegas: `${saludo}, gracias por ${tu("tu", "su")} valoración y por contarnos lo de [pega concreta]. ${tu("Tienes", "Tiene")} razón y ya estamos [acción concreta]. Nos encantaría que ${tu("volvieras", "volviera")} a comprobarlo. Un saludo, ${firma}.`,
        mixta: `${saludo}, gracias por ${tu("tomarte", "tomarse")} el tiempo de escribirnos. Nos alegra que [lo positivo] y sentimos que [lo negativo concreto]. [Qué cambiamos]. Si ${tu("quieres", "quiere")}, ${tu("escríbenos", "escríbanos")} a [email] y lo hablamos. Un saludo, ${firma}.`,
        negativa: `${saludo}, gracias por ${tu("contarnos tu", "contarnos su")} experiencia y lamentamos de verdad que [problema concreto]. No es lo que queremos para nadie que confía en nosotros. [Qué hemos hecho o haremos]. Nos gustaría hablarlo ${tu("contigo", "con usted")} con calma: ${tu("escríbenos", "escríbanos")} a [email] o ${tu("llámanos", "llámenos")} y lo vemos. Un saludo, ${firma}.`,
      }[tipo];

      const noHacer = [
        "No discutas ni llames mentiroso al cliente en público.",
        "No reveles datos personales ni detalles de su visita o pedido (RGPD).",
        "No ofrezcas descuentos ni regalos a cambio de cambiar o borrar la reseña: va contra las políticas de Google.",
        "No copies y pegues la misma respuesta en todas las reseñas.",
      ];
      if (sector === "salud") {
        noHacer.unshift("Nunca confirmes que la persona es o fue paciente, ni menciones tratamientos: es un dato de salud protegido y está sujeto a secreto profesional.");
      }

      const alertas: string[] = [];
      if (riesgos.length) {
        alertas.push(
          `Posible riesgo legal o sanitario (${riesgos.join(", ")}): responde de forma breve y empática, sin admitir hechos ni culpa en público, y ofrece contacto privado. Documenta el caso y consulta a tu asesor si hay amenaza de denuncia.`,
        );
      }
      if (posibleNoCliente) {
        alertas.push("Reseña muy breve y negativa: comprueba en tus registros si fue cliente. Si no lo es, responde con educación («no encontramos tu visita») y denúnciala en Google si incumple las políticas.");
      }
      if (sinTexto) alertas.push("Reseña sin texto: basta con una respuesta corta y personal (1-2 frases).");

      return respuesta({
        tipo,
        temas,
        alertas,
        longitud_recomendada: tipo === "positiva" ? "25-60 palabras" : "50-110 palabras",
        estructura,
        plantilla,
        no_hacer: noHacer,
        extra: "Responder a todas las reseñas, también a las buenas, mejora la posición en Google Maps y la confianza de quien lee.",
      });
    },
  );
}
