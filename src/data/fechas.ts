import { domingoDePascua, nEsimoDiaSemana, sumarDias, type Sector } from "../util.js";

export type TipoFecha = "comercial" | "social" | "festivo_nacional" | "festivo_regional";

export interface FechaClave {
  nombre: string;
  fecha: Date;
  tipo: TipoFecha;
  sectores: Sector[] | "todos";
  /** Días antes de la fecha en los que conviene empezar a preparar la campaña. */
  antelacion: number;
  idea: string;
  regiones?: string[];
}

const d = (anio: number, mes: number, dia: number) => new Date(Date.UTC(anio, mes - 1, dia));

/** Fechas clave de marketing en España para un año concreto. */
export function fechasDelAnio(anio: number): FechaClave[] {
  const pascua = domingoDePascua(anio);
  const blackFriday = sumarDias(nEsimoDiaSemana(anio, 11, 4, 4), 1);

  return [
    // --- Festivos nacionales: afectan a horarios, reservas y logística ---
    { nombre: "Año Nuevo", fecha: d(anio, 1, 1), tipo: "festivo_nacional", sectores: "todos", antelacion: 7, idea: "Publica el horario de festivos y un mensaje de buenos deseos con el equipo." },
    { nombre: "Reyes Magos", fecha: d(anio, 1, 6), tipo: "festivo_nacional", sectores: "todos", antelacion: 21, idea: "Última oportunidad de regalo: tarjetas regalo, roscón en hostelería, envío exprés en comercio." },
    { nombre: "Jueves Santo", fecha: sumarDias(pascua, -3), tipo: "festivo_nacional", sectores: "todos", antelacion: 14, idea: "Festivo en casi todas las CCAA (no en Cataluña): avisa de horarios con antelación." },
    { nombre: "Viernes Santo", fecha: sumarDias(pascua, -2), tipo: "festivo_nacional", sectores: "todos", antelacion: 14, idea: "Horario especial de Semana Santa; en hostelería, menú de vigilia o torrijas." },
    { nombre: "Día del Trabajo", fecha: d(anio, 5, 1), tipo: "festivo_nacional", sectores: "todos", antelacion: 7, idea: "Si hay puente, comunica horarios y aprovecha la escapada (hostelería, ocio)." },
    { nombre: "Asunción de la Virgen", fecha: d(anio, 8, 15), tipo: "festivo_nacional", sectores: "todos", antelacion: 7, idea: "Pleno agosto: recuerda si estás abierto o de vacaciones." },
    { nombre: "Fiesta Nacional de España", fecha: d(anio, 10, 12), tipo: "festivo_nacional", sectores: "todos", antelacion: 7, idea: "Puente frecuente: horarios y planes de escapada." },
    { nombre: "Todos los Santos", fecha: d(anio, 11, 1), tipo: "festivo_nacional", sectores: "todos", antelacion: 7, idea: "En hostelería, buñuelos y huesos de santo; en floristerías, pico de demanda." },
    { nombre: "Día de la Constitución", fecha: d(anio, 12, 6), tipo: "festivo_nacional", sectores: "todos", antelacion: 14, idea: "Inicio del puente de diciembre: arranque de las compras de Navidad." },
    { nombre: "Inmaculada Concepción", fecha: d(anio, 12, 8), tipo: "festivo_nacional", sectores: "todos", antelacion: 14, idea: "Cierre del puente: horarios y escaparate navideño ya montado." },
    { nombre: "Navidad", fecha: d(anio, 12, 25), tipo: "festivo_nacional", sectores: "todos", antelacion: 45, idea: "Felicitación con el equipo, horarios de fiestas y tarjetas regalo de última hora." },

    // --- Fechas comerciales ---
    { nombre: "Propósitos de Año Nuevo", fecha: d(anio, 1, 2), tipo: "comercial", sectores: ["fitness", "educacion", "salud", "belleza"], antelacion: 21, idea: "Matrícula sin cuota de alta, bonos de inicio o reto de enero." },
    { nombre: "Rebajas de invierno", fecha: d(anio, 1, 7), tipo: "comercial", sectores: ["comercio", "belleza"], antelacion: 14, idea: "Anuncia la fecha de inicio y muestra el precio anterior real (el más bajo de los últimos 30 días)." },
    { nombre: "Blue Monday", fecha: nEsimoDiaSemana(anio, 1, 1, 3), tipo: "comercial", sectores: ["hosteleria", "belleza", "fitness", "comercio"], antelacion: 7, idea: "Contenido en tono de humor y un pequeño capricho para «el lunes más triste del año»." },
    { nombre: "San Valentín", fecha: d(anio, 2, 14), tipo: "comercial", sectores: ["hosteleria", "belleza", "comercio"], antelacion: 21, idea: "Menú o pack para parejas; también «Galentine» o plan con amigos para no excluir." },
    { nombre: "Martes de Carnaval", fecha: sumarDias(pascua, -47), tipo: "comercial", sectores: ["hosteleria", "comercio", "educacion"], antelacion: 14, idea: "Disfraces del equipo, concurso entre clientes y decoración temática." },
    { nombre: "Día Internacional de la Mujer", fecha: d(anio, 3, 8), tipo: "social", sectores: "todos", antelacion: 7, idea: "Da visibilidad a las mujeres del equipo o a proveedoras locales. Evita descuentos «en rosa»: suelen recibir críticas." },
    { nombre: "Día del Padre", fecha: d(anio, 3, 19), tipo: "comercial", sectores: ["comercio", "hosteleria", "belleza", "fitness"], antelacion: 21, idea: "Guía de regalos, experiencias o tarjeta regalo. En España es el 19 de marzo (San José)." },
    { nombre: "Día Mundial de la Salud", fecha: d(anio, 4, 7), tipo: "social", sectores: ["salud", "fitness"], antelacion: 7, idea: "Contenido educativo con consejos prácticos del equipo profesional." },
    { nombre: "Operación verano", fecha: d(anio, 4, 15), tipo: "comercial", sectores: ["fitness", "belleza", "salud"], antelacion: 14, idea: "Bonos de 8-12 semanas. Evita mensajes que culpabilicen el cuerpo; habla de energía y salud." },
    { nombre: "Inicio de Semana Santa (Domingo de Ramos)", fecha: sumarDias(pascua, -7), tipo: "comercial", sectores: ["hosteleria", "comercio", "inmobiliaria"], antelacion: 21, idea: "Reservas, horarios y planes para quien se queda en la ciudad." },
    { nombre: "Día del Libro (Sant Jordi en Cataluña)", fecha: d(anio, 4, 23), tipo: "comercial", sectores: "todos", antelacion: 14, idea: "Recomienda un libro por persona del equipo; en Cataluña, rosa y libro, el día más fuerte del año para librerías y floristerías." },
    { nombre: "Día de la Madre", fecha: nEsimoDiaSemana(anio, 5, 0, 1), tipo: "comercial", sectores: "todos", antelacion: 21, idea: "En España es el primer domingo de mayo. Packs regalo, reservas para comida familiar y experiencias." },
    { nombre: "Día Mundial del Medio Ambiente", fecha: d(anio, 6, 5), tipo: "social", sectores: "todos", antelacion: 7, idea: "Enseña acciones reales (proveedores locales, menos plástico). Nada de «greenwashing» sin datos." },
    { nombre: "Inicio del verano y terrazas", fecha: d(anio, 6, 21), tipo: "comercial", sectores: ["hosteleria", "comercio", "fitness"], antelacion: 14, idea: "Horario de verano, carta de verano, apertura de terraza." },
    { nombre: "Día del Orgullo LGTBI", fecha: d(anio, 6, 28), tipo: "social", sectores: "todos", antelacion: 7, idea: "Solo si el negocio lo apoya de forma coherente todo el año; si no, mejor no hacer nada." },
    { nombre: "Rebajas de verano", fecha: d(anio, 7, 1), tipo: "comercial", sectores: ["comercio", "belleza"], antelacion: 14, idea: "Anuncia el inicio y prepara el escaparate. Muestra el precio anterior de forma legal." },
    { nombre: "Agosto: vacaciones y horarios", fecha: d(anio, 8, 1), tipo: "comercial", sectores: "todos", antelacion: 14, idea: "Avisa del cierre por vacaciones o del horario de verano en la ficha de Google y en redes." },
    { nombre: "Vuelta a la rutina", fecha: d(anio, 9, 1), tipo: "comercial", sectores: "todos", antelacion: 21, idea: "Vuelta al cole, al gimnasio y a la peluquería: bonos de septiembre y matrícula." },
    { nombre: "Día Mundial de la Salud Mental", fecha: d(anio, 10, 10), tipo: "social", sectores: ["salud", "fitness", "educacion"], antelacion: 7, idea: "Contenido divulgativo y recursos útiles, sin vender nada ese día." },
    { nombre: "Halloween", fecha: d(anio, 10, 31), tipo: "comercial", sectores: ["hosteleria", "comercio", "educacion", "belleza"], antelacion: 21, idea: "Decoración, menú o maquillaje temático y concurso de disfraces." },
    { nombre: "Singles Day (11/11)", fecha: d(anio, 11, 11), tipo: "comercial", sectores: ["comercio"], antelacion: 14, idea: "Oferta de un día, ideal para tienda online." },
    { nombre: "Temporada de cenas de empresa", fecha: d(anio, 12, 1), tipo: "comercial", sectores: ["hosteleria"], antelacion: 45, idea: "Menús de grupo con precio cerrado: empieza a moverlo a mediados de octubre." },
    { nombre: "Black Friday", fecha: blackFriday, tipo: "comercial", sectores: "todos", antelacion: 30, idea: "Lista de espera previa, oferta real (precio más bajo de 30 días) o alternativa «anti Black Friday» con causa." },
    { nombre: "Cyber Monday", fecha: sumarDias(blackFriday, 3), tipo: "comercial", sectores: ["comercio", "servicios", "educacion"], antelacion: 14, idea: "Oferta online y bonos digitales." },
    { nombre: "Sorteo de la Lotería de Navidad", fecha: d(anio, 12, 22), tipo: "social", sectores: "todos", antelacion: 30, idea: "Tradición muy española: el número del negocio, felicitaciones o cobertura del sorteo con humor." },
    { nombre: "Nochevieja", fecha: d(anio, 12, 31), tipo: "comercial", sectores: ["hosteleria", "belleza", "comercio"], antelacion: 30, idea: "Cotillón, cena con reserva previa, peinados y maquillaje de fiesta." },

    // --- Festivos y fiestas regionales (cambian cada año: confirma en el BOE o el boletín autonómico) ---
    { nombre: "Día de Andalucía", fecha: d(anio, 2, 28), tipo: "festivo_regional", sectores: "todos", antelacion: 7, idea: "Orgullo andaluz y horarios.", regiones: ["andalucia"] },
    { nombre: "Día de las Illes Balears", fecha: d(anio, 3, 1), tipo: "festivo_regional", sectores: "todos", antelacion: 7, idea: "Producto local y horarios.", regiones: ["baleares", "illes balears", "islas baleares"] },
    { nombre: "Fallas", fecha: d(anio, 3, 19), tipo: "festivo_regional", sectores: "todos", antelacion: 21, idea: "Del 15 al 19 de marzo: horarios, cortes de calle y producto fallero.", regiones: ["comunidad valenciana", "valencia"] },
    { nombre: "Lunes de Pascua", fecha: sumarDias(pascua, 1), tipo: "festivo_regional", sectores: "todos", antelacion: 14, idea: "Festivo en varias CCAA (según el año): mona de Pascua en Cataluña y Valencia.", regiones: ["cataluna", "comunidad valenciana", "valencia", "baleares", "pais vasco", "euskadi", "navarra", "la rioja"] },
    { nombre: "Día de Aragón (San Jorge)", fecha: d(anio, 4, 23), tipo: "festivo_regional", sectores: "todos", antelacion: 7, idea: "Producto aragonés y horarios.", regiones: ["aragon"] },
    { nombre: "Fiesta de la Comunidad de Madrid", fecha: d(anio, 5, 2), tipo: "festivo_regional", sectores: "todos", antelacion: 7, idea: "Puente de mayo madrileño: horarios y planes en la ciudad.", regiones: ["madrid", "comunidad de madrid"] },
    { nombre: "Día de Canarias", fecha: d(anio, 5, 30), tipo: "festivo_regional", sectores: "todos", antelacion: 7, idea: "Gastronomía y tradiciones canarias.", regiones: ["canarias"] },
    { nombre: "Día de la Región de Murcia", fecha: d(anio, 6, 9), tipo: "festivo_regional", sectores: "todos", antelacion: 7, idea: "Producto murciano y horarios.", regiones: ["murcia", "region de murcia"] },
    { nombre: "San Juan", fecha: d(anio, 6, 24), tipo: "festivo_regional", sectores: "todos", antelacion: 14, idea: "La verbena es la noche del 23: coca, hogueras y horarios.", regiones: ["cataluna", "comunidad valenciana", "valencia", "galicia"] },
    { nombre: "San Fermín", fecha: d(anio, 7, 7), tipo: "festivo_regional", sectores: "todos", antelacion: 21, idea: "Del 6 al 14 de julio en Pamplona: máxima afluencia en hostelería.", regiones: ["navarra"] },
    { nombre: "Día de Galicia", fecha: d(anio, 7, 25), tipo: "festivo_regional", sectores: "todos", antelacion: 7, idea: "Producto gallego y Camino de Santiago.", regiones: ["galicia"] },
    { nombre: "Diada de Cataluña", fecha: d(anio, 9, 11), tipo: "festivo_regional", sectores: "todos", antelacion: 7, idea: "Horarios. Tema político: mejor ser prudente en el tono.", regiones: ["cataluna"] },
    { nombre: "Día de la Comunitat Valenciana", fecha: d(anio, 10, 9), tipo: "festivo_regional", sectores: "todos", antelacion: 7, idea: "Producto valenciano y horarios.", regiones: ["comunidad valenciana", "valencia"] },
  ];
}
