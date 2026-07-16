# Pricing Data for AI Tools
> Verified via web search on 2026-07-15.

---

## Cursor ([https://cursor.com/pricing](https://cursor.com/pricing))

### Monthly rates
- Hobby (Free) - $0/month
- Pro - $20/month
- Pro+ - $60/month
- Ultra - $200/month
- Teams Standard - $40/user/month
- Teams Premium - $120/user/month
- Enterprise - Custom pricing

### Yearly rates (annual billing, ~20% discount)
- Hobby (Free) - $0/month
- Pro - ~$16/month (billed annually)
- Pro+ - ~$48/month (billed annually)
- Ultra - ~$160/month (billed annually)
- Teams Standard - ~$32/user/month (billed annually)
- Teams Premium - ~$96/user/month (billed annually)
- Enterprise - Custom pricing

*Note: Cursor is usage-credit based on top of the plan fee — the monthly price includes a pool of model-usage credits (e.g. $20 of credits on Pro), and heavy usage can trigger on-demand overage billing at API rates.*

---

## Claude / Claude Code ([https://claude.com/pricing](https://claude.com/pricing))

### Monthly rates
- Free - $0/month
- Pro - $20/month
- Max 5x - $100/month
- Max 20x - $200/month
- Team Standard - $25/seat/month
- Team Premium - $125/seat/month
- Enterprise - Custom (seat + usage based, starts ~$20/seat + usage)

### Yearly rates (annual billing)
- Free - $0/month
- Pro - $17/month (billed annually, i.e. $200/year)
- Max 5x / Max 20x - Monthly only, no annual option currently offered
- Team Standard - ~$20/seat/month (billed annually)
- Team Premium - ~$100/seat/month (billed annually)
- Enterprise - Custom, annual contracts only

*Note: Claude Code (the CLI/agent) is not sold as a separate product — it's included in Pro, Max, Team, and Enterprise plans, drawing from the same usage pool as chat. Anthropic does not publish exact message/token counts per tier; limits are described as a rolling 5-hour + weekly usage budget.*

---

## Windsurf ([https://windsurf.com/pricing](https://windsurf.com/pricing))

### Monthly rates
- Free - $0/month
- Pro - $20/month
- Max - $200/month
- Teams - $40/user/month
- Enterprise - Custom (~$60/user/month reported)

### Yearly rates (annual billing, ~17-20% discount)
- Free - $0/month
- Pro - ~$16-17/month (billed annually)
- Max - ~$166-170/month (billed annually)
- Teams - ~$32-33/user/month (billed annually)
- Enterprise - Custom pricing

*Note: Windsurf overhauled pricing on March 19, 2026 — moved from a monthly credit pool to daily/weekly refreshing usage quotas, and Pro increased from its earlier $15/month price point to $20/month for new subscribers (existing subscribers were grandfathered at $15).*

---

## GitHub Copilot ([https://github.com/features/copilot/plans](https://github.com/features/copilot/plans))

### Monthly rates
- Free - $0/month
- Pro - $10/month
- Pro+ - $39/month
- Max - $100/month
- Business - $19/user/month
- Enterprise - $39/user/month

### Yearly rates (annual billing)
- Free - $0/month
- Pro - $100/year (~$8.33/month)
- Pro+ - $390/year (~$32.50/month)
- Max - No published annual option
- Business - $19/user/month (no discount currently published for annual)
- Enterprise - $39/user/month (no discount currently published for annual)

*Note: As of June 1, 2026, all Copilot plans moved to usage-based "GitHub AI Credits" billing on top of the flat seat price — e.g. Pro's $10/month includes $10 of monthly AI Credits, consumed based on token usage of the model you select. Also note: as of April 22, 2026, new self-serve Business sign-ups for orgs on GitHub Free/Team plans are temporarily paused.*

---

## ChatGPT ([https://chatgpt.com/pricing](https://chatgpt.com/pricing), [https://openai.com/business/chatgpt-pricing/](https://openai.com/business/chatgpt-pricing/))

### Monthly rates
- Free - $0/month
- Go - $8/month
- Plus - $20/month
- Pro (lower tier) - $100/month
- Pro (higher tier) - $200/month
- Business - $25/user/month (2-seat minimum)
- Enterprise - Custom (~$45-75/user/month reported, 150-seat minimum, annual only)

### Yearly rates (annual billing)
- Free - $0/month
- Go - No published annual option
- Plus - No published annual option (monthly only)
- Pro - No published annual option (monthly only)
- Business - $20/user/month (billed annually)
- Enterprise - Custom, annual contract required (no month-to-month option)

*Note: Two separate "Pro" price points exist — $100/month (launched April 9, 2026, ~5x Plus limits) and $200/month (original tier, ~20x Plus limits) — both give access to the same top-end models, differing only in usage volume.*

---

## OpenAI API direct ([https://developers.openai.com/api/docs/pricing](https://developers.openai.com/api/docs/pricing))

