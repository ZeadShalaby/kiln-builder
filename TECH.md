# TECH.md

## Technology: Model Context Protocol (MCP)

### What is it?

MCP is an open protocol (originally released by Anthropic in late 2024, and adopted widely
through 2025 by OpenAI, Google, Microsoft, and most major AI tooling) for connecting AI models to
external tools and data sources through a standard interface, instead of a bespoke integration per
model per service. An MCP **server** exposes a set of tools/resources (e.g. "list Stripe charges,"
"send a Slack message"); an MCP **client** (the model-facing app) discovers and calls those tools
over a shared schema. The pitch is basically "USB-C for AI tools" — write the Stripe integration
once as an MCP server, and any MCP-compatible model or app can use it, rather than every product
writing its own Stripe function-calling glue.

### How could Stunning use it?

This is directly relevant to what this exact task is a miniature version of. Right now, this repo
hardcodes five "integrations" as static context strings injected into a prompt — that's a
reasonable simplification for a take-home, but it's exactly the pattern that doesn't scale. If
Stunning's actual product lets users wire an AI-generated app to real Stripe, Shopify, Gmail,
Slack, and Sheets accounts (not just describe them), MCP is the natural mechanism:

- Each integration (Stripe, Shopify, Gmail, Slack, Sheets, and anything added later) becomes an
  MCP server with a defined tool surface, instead of a one-off SDK integration hand-written for
  every new provider.
- The "select integrations" step in this UI stops being decorative context and becomes an actual
  MCP client connecting to the servers the user enabled — the model can genuinely call
  `stripe.list_charges` or `slack.post_message` mid-conversation instead of just being told those
  tools exist.
- New integrations become additive: adding a sixth provider means pointing at its MCP server (if
  one already exists in the growing public ecosystem) rather than writing new bespoke API glue and
  a new bespoke prompt-injection block.
- It also standardizes auth/consent flows across integrations, which matters a lot once you're
  letting a generated app act on a user's real accounts rather than just describing what it would
  do.

### What are its limitations?

- **Ecosystem is uneven.** Some providers have solid, well-maintained MCP servers; a lot of others
  don't yet, or have community-maintained ones of inconsistent quality — you can't assume "MCP
  server exists and is production-grade" for an arbitrary integration today.
- **Security surface.** Giving a model tool access to Stripe or Gmail through MCP means the model
  can now take real actions, not just describe them. Prompt injection from untrusted content
  (a scraped webpage, an email body) becoming a "call this tool" instruction is a real, actively
  discussed risk in the MCP community, not a hypothetical one. It needs the same scoped-permission
  thinking as OAuth, and arguably more.
- **No built-in versioning/discovery guarantees.** A tool's schema can change server-side; there's
  not yet a mature, universal story for how clients handle a tool contract changing under them.
- **Overhead for the simple case.** For a handful of static, well-known integrations (exactly
  this task's scope), standing up a full MCP client/server architecture is more machinery than
  five hardcoded context strings. MCP earns its cost once the integration surface is large,
  changing, or needs to be reused across multiple products — not for a single fixed list of five.

### Would I use it today? Why or why not?

For this take-home: no — five known, dummy integrations don't justify the protocol overhead, and
the brief explicitly says they don't need to connect to anything real.

For Stunning's actual product, if the roadmap includes letting generated apps take real actions
against real connected accounts: yes, I'd start building toward it now rather than bolting it on
later, specifically because the "integration = context string" pattern in this repo is the thing
that stops scaling first. I'd start with one or two integrations end-to-end on real MCP servers
(Stripe has a well-supported one) before generalizing, rather than betting on protocol-wide
maturity across all five providers at once.
