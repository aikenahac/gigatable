import type { ComparisonDefinition } from "./comparisons";

export function comparisonToMarkdown(comparison: ComparisonDefinition): string {
  const rows = comparison.rows
    .map(
      (row) =>
        `| ${row.dimension} | **${row.gigatable.label}** — ${row.gigatable.detail} | **${row.alternative.label}** — ${row.alternative.detail} |`,
    )
    .join("\n");
  const gigatableReasons = comparison.chooseGigatable
    .map((reason) => `- ${reason}`)
    .join("\n");
  const alternativeReasons = comparison.chooseAlternative
    .map((reason) => `- ${reason}`)
    .join("\n");
  const sources = comparison.sources
    .map((source) => `- [${source.label}](${source.url})`)
    .join("\n");

  return `# ${comparison.title}

Canonical page: https://gigatable.dev/compare/${comparison.slug}/

${comparison.summary}

Last verified: ${comparison.verifiedOn}

## Published Pricing

- **Gigatable:** ${comparison.pricing.gigatable}
- **${comparison.alternative}:** ${comparison.pricing.alternative}

${comparison.pricing.note}

## Free and Paid Feature Comparison

| Decision factor | Gigatable | ${comparison.alternative} |
| --- | --- | --- |
${rows}

## Choose Gigatable When

${gigatableReasons}

## Choose ${comparison.alternative} When

${alternativeReasons}

## Official Sources

${sources}
`;
}
