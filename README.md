# Escaparate MCP 🪟

**Marketing para pymes españolas dentro de Claude.** Un servidor MCP y una skill que convierten a Claude en el responsable de marketing de un bar, una peluquería, una tienda o una clínica. Conoce el calendario comercial español, el idioma de aquí y la normativa que afecta a las promociones.

> «Hazme el plan de Instagram de diciembre para mi peluquería de Málaga y responde estas 5 reseñas.» Hecho en 2 minutos.

## Herramientas

| Herramienta | Qué hace |
|---|---|
| `calendario_marketing` | Fechas clave de España por sector y comunidad autónoma, con la fecha en que empezar a preparar cada campaña. Calcula las fechas móviles (Semana Santa, Día de la Madre, Black Friday). |
| `plan_contenidos` | Calendario editorial semana a semana: fecha, hora (horarios españoles), canal, formato, pilar e idea concreta por sector. |
| `revisar_post` | Revisa un texto antes de publicarlo: límites, «ver más», hashtags, llamada a la acción, enlaces o teléfonos prohibidos y expresiones que suenan latinoamericanas. |
| `hashtags_locales` | Mezcla recomendada de hashtags de ciudad, barrio, nicho y marca. |
| `guia_resena` | Analiza una reseña de Google: tipo, temas, riesgos legales o sanitarios, estructura, plantilla y lo que no hay que hacer (incluido el sector salud). |
| `auditoria_ficha_google` | Puntúa la ficha de Google Business de 0 a 100 y ordena las acciones por impacto. |
| `checklist_legal` | Sorteos, rebajas, email marketing, influencers, reseñas y cookies, con referencias a la normativa española (LSSI, RGPD, Ley 7/1996, Directiva Ómnibus...). |

Más la skill [`marketing-pymes-es`](skill/marketing-pymes-es/SKILL.md), que le dice a Claude cuándo usar cada herramienta y cómo escribir en español de España.

## Instalación

```bash
npm install
npm run build
```

**Claude Code**

```bash
claude mcp add escaparate -- node /ruta/a/escaparate-mcp/dist/index.js
```

**Claude Desktop**: añádelo a `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "escaparate": { "command": "node", "args": ["/ruta/a/escaparate-mcp/dist/index.js"] }
  }
}
```

**Skill**: copia `skill/marketing-pymes-es` en `~/.claude/skills/` (o súbela como skill en claude.ai).

## Prueba

```bash
npm run prueba
```

Arranca el servidor, llama a todas las herramientas y comprueba los casos clave (fechas móviles, festivos regionales, detección de riesgos en reseñas...).

## Modelo de negocio

El núcleo es y seguirá siendo **gratis y de código abierto (MIT)**: atrae usuarios, estrellas y confianza. El dinero está en la versión alojada, que se conecta a las cuentas reales del negocio:

| Plan | Precio | Incluye |
|---|---|---|
| **Gratis** | 0 € | Este repositorio: todas las herramientas en local. |
| **Pro** | 29 €/mes | MCP remoto (sin instalar nada) + conexión con Google Business Profile: leer reseñas reales, publicar respuestas y novedades, informe mensual. |
| **Agencia** | 79 €/mes | Hasta 10 negocios, informes con su marca y plantillas compartidas. |

## Hoja de ruta

- [ ] MCP remoto (HTTP) con autenticación y facturación con Stripe.
- [ ] Integración con la API de Google Business Profile (reseñas y publicaciones).
- [ ] Publicación programada en Instagram y Facebook (Meta Graph API).
- [ ] Festivos locales por municipio.
- [ ] Versión para México y Latinoamérica (vocabulario, fechas y normativa propios).

## Aviso

Las checklists legales son orientativas y no constituyen asesoramiento legal ni fiscal. Los festivos regionales cambian cada año: confírmalos en el boletín oficial.

## Licencia

MIT
