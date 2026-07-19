# PROMPTS.md — Argus AI Spend Audit & Optimization Engine

This document outlines the exact Large Language Model (LLM) prompts, configuration parameters, and fallback architectures used by the Argus application in production (`Part 1`), as well as our AI-assisted development workflow history (`Part 2`).

---

## Part 1: Production Application Prompts (Argus LLM Engine)

### 1. Overview & Objective
When a user runs a spend audit (`POST /api/v1/audit/analyze`), Argus calculates exact structural waste across four defensible pillars using verified pricing data. To provide executive context along with raw numbers, Argus invokes OpenAI's `gpt-4o-mini` model to synthesize the findings into a crisp, highly personalized 1-paragraph summary (`summaryParagraph`). This summary is persisted to PostgreSQL and displayed on both the main dashboard and public shareable reports (`/share/[slug]`).

### 2. Model Configuration & Parameters
- **Provider**: OpenAI (`openai` Node SDK)
- **Model**: `gpt-4o-mini` (selected for sub-second latency, low token cost, and strong analytical reasoning)
- **Temperature**: `0.2` (low temperature ensures factual accuracy, exact dollar matching, and zero creative hallucination)
- **Max Tokens**: `250` (forces tight, executive-ready brevity without cutoff)
- **Timeout Guard**: `3500ms` (3.5 seconds strictly enforced via `Promise.race`)

### 3. System & User Prompt Template

```typescript
const systemPrompt = `You are Argus, a senior AI spend and cloud architecture auditor.
Your goal is to write exactly ONE cohesive, executive-ready paragraph (3 to 4 sentences maximum) tailored for a VP of Engineering or CFO.
Summarize why the user's AI stack has structural waste (e.g., seat overkill, retail seat vs API token costs, missing annual billing discounts) and explain how the proposed savings maintain 100% of the team's engineering/writing capabilities.
Do NOT use generic fluff, marketing jargon, or bullet points. Reference exact tool names and verified dollar amounts provided in the user data. Always maintain a professional, defensible, and objective tone.`;

const userPromptPayload = `
Audit Context:
- Team Size: ${input.teamSize} seats
- Primary Use Case: ${input.primaryUseCase}
- Total Current Spend: $${currentMonthlySpend}/mo ($${currentMonthlySpend * 12}/yr)
- Identified Monthly Savings: $${result.totalMonthlySavings}/mo
- Identified Annual Savings: $${result.totalAnnualSavings}/yr
- Overall Stack Efficiency Status: ${result.overallStatus}

Tool-by-Tool Findings & Recommended Actions:
${result.toolBreakdowns
  .map(
    (item) =>
      `- Tool: ${item.toolName} (${item.currentPlan}, $${item.currentSpend}/mo) -> Action: ${item.recommendedAction.toUpperCase()} to ${item.recommendedPlanOrTool} ($${item.estimatedMonthlyCost}/mo). Reason: ${item.reason}`,
  )
  .join('\n')}

Synthesize these exact findings into your single executive paragraph now.
`;
```

### 4. Defensive Fallback Strategy (`getFallbackSummary`)
To ensure enterprise reliability and protect against API rate limits, network timeouts (`>3.5s`), or missing environment variables (`OPENAI_API_KEY`) during testing and review, `AiService` wraps the LLM invocation in a non-blocking try/catch block. If the LLM call cannot complete instantaneously, Argus generates an objective, rule-derived summary using the following template:

```typescript
`For your ${input.teamSize}-person team focused on ${input.primaryUseCase} workflows, Argus analyzed your current AI spend and identified $${result.totalMonthlySavings}/mo ($${result.totalAnnualSavings}/yr) in structural optimization opportunities. By addressing ${keyActionReasons.join(', ')}, your organization can transition from your current $${currentSpend}/mo spend down to an optimized $${optimizedSpend}/mo stack while maintaining 100% model capability and developer output.`
```

---

## Part 2: AI-Assisted Development Prompts (Candidate Workflow)

*(Reserved for candidate pair-programming and AI-assisted engineering workflow history)*
