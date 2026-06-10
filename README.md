# GT Everyday — Shopify Theme Workspace

Working repository for GT Everyday's Shopify theme and the **B2B Landing page** effort.

## Baseline
The initial commit is a faithful code baseline of the **live** theme
**"HE-RU Vodoma 2024"** (theme id `131669328113`, role `MAIN`), pulled on
2026-06-10 from the Shopify Admin GraphQL API (`theme.files`) via the Shopify
MCP server.

> Shopify CLI was **not** used: the build environment's network policy blocks
> all Shopify hosts (`*.myshopify.com`, `cdn.shopify.com`, `accounts.shopify.com`).
> The MCP server runs server-side and could reach the Admin API.

### What is included
All editable theme code: `assets/`, `config/`, `layout/`, `locales/`,
`sections/`, `snippets/`, `templates/` — 763 files.

### What is NOT included
Three asset files whose bodies are CDN URLs (not inline content) could not be
downloaded from this network: see `BASELINE_PULL_NOTES.md`. Binary image/font
assets that Shopify returned inline (base64) **are** included.

The published theme was not modified by this pull (read-only).
