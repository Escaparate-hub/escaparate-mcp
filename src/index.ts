#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { registrarAuditoria } from "./tools/auditoria.js";
import { registrarCalendario } from "./tools/calendario.js";
import { registrarLegal } from "./tools/legal.js";
import { registrarPlan } from "./tools/plan.js";
import { registrarRedes } from "./tools/redes.js";
import { registrarResenas } from "./tools/resenas.js";

const server = new McpServer(
  { name: "escaparate", version: "0.1.0" },
  {
    instructions:
      "Herramientas de marketing para pymes en España. Escribe siempre en español de España (móvil, ordenador, coche, vosotros). " +
      "Usa las herramientas para obtener datos y estructura, y redacta tú el texto final adaptado al negocio.",
  },
);

registrarCalendario(server);
registrarPlan(server);
registrarRedes(server);
registrarResenas(server);
registrarAuditoria(server);
registrarLegal(server);

await server.connect(new StdioServerTransport());
