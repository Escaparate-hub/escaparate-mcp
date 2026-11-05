import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { AVISO_LEGAL, respuesta } from "../util.js";

interface Punto {
  punto: string;
  detalle: string;
  referencia?: string;
}

const CHECKLISTS: Record<string, Punto[]> = {
  sorteo: [
    { punto: "Bases legales publicadas", detalle: "Organizador (razón social y NIF), fechas, ámbito territorial, edad mínima, mecánica, premio y su valor, cómo se elige y se comunica el ganador, plazo para reclamar y política de privacidad. Enlázalas desde la publicación." },
    { punto: "Depósito notarial", detalle: "No es obligatorio, pero da fecha cierta a las bases y protege ante reclamaciones si el premio es valioso." },
    { punto: "Normas de Instagram y Facebook", detalle: "Indica que la plataforma no patrocina, avala ni administra la promoción y que queda exenta de responsabilidad. No pidas a los participantes que etiqueten a personas en contenido donde no aparecen.", referencia: "Normas de promociones de Meta" },
    { punto: "Protección de datos", detalle: "Informa de quién trata los datos, para qué y durante cuánto tiempo. Si quieres usarlos después para enviar publicidad, pide un consentimiento aparte (casilla no marcada).", referencia: "RGPD y LOPDGDD" },
    { punto: "Menores", detalle: "Por debajo de 14 años no pueden consentir el tratamiento de sus datos: lo más sencillo es exigir mayoría de edad.", referencia: "Art. 7 LOPDGDD" },
    { punto: "Fiscalidad del premio", detalle: "Para el ganador, el premio es una ganancia patrimonial en el IRPF. Si su valor supera 300 €, el organizador debe practicar retención o ingreso a cuenta y declararlo. Consúltalo con tu gestoría.", referencia: "Reglamento del IRPF" },
    { punto: "Productos con restricciones", detalle: "Si el premio es alcohol, juego, tabaco o un producto sanitario, hay limitaciones de publicidad adicionales." },
  ],
  descuentos: [
    { punto: "Precio anterior real", detalle: "Al anunciar una rebaja, el precio anterior que muestres debe ser el más bajo aplicado en los 30 días previos.", referencia: "Art. 20 Ley 7/1996 de Ordenación del Comercio Minorista (modificado por el RDL 24/2021, Directiva Ómnibus)" },
    { punto: "Mostrar ambos precios", detalle: "En las rebajas y promociones, el precio anterior y el nuevo deben aparecer juntos de forma clara." },
    { punto: "Productos de rebajas", detalle: "Solo pueden rebajarse artículos que ya estaban en la oferta habitual y no pueden estar deteriorados. Las fechas de rebajas son libres.", referencia: "Arts. 24-25 Ley 7/1996" },
    { punto: "Sin publicidad engañosa", detalle: "Si «hasta un 70 %» solo se aplica a unos pocos artículos, puede considerarse engañoso. Las condiciones (fechas, unidades, exclusiones) deben verse sin letra pequeña.", referencia: "Ley 3/1991 de Competencia Desleal" },
    { punto: "Venta a pérdida", detalle: "Vender por debajo del coste está limitado salvo excepciones (liquidación, saldos, producto perecedero a punto de caducar...).", referencia: "Art. 14 Ley 7/1996" },
  ],
  email_marketing: [
    { punto: "Consentimiento previo", detalle: "No puedes enviar publicidad por email o SMS a quien no lo haya pedido o autorizado expresamente. Excepción: clientes con relación contractual previa, para productos o servicios similares, siempre que pudieran oponerse al darte el email y en cada envío.", referencia: "Art. 21 LSSI" },
    { punto: "Identificar la publicidad", detalle: "El mensaje debe identificarse claramente como comunicación comercial e indicar quién la envía.", referencia: "Art. 20 LSSI" },
    { punto: "Baja sencilla y gratuita", detalle: "Enlace de baja visible en cada envío; procésala sin pedir explicaciones." },
    { punto: "Prueba del consentimiento", detalle: "Usa casillas no premarcadas y guarda la fecha, el formulario y el texto aceptado. Las sanciones de la AEPD por spam son frecuentes.", referencia: "RGPD" },
    { punto: "WhatsApp", detalle: "Aplican las mismas reglas: necesitas permiso (opt-in) antes de enviar promociones, y WhatsApp Business lo exige en sus políticas." },
  ],
  influencers: [
    { punto: "Identificar la colaboración", detalle: "Toda colaboración pagada o con producto regalado debe indicarse claramente (#publi, «Publicidad» o la etiqueta de colaboración pagada de la red), al principio y visible.", referencia: "Código de conducta sobre influencers de AUTOCONTROL" },
    { punto: "Influencers con mucha audiencia", detalle: "Los «usuarios de especial relevancia» (por ingresos y audiencia) tienen obligaciones de registro y publicidad propias de la ley audiovisual.", referencia: "Ley 13/2022 General de Comunicación Audiovisual y RD 444/2024" },
    { punto: "Contrato por escrito", detalle: "Entregables, fechas, obligación de identificar la publicidad, derechos de uso del contenido (plazo y canales) y si puedes usarlo en anuncios pagados." },
    { punto: "Afirmaciones verificables", detalle: "El influencer no puede atribuir al producto propiedades que no puedas demostrar, sobre todo en salud, cosmética, alimentación o finanzas." },
    { punto: "Sectores regulados", detalle: "Alcohol, juego, criptoactivos, medicamentos y productos sanitarios tienen restricciones adicionales de publicidad." },
  ],
  resenas: [
    { punto: "Reseñas falsas", detalle: "Está prohibido publicar, encargar o comprar reseñas falsas, y también presentarlas de forma engañosa.", referencia: "Ley 3/1991 de Competencia Desleal y TRLGDCU (modificados por el RDL 24/2021)" },
    { punto: "Reseñas en tu web", detalle: "Si las muestras, informa de si compruebas y cómo que proceden de clientes reales." },
    { punto: "Sin incentivos ni filtrado", detalle: "Google prohíbe ofrecer descuentos o regalos a cambio de reseñas y pedirlas solo a los clientes contentos («review gating»)." },
    { punto: "Sin ocultar las negativas", detalle: "No elimines ni escondas solo las reseñas negativas en tu web: es una práctica engañosa." },
    { punto: "Datos personales al responder", detalle: "No reveles datos del cliente. En sanidad, ni siquiera confirmes que es paciente.", referencia: "RGPD" },
  ],
  cookies_web: [
    { punto: "Banner con rechazo fácil", detalle: "Los botones «Aceptar» y «Rechazar» deben estar en el mismo nivel y ser igual de visibles. Seguir navegando no es consentimiento.", referencia: "Guía de cookies de la AEPD (2023) y art. 22.2 LSSI" },
    { punto: "Cookies de analítica y de publicidad", detalle: "Google Analytics, el píxel de Meta, etc. no se cargan hasta que el usuario acepta." },
    { punto: "Textos legales", detalle: "Aviso legal (datos del titular, NIF), política de privacidad y política de cookies, accesibles desde todas las páginas.", referencia: "Art. 10 LSSI" },
    { punto: "Formularios", detalle: "Información básica de protección de datos junto al botón de enviar y casilla para la publicidad separada de la de aceptar la privacidad." },
  ],
};

export function registrarLegal(server: McpServer) {
  server.registerTool(
    "checklist_legal",
    {
      title: "Checklist legal de marketing (España)",
      description:
        "Lista de requisitos legales en España para acciones de marketing habituales en pymes: sorteos en redes, descuentos y rebajas, " +
        "email marketing, colaboraciones con influencers, reseñas y cookies en la web. Incluye las normas de referencia. Es orientativa, no asesoramiento legal.",
      inputSchema: {
        tema: z.enum(["sorteo", "descuentos", "email_marketing", "influencers", "resenas", "cookies_web"]),
      },
      annotations: { readOnlyHint: true },
    },
    async ({ tema }) => respuesta({ tema, puntos: CHECKLISTS[tema], aviso: AVISO_LEGAL }),
  );
}
