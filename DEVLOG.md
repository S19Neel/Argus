## Day 1 — 2026-07-15
**Hours worked:** 4.5

**What I did:** Analyzed and broke down the full 7-day assessment requirements stepwise into modular technical milestones. Scoped out the core MVP architecture for the AI Spend Audit web application (`Argus`). Conducted comprehensive web research across 10 major AI tool providers (`Cursor`, `Claude`, `ChatGPT`, `GitHub Copilot`, `OpenAI API`, `Anthropic API`, `Gemini`, `Windsurf`, `v0`) to collect verified, up-to-date pricing data and billing tier structures (monthly vs. annual, seat minimums, credit overages) and documented everything cleanly in `PRICING_DATA.md`. Scaffolding basic project architecture and repository structure.

**What I learned:** Learned that most AI coding tools (`Cursor`, `Windsurf`, `v0`) are usage-credit based on top of base plan fees, and teams often overpay significantly by putting small teams (`<= 2 seats`) onto `Team` or `Business` tiers (`$40+/user/mo`) when `Pro` tiers (`$20/mo`) offer identical coding models and model limits without administrative overhead. Also noted the ~20% annual billing discount across major IDE tools.

**Blockers / what I'm stuck on:** None. Scoping and pricing data verification went smoothly; ready to build the backend calculation rules engine.

**Plan for tomorrow:** Scaffold the NestJS backend, implement the core defensible audit evaluation rules engine across all 4 pillars, define strict DTO validation (`class-validator`), write automated unit tests (`Jest`), and integrate Prisma with PostgreSQL (`Supabase`) for audit report and lead capture persistence.

## Day 2 — 2026-07-16
**Hours worked:** 6

**What I did:** Built the NestJS backend `AuditModule`, `AuditService`, and `AuditController` strictly using Nest CLI (`nest g ...`). Implements strict, finance-literate DTOs (`AuditInputDto`, `ToolItemInputDto`, `AuditResultDto`, `CaptureLeadDto`) using `class-validator` and `class-transformer`. Engineered the core defensible rules engine (`audit-rules.ts`) covering 4 distinct pillars (seat/tier overkill, annual billing & plan downgrades, cheaper alternative tools for specific use cases like research/writing, and retail-to-API/credit transitions for data workloads) driven dynamically by `pricing.constants.ts`. Scaffolding and connected Prisma v7 (`7.8.0`) with `@prisma/adapter-pg` and PostgreSQL (`Supabase`), defining Option A relational tables (`Lead`, `AuditReport`, `AuditItem`) with `snake_case` mappings. Implemented automatic audit persistence (`analyzeAndSaveAudit`), public shareable URL slug retrieval stripping private lead data (`getAuditBySlug`), and lead capture linking (`captureLeadForAudit`). Configured a custom Jest ESM/CommonJS transformer.

**What I learned:** Deeply explored Prisma v7 (`7.8.0`) breaking architectural shifts: `schema.prisma` now decouples `datasource.url` into `prisma.config.ts`, and initializing `PrismaClient` in Node ESM vs CommonJS requires `@prisma/adapter-pg` (`pg` Pool) along with a custom Jest transformer (`import.meta.url` replacement) and `moduleNameMapper` (`.js` to `.ts` resolution) to run unit tests seamlessly across environments. Also validated that atomic relational inserts (`AuditReport` + `items.create`) provide significantly better querying capability for future benchmark analytics than JSONB blobs.

**Blockers / what I'm stuck on:** None really, just getting along with the business logic and testing it out. Trying to improve some business logic to make it more optimized.

**Plan for tomorrow:** Integrate OpenAI API (or any better free tier API like Gemini's or Anthropic's) to generate personalized, executive-ready 1-paragraph summary insights for each audit (`summaryParagraph` field), and begin frontend (`Next.js`) layout implementation with interactive spend inputs and dynamic charts.
