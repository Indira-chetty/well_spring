# Wellspring

A connected workspace for the fictional Water Care Canada charity: projects, grants, finance, communications, supporter data, governance, and fictional flood and earthquake learning scenarios.

## Run the local demo

**Install Node.js 22.13 or later first.** Reopen your terminal after installing Node.

1. Download this repository: **Code → Download ZIP**, then extract it. Or clone with Git.
2. Open a terminal **inside the extracted folder containing `package.json`**.
3. Run:

```sh
npm run demo
```

The launcher installs missing dependencies on the first run, then prints:

```text
Wellspring local demo: http://127.0.0.1:5173
```

Open that address in your browser. No API key, cloud account, database migration, build or sign-in is required for the local demo. Internet access is needed for the first dependency install. Windows users can also double-click **START-DEMO.bat** from the extracted project folder.

If you already cloned the project, run `git pull` before starting. Stop the server with Ctrl+C.

### If it does not start

- **`node` or `npm` is not recognized:** install Node.js and reopen your terminal.
- **Unsupported Node version:** run `node --version`; use Node 22.13 or later.
- **Cannot find `package.json`:** change into the extracted project folder first. Do not run from inside the ZIP viewer.
- **Port 5173 is in use:** close the previous server and rerun the command.
- **Dependency install failed:** keep the complete terminal error. The launcher prints the install failure instead of hiding it.
- **Old instructions mention Bash, D1 or sign-in:** use `npm run demo` for the simple local version. Those steps are only for the hosted architecture.

Local sample changes persist in `.wellspring-demo/workspace.json`. This directory is ignored by Git. To reset, stop the server, rename that folder, then start again. Local records are separate from the hosted app and shared between browser tabs on that computer. The server binds only to 127.0.0.1; it is not a production deployment or a team authentication system.

## What works

- Projects, evidence verification, tasks and saved activity history
- Funder discovery and an editable grant pipeline
- Rules-based donation matching with explicit approval and reversal
- Editable report templates, review and text export
- Supporter consent checks and impact-response drafts
- Approved-document word search with source attribution
- AI register, sample training quiz, leadership briefings and pilot decisions
- CRM duplicate review, conservative merges, consent-evidence notes and simulated source switching
- Five-year cost estimates, requirements assessments and renewal-decision snapshots
- Separate flood and earthquake learning components

All seeded people, programmes, funders and financial records are fictional. Fit scores are illustrative. CRM field layouts are simulated, not verified vendor API schemas. Costs start unknown and are user-entered assumptions. No email, real CRM or accounting service is connected.

## Optional live Gemini writing

Click **Connect AI**, enter your own Gemini API key privately, and then choose **Communications → Create draft → Gemini AI → Water for learning → Generate draft**.

The key stays in page memory and is forwarded through the local server to Google for each request. It is never written into the saved workspace, browser storage or source. Refresh or disconnect to clear it. Requests use only unchanged fictional sample programme evidence. API model availability, quota, pricing and data use depend on your provider account. Template drafting and all other demos work without a key.

AI outputs require review. Editing a saved approved draft resets approval. Real model responses have not been tested without a user key; provider handling is tested with mocked responses.

## Fictional simulations

**Flood simulation:** choose river-rise or lower-river conditions, run/reset, view illustrative exposure and review possible actions. Includes the ten-year learning concept.

**Earthquake & water:** view the world map highlighting Senegal, start/zoom/reset, inspect fictional water assets and compare predefined pipe-design examples. Tsunami and fire examples are separate from the earthquake scenario.

These are predefined fictional stories, not forecasts, damage assessments, actual alerts, AI recommendations or engineering advice. Exposure does not establish damage. No earthquake occurrence or 2028 probability is estimated. RiverMamba is not run. No message is sent or team dispatched. Engineers and local partners decide designs; no pipe material is universally preferred.

Natural Earth country outlines are bundled at `/simulations/data/natural-earth-countries.geojson`, unchanged from the supplied Kijana-Blueprint-Team.zip. Attribution appears in the map and `public/simulations/ATTRIBUTION.md`. React mounts isolated static demo documents to avoid CSS conflicts; navigation destroys their listeners and scenario state.

## Tests and builds

```sh
npm run test:demo
node --experimental-strip-types tests/domain.mjs
node --experimental-strip-types tests/crm.mjs
node --experimental-strip-types tests/ai.mjs
node tests/flood-demo.test.cjs
node tests/earthquake-demo.test.cjs
npm run demo:build
```

The demo build emits frontend assets to `demo-dist/`; it does not bundle a production data backend. Local startup, persisted writes, concurrency checks, static map serving and origin checks were smoke-tested on Linux. Windows/Mac execution and visual browser/mobile QA remain unverified.

## Hosted architecture (advanced)

The existing hosted application uses React, Vinext and Cloudflare D1 with platform-owned authentication. `npm run dev` and `npm run build` retain that architecture. It requires a configured hosting project, D1 database, schema migration and authentication boundary; it is not a GitHub Pages static site.

The source copy omits the original hosted project identity and credentials. Local demo mode uses file storage instead of D1, reusing the same domain rules. It does not modify the live deployment.
