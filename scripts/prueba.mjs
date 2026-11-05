// Prueba de humo: arranca el servidor por stdio, lista las herramientas y llama a cada una.
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const client = new Client({ name: "prueba", version: "0.0.0" });
await client.connect(new StdioClientTransport({ command: process.execPath, args: ["dist/index.js"] }));

const { tools } = await client.listTools();
console.log("Herramientas:", tools.map((t) => t.name).join(", "));
assert.equal(tools.length, 7);

async function llamar(name, args) {
  const r = await client.callTool({ name, arguments: args });
  assert.ok(!r.isError, `${name} devolvió error: ${r.content?.[0]?.text}`);
  return JSON.parse(r.content[0].text);
}

const cal = await llamar("calendario_marketing", { desde: "2027-03-01", meses: 3, sector: "hosteleria", comunidad_autonoma: "Cataluña" });
const nombres = cal.fechas.map((f) => `${f.fecha} ${f.nombre}`);
assert.ok(nombres.includes("2027-03-26 Viernes Santo"), "Pascua 2027 es el 28 de marzo");
assert.ok(nombres.includes("2027-05-02 Día de la Madre"), "primer domingo de mayo de 2027");
assert.ok(nombres.includes("2027-03-29 Lunes de Pascua"), "festivo regional en Cataluña");
assert.ok(!nombres.some((n) => n.includes("Comunidad de Madrid")), "no mezcla regiones");
console.log(`calendario_marketing: ${cal.total} fechas, p. ej. ${nombres.slice(0, 3).join(" | ")}`);

const bf = await llamar("calendario_marketing", { desde: "2026-11-01", meses: 1, sector: "comercio" });
assert.ok(bf.fechas.some((f) => f.fecha === "2026-11-27" && f.nombre === "Black Friday"));

const plan = await llamar("plan_contenidos", { sector: "belleza", canales: ["instagram", "google_business"], publicaciones_por_semana: 3, semanas: 4, desde: "2027-02-01" });
assert.equal(plan.publicaciones.length, 12);
assert.equal(plan.periodo.desde, "2027-02-01");
assert.ok(plan.publicaciones.some((p) => p.idea.startsWith("San Valentín")), "integra San Valentín");
console.log("plan_contenidos:", plan.publicaciones.slice(0, 3).map((p) => `${p.fecha} ${p.hora} ${p.canal}/${p.formato}: ${p.idea}`));

const post = await llamar("revisar_post", { texto: "¡NUEVO SERVICIO INCREÍBLE! Escríbenos desde tu celular a www.ejemplo.es y ustedes tendrán su cita.", plataforma: "instagram" });
assert.equal(post.listo_para_publicar, false);
assert.deepEqual(post.variantes.map((v) => v.palabra), ["celular", "ustedes"]);
const papas = await llamar("revisar_post", { texto: "Plan con tus papás este finde. Reserva ya.", plataforma: "facebook" });
assert.equal(papas.variantes.length, 0, "no confunde palabras con tilde");
console.log("revisar_post:", post.avisos, post.variantes);

const tags = await llamar("hashtags_locales", { ciudad: "Málaga", sector: "belleza", actividad: "uñas", barrio: "El Soho", nombre_negocio: "Nails Ana" });
assert.ok(tags.local.includes("#unasmalaga"));
console.log("hashtags_locales:", tags.mezcla_recomendada);

const neg = await llamar("guia_resena", { estrellas: 1, texto: "Me pusieron gluten siendo celíaca, pienso ir a la OCU. Encima caro.", nombre_negocio: "Bar Pepe", sector: "hosteleria" });
assert.equal(neg.tipo, "negativa");
assert.ok(neg.alertas[0].includes("gluten") && neg.alertas[0].includes("ocu"));
assert.ok(neg.temas.includes("precio"));
const pos = await llamar("guia_resena", { estrellas: 5, texto: "Espero volver pronto, me ocurrió algo genial con el trato", nombre_negocio: "Bar Pepe" });
assert.equal(pos.tipo, "positiva", "«espero» no cuenta como «pero»");
assert.equal(pos.alertas.length, 0, "«ocurrió» no es la OCU");
console.log("guia_resena:", neg.tipo, neg.temas, "|", pos.plantilla);

const aud = await llamar("auditoria_ficha_google", { categoria_principal_correcta: true, fotos_totales: 12, numero_resenas: 40, valoracion_media: 4.4, porcentaje_resenas_respondidas: 20 });
assert.ok(aud.puntuacion > 0 && aud.puntuacion < 100);
console.log("auditoria_ficha_google:", aud.puntuacion, aud.nivel, aud.acciones_prioritarias[0]);

const legal = await llamar("checklist_legal", { tema: "sorteo" });
assert.ok(legal.puntos.length >= 5);
console.log("checklist_legal:", legal.puntos.map((p) => p.punto).join(" · "));

await client.close();
console.log("\nTodas las pruebas han pasado ✔");
