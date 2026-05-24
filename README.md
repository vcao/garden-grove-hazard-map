# Garden Grove Hazard Map (`gghazard`)

A theoretical visualization of the May 21, 2026 hazardous-materials incident at the GKN Aerospace facility in Garden Grove, CA. Interactive blast radius, shrapnel envelope, toxic plume, and animated wind layer over a satellite base map.

> [!WARNING]
> This site is a **theoretical model** built for general awareness. It is **not** a substitute for authoritative emergency-response modeling. Please review the **Terms of Use**.

---

## Why this project exists

The intent of this project was to better understand the potential risks of the [Garden Grove gas leak incident that occurred on **May 21, 2026**](https://www.latimes.com/california/live/garden-grove-gas-leak-live-evacuation-maps-closures-and-updates), when a 34,000-gallon tank began leaking **methyl methacrylate (MMA)**.

I have family and friends who live in the area, and I wanted to better understand why the evacuation zone was so large. Building it has given me a deeper awareness of the hazardous materials that surround us in everyday industrial neighborhoods.

The visualization was inspired largely by nuclear-blast mapping tools like [NUKEMAP](https://nuclearsecrecy.com/nukemap/).

## About methyl methacrylate (MMA)

MMA is highly flammable and combustible, with a flash point near 50 °F. It is toxic, with potential impacts on human health and the environment, and its vapor is heavier than air — meaning it pools at ground level and drifts toward ignition sources. It is also a primary building block for acrylic plastics (Plexiglas / PMMA), coatings, adhesives, and certain medical and dental materials.

More information about MMA is available from the [U.S. Environmental Protection Agency](https://www.epa.gov/sites/default/files/2016-09/documents/methyl-methacrylate.pdf).

## What the map shows

- **Red pulsing dot** — the leak source at the GKN Aerospace facility.
- **Red circle** — overpressure (1 psi) radius for a hypothetical vapor-cloud explosion, scaled by spill volume (6,000 – 74,000 gallons). 1 psi is the EPA RMP public-hazard endpoint — the radius where windows shatter and the public is no longer safe from the blast wave.
- **Yellow dashed circle** — empirical shrapnel envelope, scaled with the cube root of spill volume.
- **Yellow polygon** — the mandatory evacuation zone, sourced from the [OC Public Works](https://ocpw.maps.arcgis.com/) public ArcGIS feature service.
- **Green plume cone** — Gaussian dispersion approximation, oriented downwind. Rendered as a stacked gradient so the inside reads dark (high concentration) and the tip reads light (dissipated).
- **Animated white particles** — current wind from [Open-Meteo](https://open-meteo.com/) in *Real (now)* mode, or user-set wind in *What-if* mode. Toggleable off.
- **Green dots with labels** — evacuation and reunification centers (Garden Grove Sports and Recreation Center, Cypress Recreation and Community Center, Savannah High School).

## Tech stack

- **Framework:** [Nuxt 4](https://nuxt.com/) (Vue 3, TypeScript, pnpm)
- **UI:** [@nuxt/ui](https://ui4.nuxt.com/) (Tailwind v4)
- **Content:** [@nuxt/content](https://content.nuxt.com/) for news markdown and the MMA primer
- **Map:** [MapLibre GL JS](https://maplibre.org/) with Esri World Imagery satellite tiles
- **Wind data:** [Open-Meteo](https://open-meteo.com/) forecast API (free, no key)
- **Wind animation:** custom Canvas2D particle overlay
- **Deploy:** Cloudflare Pages (static, SSG)

## Local development

```bash
nvm use            # Node 22.13.0
pnpm install
pnpm dev           # http://localhost:3000
```

To build and preview the static output:

```bash
pnpm generate
pnpm preview
```

To deploy:

```bash
wrangler login                              # use your personal Cloudflare account
wrangler pages deploy .output/public
```

## Acknowledgments

This project was built with significant help from artificial intelligence — it was **"vibe-coded"** with Claude. The blast scaling, plume math, polygon sourcing, and component architecture were guided by conversation rather than written from scratch line-by-line.

Polygon data © Orange County Public Works. Satellite tiles © Esri. Wind data via Open-Meteo. The author makes no warranty as to the accuracy or fitness of this visualization for any purpose; see the in-app Terms of Use.
