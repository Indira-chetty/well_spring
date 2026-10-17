# Wellspring

A private, connected charity workspace built with React, Vinext and Cloudflare D1.

## What works
- Persistent project records, evidence verification and tasks
- Funder discovery and editable grant pipeline
- Suggested donation matches with explicit approvals and reversal
- Editable report templates, draft review and text export
- Supporter consent checks and impact-reply drafts
- Approved-document search with source attribution
- AI register, baseline training quiz, leadership briefings, pilot decisions and activity history
- Account-scoped records with optimistic concurrency checks

All seeded records are fictional. Drafts use templates, knowledge search uses word matching, and fit scores are illustrative. No external LLM, CRM, email or accounting integration is configured. French outputs are explicit translation worksheets, not automatic translations. Tool-register entries document proposed operational governance; the current template service makes no model calls. Workspace-owner authorization covers the current private account; fictional department owners are not login identities.

## Development
Use Node >=22.13. Install with the Sites installer, then `npm run dev`. Hosted requests use dispatch authentication headers. Database schema is in `db/schema.ts`; schema-only migrations are in `drizzle/`. Initial fictional records are inserted on first authenticated access, never in schema migrations.

## Validation
`node --experimental-strip-types tests/domain.mjs`
`node node_modules/typescript/bin/tsc --noEmit`
`npm run build`

Approve only saved draft versions. Updating project evidence resets related approvals. No match is automatically approved. All record changes are saved to the authenticated owner's workspace and recorded in its activity log.

## Live Gemini demo
Use Connect Gemini AI in the sidebar or top bar. A session-only key is held in React memory and forwarded to Gemini through the authenticated server endpoint; it is never stored in localStorage, database or source. Refreshing clears it. Live requests support report drafting and Canadian French adaptations using unchanged fictional seeded programme evidence. Other features retain their documented rule/template behavior. The provider can process submitted facts under the account's terms. API errors are surfaced explicitly, without silently substituting templates. Model/key access and free quota depend on the user's Gemini account.

`node --experimental-strip-types tests/ai.mjs` validates provider behavior with mocked responses. An actual model call requires a user-supplied API key and has not been verified during development.

## CRM and data-quality demo
The CRM & data workspace adds consent-evidence reviews, conservative duplicate merge approval, four simulated source adapters (SupporterHub, CiviCRM, Odoo, SuiteCRM), round-trip data-mapping tests, JSON export, editable five-year cost inputs, requirements assessments and renewal decisions with evidence snapshots. Vendor field shapes are illustrative, not verified live API schemas. No CRM is connected. Costs and ratings begin unknown and are user-entered assumptions. Existing financial records are preserved when sources change or supporter records merge.

`node --experimental-strip-types tests/crm.mjs`

The blue-and-white styles and updated wording apply across the existing application. The separate Kijana flood and Senegal infrastructure simulations require the user-provided ZIP and are not included until that source is available.

## Flood and earthquake components
Two separate navigation entries embed isolated, same-origin static documents adapted from Kijana-Blueprint-Team.zip. React owns the iframe lifecycle; navigating away destroys the demo document and its listeners. `SimulationWorkspace` validates the source and origin of resize messages and removes its parent listener on unmount. Isolated documents avoid stylesheet collisions and duplicate IDs in the host application. Restart remounts a fresh scenario. No API, model, backend or paid service was added for these demos.

- Flood: switch river-rise/lower-river scenarios, run, reset, inspect illustrative exposure, review example actions and read the ten-year learning concept.
- Earthquake: load local Natural Earth boundaries, highlight Senegal, start/zoom, reset, review separate earthquake/tsunami/fire inspection examples and compare predefined specialist design options.
- Added a visible fictional pipeline to both maps.
- Natural Earth GeoJSON is unchanged at `/simulations/data/natural-earth-countries.geojson`; source attribution is displayed in the map and `public/simulations/ATTRIBUTION.md`.
- All events and assets are fictional. No exact earthquake or 2028 probability is predicted. No live forecast, damage assessment, alert, AI recommendation or dispatch occurs. Exposure is not confirmed damage. RiverMamba is not run. Engineers and local partners decide pipe designs.

Tests: `node tests/flood-demo.test.cjs` and `node tests/earthquake-demo.test.cjs`. These adapt the original VM-based interaction harnesses; they cover switching, reset, map loading/zoom and all three pipe-review examples. They do not replace real-browser verification. Mobile CSS and iframe lifecycle have been inspected, but visual browser QA was unavailable in this environment.

## GitHub source copy
This source export omits the original hosted Site identity and all runtime credentials. The existing private deployment is https://wellspring-workspace.chettybindira.chatgpt.site. To create another deployment, configure a new hosting project and D1 database, apply the checked-in migration, and supply the runtime authentication boundary. This is a Vinext / Cloudflare Worker application, not a GitHub Pages static site.

Local setup: Node 22.13 or later, enable Corepack and run `corepack pnpm install --frozen-lockfile`, then `npm run dev`. See the local D1 migration notes below for saved records.

### Local database and sign-in
After installing dependencies, run `npm run build` once, then apply the local schema:

```sh
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_rapid_magma.sql
npm run dev
```

On the local URL printed by the development server, visit `/signin-with-chatgpt?return_to=/` to use the starter's loopback-only test identity. This local identity is not included in production. Hosted access must use the platform's authentication boundary. Local and hosted database contents are separate.