### Per-million-token rates (input / output) — no monthly/yearly subscription, pay-as-you-go
- GPT-5.6 Sol (flagship) - $5.00 / $30.00 per 1M tokens
- GPT-5.6 Terra (balanced) - $2.50 / $15.00 per 1M tokens
- GPT-5.6 Luna (budget) - $1.00 / $6.00 per 1M tokens
- GPT-5.4 - $2.50 / $15.00 per 1M tokens
- GPT-5.4 mini - $0.75 / $4.00 per 1M tokens
- GPT-5.4 nano - $0.20 / $1.25 per 1M tokens
- GPT-4.1 - $2.00 / $8.00 per 1M tokens
- GPT-4.1 mini - $0.40 / $1.60 per 1M tokens
- GPT-4.1 nano - $0.10 / $0.40 per 1M tokens

*Note: Batch API gives a flat 50% discount on the above rates for asynchronous jobs. Cached input tokens are billed at ~10% of the standard input rate. There is no subscription tier for API access — cost scales purely with token usage, and "monthly/yearly" doesn't apply in the traditional sense. For your audit engine, model this as $/month = (estimated monthly input tokens × input rate) + (estimated monthly output tokens × output rate).*

---

## Anthropic API direct ([https://claude.com/pricing](https://claude.com/pricing) — API pricing section)

### Per-million-token rates (input / output) — no monthly/yearly subscription, pay-as-you-go
- Claude Opus 4.8 - $5.00 / $25.00 per 1M tokens
- Claude Sonnet 5 - $2.00 / $10.00 per 1M tokens (introductory, through Aug 31, 2026; $3.00/$15.00 standard rate after)
- Claude Sonnet 4.6 - $3.00 / $15.00 per 1M tokens
- Claude Haiku 4.5 - $0.80 / $4.00 per 1M tokens

*Note: Batch API gives a flat 50% discount. Prompt caching (5-min TTL) offers substantial discounts on cache reads. Web search tool use is billed separately at $10 per 1,000 searches plus token costs. Same note as OpenAI API above: no subscription tier, pure usage-based billing — model per-month cost from estimated token volume.*

---

## Gemini ([https://gemini.google/subscriptions](https://gemini.google/subscriptions))

### Monthly rates
- Free - $0/month
- Google AI Plus - $7.99/month
- Google AI Pro - $19.99/month
- Google AI Ultra (entry tier) - $99.99/month
- Google AI Ultra (top tier) - $199.99/month

### Yearly rates
- No published annual/yearly discount option found for individual Gemini consumer plans as of verification date — confirm directly at gemini.google/subscriptions before submission, since Google restructured this tier at I/O 2026 (Ultra was cut from $249.99).

*Note: Google Workspace no longer sells a separate Gemini add-on (discontinued 2025) — Gemini is now bundled into Workspace Business Standard, Plus, and Enterprise tiers at no extra per-seat charge.*

---

## Gemini API direct ([https://ai.google.dev/gemini-api/docs/pricing](https://ai.google.dev/gemini-api/docs/pricing))

### Per-million-token rates (input / output) — no monthly/yearly subscription, pay-as-you-go
- Gemini 3.1 Pro (≤200K context) - $2.00 / $12.00 per 1M tokens
- Gemini 3.1 Pro (>200K context) - $4.00 / $18.00 per 1M tokens
- Gemini 3.5 Flash - $1.50 / $9.00 per 1M tokens
- Gemini 3 Flash - $0.50 / $3.00 per 1M tokens
- Gemini 3.1 Flash-Lite - $0.25 / $1.50 per 1M tokens
- Gemini 2.5 Flash-Lite - $0.10 / $0.40 per 1M tokens

*Note: Free tier available via Google AI Studio with reduced rate limits (Pro models no longer available on the free tier as of April 1, 2026 — only Flash and Flash-Lite). Batch mode gives ~50% discount. Search grounding: 5,000 free prompts/month shared across Gemini 3 models, then $14 per 1,000 queries.*

---

## v0.dev (Vercel) ([https://v0.app/pricing](https://v0.app/pricing))

### Monthly rates
- Free - $0/month ($5 included monthly credits)
- Premium - $20/month ($20 included monthly credits)
- Team - $30/user/month ($30 included monthly credits, pooled)
- Business - $100/user/month ($30 included monthly credits + $2/day free credits)
- Enterprise - Custom pricing

### Yearly rates
- No published annual/yearly discount found on v0's official pricing page as of verification date — all listed rates appear to be monthly-only. Confirm directly at v0.app/pricing before submission.

*Note: v0 bills on a token-based credit system (model tiers: Mini, Pro/Standard, Max) — the monthly fee buys a pool of credits, and heavier/complex generations consume credits faster regardless of plan.*


## Sources summary

| Tool | Official pricing URL |
|---|---|
| Cursor | https://cursor.com/pricing |
| Claude / Claude Code | https://claude.com/pricing |
| Windsurf | https://windsurf.com/pricing |
| GitHub Copilot | https://github.com/features/copilot/plans |
| ChatGPT | https://chatgpt.com/pricing |
| OpenAI API | https://developers.openai.com/api/docs/pricing |
| Anthropic API | https://claude.com/pricing |
| Gemini | https://gemini.google/subscriptions |
| Gemini API | https://ai.google.dev/gemini-api/docs/pricing |
| v0.dev | https://v0.app/pricing |
| Antigravity | https://antigravity.google/pricing |