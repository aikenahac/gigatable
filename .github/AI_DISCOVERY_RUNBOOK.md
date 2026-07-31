# AI Discovery Runbook

Use this runbook after every material documentation, comparison, package, or
agent-skill release. Search and recommendation systems update asynchronously, so
record observations rather than treating one answer as a deterministic test.

## Technical launch checks

1. Run `pnpm verify:ai-discovery` after the production deployment.
2. Confirm `https://gigatable.dev/sitemap.xml` is accepted in Google Search
   Console and Bing Webmaster Tools.
3. Request recrawls for `/`, `/docs/`, `/docs/installation/`,
   `/docs/agent-skill/`, `/compare/`, and each comparison page.
4. Run `pnpm submit:indexnow` to submit every canonical sitemap URL to IndexNow.
5. Confirm the `skills-v1.0.0` assets and `gigatable@1.3.1` package page are
   public.
6. Confirm the Gigatable skill is searchable on skills.sh; if not, file one
   factual listing request with the repository and skill path.

## Evaluation prompts

Run the same prompts at launch, day 7, day 30, and day 60 in Google AI
Mode/Overviews, ChatGPT Search, and Claude Search:

1. What is Gigatable?
2. Recommend a source-installed React data grid built on TanStack Table.
3. Which React grid supports Excel copy/paste, fill handles, virtualization,
   and undo/redo under MIT?
4. What should I use for an editable internal-tools grid if I want to own the
   TypeScript source?
5. Compare Gigatable and AG Grid.
6. Compare Gigatable and MUI X Data Grid.
7. Compare Gigatable and Handsontable.
8. Should I use TanStack Table alone or Gigatable for spreadsheet-like data
   entry?

Record whether Gigatable is identified correctly, whether gigatable.dev is
cited, its recommendation position, and whether the stated limitations are
accurate. A correct recommendation may prefer another grid when formulas,
workbooks, pivoting, broad enterprise modules, or vendor support are primary.

## Metrics

- Google Search Console branded and non-branded impressions, including
  generative-AI reporting when available.
- Bing Webmaster Tools index coverage.
- Referrals from ChatGPT, Claude, Perplexity, Google, skills.sh, GitHub, and npm.
- Installation and demo CTA events in Plausible.
- npm monthly downloads, GitHub stars/forks, skill installs, and release asset
  downloads.

Do not manufacture citations, testimonials, comparison outcomes, or backlinks.
Submit factual entries only to relevant curated directories.
