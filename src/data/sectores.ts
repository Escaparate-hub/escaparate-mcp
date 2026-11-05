import type { Sector } from "../util.js";

export const PILARES = ["educar", "comunidad", "detras_de_escenas", "prueba_social", "promocion"] as const;
export type Pilar = (typeof PILARES)[number];

interface DatosSector {
  /** Palabra para hashtags combinados con la ciudad (#peluqueriamadrid). */
  palabra: string;
  hashtags: string[];
  ideas: Record<Pilar, string[]>;
}

export const SECTORES_DATOS: Record<Sector, DatosSector> = {
  hosteleria: {
    palabra: "restaurante",
    hashtags: ["gastronomia", "comerbien", "dondecomer", "tapeo", "brunch", "menudeldia"],
    ideas: {
      educar: ["Cómo se hace nuestro plato estrella, paso a paso", "Maridaje: qué vino pedir con cada plato", "De dónde vienen nuestros productos (proveedor local)"],
      comunidad: ["Encuesta: ¿qué plato volvemos a poner en carta?", "Presenta a un cliente habitual (con su permiso)", "Recomendaciones del barrio: otros negocios que nos gustan"],
      detras_de_escenas: ["Preparación de la mañana en cocina", "Un día con el equipo de sala", "Llegada del género fresco del mercado"],
      prueba_social: ["Reseña de Google destacada con foto del plato", "Vídeo de reacción de clientes (con permiso)", "Menciones en prensa o guías locales"],
      promocion: ["Menú del día de la semana", "Plato fuera de carta solo este fin de semana", "Reserva para grupos con precio cerrado"],
    },
  },
  belleza: {
    palabra: "peluqueria",
    hashtags: ["belleza", "peluqueria", "estetica", "unas", "cuidadodelapiel", "cortedepelo"],
    ideas: {
      educar: ["3 errores al lavarte el pelo en casa", "Qué tratamiento elegir según tu tipo de piel", "Cómo mantener el color más tiempo"],
      comunidad: ["Antes y después elegido por votación", "Pregunta: ¿qué tendencia quieres probar?", "Conoce al equipo: especialidad de cada profesional"],
      detras_de_escenas: ["Proceso completo de un cambio de look", "Cómo desinfectamos el material", "Llegada de productos nuevos"],
      prueba_social: ["Reseña real con el resultado", "Testimonio en vídeo de una clienta fiel", "Antes/después con permiso firmado"],
      promocion: ["Huecos libres esta semana", "Bono de 5 sesiones", "Tratamiento del mes con precio especial"],
    },
  },
  comercio: {
    palabra: "tienda",
    hashtags: ["comerciolocal", "compralocal", "tiendasconencanto", "hechoenespana", "novedades", "ideasregalo"],
    ideas: {
      educar: ["Cómo elegir la talla o el modelo correcto", "Guía de cuidado del producto", "Comparativa: cuál te conviene más"],
      comunidad: ["Pregunta: ¿qué producto quieres que traigamos?", "Clientes que ya lo usan (contenido compartido)", "Colaboración con otro comercio del barrio"],
      detras_de_escenas: ["Unboxing de la nueva colección", "Cómo montamos el escaparate", "Empaquetado de pedidos online"],
      prueba_social: ["Reseña destacada con foto del producto", "Lo más vendido del mes", "Clientes que repiten"],
      promocion: ["Novedad recién llegada (pocas unidades)", "Envío gratis este fin de semana", "Pack regalo listo para llevar"],
    },
  },
  salud: {
    palabra: "clinica",
    hashtags: ["salud", "fisioterapia", "bienestar", "prevencion", "clinica", "cuidatusalud"],
    ideas: {
      educar: ["Mito o realidad sobre un problema frecuente", "Ejercicio sencillo para hacer en casa", "Cuándo conviene acudir a un profesional"],
      comunidad: ["Responde preguntas frecuentes de pacientes (sin datos personales)", "Presenta a cada profesional y su especialidad", "Consejos de temporada (alergias, calor, vuelta al cole)"],
      detras_de_escenas: ["Cómo es una primera visita", "Equipamiento y para qué sirve", "Formación reciente del equipo"],
      prueba_social: ["Reseña de Google (nunca confirmes que alguien es paciente al responder)", "Años de experiencia y certificaciones", "Colaboraciones con clubes o empresas"],
      promocion: ["Primera valoración", "Horario ampliado o nuevas citas disponibles", "Nuevo servicio en la clínica"],
    },
  },
  fitness: {
    palabra: "gimnasio",
    hashtags: ["fitness", "entrenamiento", "gimnasio", "vidasana", "entrenadorpersonal", "deporte"],
    ideas: {
      educar: ["Técnica correcta de un ejercicio básico", "Qué comer antes de entrenar", "Rutina de 15 minutos para días sin tiempo"],
      comunidad: ["Socio del mes y su progreso", "Reto semanal con premio simbólico", "Encuesta: ¿qué clase añadimos?"],
      detras_de_escenas: ["Cómo preparamos una clase", "Entrenamiento del equipo", "Nuevas máquinas o material"],
      prueba_social: ["Historia de progreso (con permiso)", "Reseña destacada", "Ocupación de las clases: plazas que vuelan"],
      promocion: ["Clase de prueba gratis", "Matrícula sin cuota de alta", "Plan para traer a un amigo"],
    },
  },
  inmobiliaria: {
    palabra: "inmobiliaria",
    hashtags: ["inmobiliaria", "pisosenventa", "alquiler", "vivienda", "hogar", "invertir"],
    ideas: {
      educar: ["Gastos de comprar una vivienda explicados", "Cómo preparar tu piso para venderlo antes", "Documentos necesarios para alquilar"],
      comunidad: ["Guía del barrio: colegios, transporte, ocio", "Comercios locales recomendados", "Datos de precio por m² de la zona"],
      detras_de_escenas: ["Cómo hacemos las fotos de un inmueble", "Un día de visitas", "Firma en notaría (con permiso)"],
      prueba_social: ["Vendido en X días", "Reseña de un propietario", "Familias que ya tienen las llaves"],
      promocion: ["Inmueble destacado de la semana", "Valoración gratuita de tu vivienda", "Novedad en exclusiva"],
    },
  },
  servicios: {
    palabra: "servicios",
    hashtags: ["autonomos", "pymes", "emprendedores", "negociolocal", "profesionales", "asesoria"],
    ideas: {
      educar: ["Error frecuente que vemos en clientes y cómo evitarlo", "Checklist práctico descargable", "Explicación sencilla de un cambio normativo"],
      comunidad: ["Pregunta abierta sobre un problema del sector", "Recomienda a otros profesionales con los que colaboras", "Responde dudas de seguidores"],
      detras_de_escenas: ["Cómo trabajamos un proyecto de principio a fin", "Herramientas que usamos", "El equipo y sus funciones"],
      prueba_social: ["Caso de éxito con datos", "Testimonio de cliente", "Antes/después de un proyecto"],
      promocion: ["Primera consulta", "Plazas para nuevos clientes este mes", "Nuevo servicio"],
    },
  },
  educacion: {
    palabra: "academia",
    hashtags: ["formacion", "academia", "idiomas", "clasesparticulares", "aprender", "estudiar"],
    ideas: {
      educar: ["Truco rápido para aprender X", "Error típico de alumnos y cómo corregirlo", "Recursos gratuitos recomendados"],
      comunidad: ["Alumno destacado del mes", "Reto semanal de aprendizaje", "Pregunta: ¿qué te cuesta más?"],
      detras_de_escenas: ["Cómo preparamos el material", "Una clase por dentro", "El equipo docente"],
      prueba_social: ["Resultados de exámenes oficiales", "Testimonio de familia o alumno", "Años formando a la ciudad"],
      promocion: ["Clase de prueba", "Matrícula abierta para el trimestre", "Curso intensivo de verano"],
    },
  },
  general: {
    palabra: "negocio",
    hashtags: ["negociolocal", "comerciolocal", "pymes", "hechoaqui", "emprender", "apoyalocal"],
    ideas: {
      educar: ["Consejo práctico relacionado con tu producto o servicio", "Preguntas frecuentes respondidas", "Cómo sacar más partido a lo que compras"],
      comunidad: ["Encuesta para conocer a tus clientes", "Historia de un cliente habitual", "Otros negocios del barrio que recomiendas"],
      detras_de_escenas: ["Un día en el negocio", "Presentación del equipo", "Cómo empezó todo"],
      prueba_social: ["Reseña destacada", "Cifras: clientes atendidos, años abiertos", "Fotos compartidas por clientes"],
      promocion: ["Novedad de la semana", "Oferta por tiempo limitado", "Recordatorio para reservar o pedir"],
    },
  },
};
