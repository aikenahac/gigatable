export const DEMO_SCENARIO_QUERY_KEY = "scenario";

export const DEMO_SCENARIO_IDS = ["biobank", "support", "production"] as const;

export type DemoScenarioId = (typeof DEMO_SCENARIO_IDS)[number];

export const DEFAULT_DEMO_SCENARIO: DemoScenarioId = "biobank";

export function normalizeDemoPathname(pathname: string): string {
  const normalized = pathname.replace(/\/+$/, "");
  return normalized || "/demo";
}

export function getDemoScenarioFromSearch(search: string): DemoScenarioId {
  const candidate = new URLSearchParams(search).get(DEMO_SCENARIO_QUERY_KEY);

  return DEMO_SCENARIO_IDS.includes(candidate as DemoScenarioId)
    ? (candidate as DemoScenarioId)
    : DEFAULT_DEMO_SCENARIO;
}

export function createDemoScenarioSearch(
  search: string,
  scenario: DemoScenarioId,
): string {
  const params = new URLSearchParams(search);
  params.set(DEMO_SCENARIO_QUERY_KEY, scenario);
  return `?${params.toString()}`;
}
