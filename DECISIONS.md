# DECISIONS.md

Framed as: this feature ships tomorrow, and I have 60 minutes to spend before it does.

## What did I improve?

Rather than treat this as a demo, I spent the 60-minute budget on the things that make the
difference between "works when I click the button" and "works when someone else clicks it":

- **Server-side validation, not just UI validation.** The API route rejects empty prompts, caps
  prompt length at 1200 characters, and filters out any integration id that isn't one of the five
  real ones — even though the frontend already prevents most of this. The frontend is not a
  trust boundary.
- **A missing API key fails loudly and specifically.** Instead of an unhandled exception or a
  generic 500, `/api/generate` checks for `ANTHROPIC_API_KEY` up front and returns a plain-English
  error telling you exactly what to fix. This is the single most likely first-run failure for
  anyone cloning the repo, so it gets a dedicated code path.
- **Defensive JSON parsing on the model's response.** I asked the model to return only JSON, but I
  didn't trust that instruction to hold 100% of the time — models sometimes wrap output in
  markdown fences or add a stray sentence. `extractJson()` strips fences and pulls the first
  balanced `{...}` block rather than doing a naive `JSON.parse` on the raw string. If parsing still
  fails, the route returns the raw text alongside a 502 instead of silently breaking the UI.
- **Locked the Next.js version to a patched release.** The initial `npm install` flagged a known
  security advisory on the version I'd pinned; I bumped to the latest patched 14.2.x rather than
  ship with a known CVE, which is a one-line fix that's easy to skip under time pressure.
- **Kept the loading and error states real, not decorative.** The response panel has distinct
  empty / loading / error / success states wired to actual request state, not just a spinner that
  always resolves to success — because in a demo it's tempting to only build the happy path.
- **Accessibility floor**: visible focus rings on every interactive element, `aria-pressed` on the
  integration toggles, and `prefers-reduced-motion` respected globally. Small, but it's the
  difference between "looks done" and "is done."

## What did I intentionally leave out?

- **No rate limiting or per-user quotas.** Every submit hits the Anthropic API directly with no
  throttling. Fine for a take-home; not fine in production, where one refresh-spamming user could
  run up the bill.
- **No auth, no persistence.** There's no login, no database, no history of past plans. The brief
  didn't ask for accounts or saved projects, and adding either would have meant spending the time
  budget on plumbing instead of on the actual prompt → integration → response flow being evaluated.
- **No retry/backoff on transient API failures.** A dropped connection to Anthropic surfaces as a
  visible error the user can act on (click again) rather than a silent retry loop. Simpler, and
  arguably the right call for a synchronous single-shot UI — but it's a deliberate simplification,
  not an oversight.
- **No streaming.** Responses come back as a single JSON blob rather than streaming token-by-token.
  Streaming would make the wait feel shorter on longer generations, but it also means parsing
  partial JSON, which is a meaningfully bigger and more fragile piece of engineering for a plan
  that returns in a few seconds anyway.
- **The five integrations are hardcoded, not fetched from anywhere.** Genuinely fine here since the
  brief says they're dummy/context-only — a real version of this product would pull the available
  integrations from a connected-accounts table, but building that table wasn't the point of the
  exercise.

## What's the biggest production risk?

**An unbounded, unauthenticated API route that calls a paid LLM on every request.** Right now,
anyone with the URL can hit `/api/generate` directly (not just through the UI) with an arbitrarily
crafted prompt, as many times as they want, and each call costs real money against the
`ANTHROPIC_API_KEY` on the server. There's no rate limiting, no auth, no cost ceiling, and no
abuse detection. Before this actually ships, that's the first thing I'd close — at minimum a
per-IP rate limit and a request cap, ideally behind real auth with per-user quotas. Everything else
in this repo (parsing edge cases, missing streaming, no persistence) is a UX gap; this one is a
bill and an abuse vector.
