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

## Day 3 — 2026-07-17
**Hours worked:** 5

**What I did:** Integrated the OpenAI API into the NestJS backend via `AiModule` and `AiService` using the official `openai` SDK. Implemented `generateSummary()`, utilizing structured prompting with `gpt-4o-mini` (with robust local rule-based fallback if API requests fail or time out) to synthesize technical audit findings into an executive-ready, finance-literate 1-paragraph narrative (`summaryParagraph`). Connected the AI summary generation directly inside `AuditService.analyzeAndSaveAudit()`, ensuring every generated audit automatically persists both relational spend items (`AuditReport` and `items`) and the AI narrative summary to PostgreSQL (`Supabase`). Added comprehensive prompt guidelines and documentation in `PROMPTS.md`.

**What I learned:** Learned how to prompt `gpt-4o-mini` with structured JSON context (current vs. optimized spend, overkill flags, and tool breakdown arrays) while enforcing a concise, authoritative tone suitable for CFO and VP of Engineering evaluations. Also implemented graceful fallbacks so the core rules engine and audit persistence remain 100% functional even during API rate limits or network hiccups.

**Blockers / what I'm stuck on:** None. OpenAI integration and summary generation worked as expected; ready to build the interactive frontend dashboard.

**Plan for tomorrow:** Build the Next.js frontend application (`frontend/`), including interactive spend calculation forms, visual spend comparison charts (`SpendComparisonCharts.tsx`), dynamic audit dashboard views (`dashboard/[slug]`), and public shareable links (`share/[slug]`). Also debug and resolve any backend database connection or environment configuration issues.

## Day 4 — 2026-07-18
**Hours worked:** 7

**What I did:** Built the full Next.js (`frontend/`) application using TypeScript, Tailwind CSS, and Shadcn UI components. Created the interactive multi-step audit form (`AuditForm.tsx`) allowing teams to dynamically add tools, select billing tiers (`Pro`, `Team`, `Business`, `Enterprise`), and adjust seat counts. Implemented the comprehensive audit results dashboard (`dashboard/[slug]`) and read-only executive shareable views (`share/[slug]`). Integrated `recharts` to render visual spend comparison charts (`SpendComparisonCharts.tsx`) illustrating Current vs. Optimized monthly and annual spend across tool categories. Debugged and resolved a critical runtime Prisma connection error (`PrismaClientKnownRequestError: code: 'ECONNREFUSED'`) when invoking `this.prisma.auditReport.create()` by adding `import 'dotenv/config';` at the top of `main.ts` and `prisma.service.ts`, ensuring `process.env.DATABASE_URL` is properly loaded before `pg.Pool` and `PrismaPg` initialize.

**What I learned:** Encountered and solved a subtle gotcha with Prisma v7 (`7.8.0`) and NestJS (`@prisma/adapter-pg`): when `dotenv/config` is only present inside `prisma.config.ts`, Prisma CLI tools (`prisma dev` / `prisma migrate`) work without issue, but when running `nest start --watch`, `process.env.DATABASE_URL` evaluates to `undefined` if environment variables aren't explicitly loaded before `PrismaService` instantiates `new Pool(...)`. When `pg.Pool` receives an `undefined` connection string, it defaults to `localhost:5432`, triggering an `ECONNREFUSED` error. Explicitly importing `dotenv/config` at the application entry point guarantees reliable connection pooling across all environments.

**Blockers / what I'm stuck on:** Ran into database connection and configuration errors while testing out the full end-to-end integration with Prisma and Supabase PostgreSQL. The primary blocker revolved around correctly configuring the Supabase `DATABASE_URL` (pooler connection string required for `@prisma/adapter-pg` runtime queries) versus `DIRECT_URL` (direct connection string used for migrations), as well as ensuring `dotenv/config` loaded before `new Pool(...)` ran to avoid connection refused (`ECONNREFUSED`) errors. After aligning our connection pooling strings and module initialization order, the database layer stabilized.

**Plan for tomorrow:** First, implement the "Send Audit via Email" feature so users receive their calculated audit breakdown and shareable report link directly in their inbox. Simultaneously, perform a comprehensive UI/UX and typography overhaul—the current interface is just an initial stage MVP, so we will upgrade fonts, color palettes, spacing, and interactive transitions to make the web application feel polished, modern, and premium. Once the email delivery and design upgrade are complete, proceed to refactoring, end-to-end testing, and final documentation.
