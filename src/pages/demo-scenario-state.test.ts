import { describe, expect, it } from "vitest";
import {
  createDemoScenarioSearch,
  getDemoScenarioFromSearch,
  normalizeDemoPathname,
} from "./demo-scenario-state";

describe("demo scenario URL state", () => {
  it("reads each shareable demo scenario", () => {
    expect(getDemoScenarioFromSearch("?scenario=biobank")).toBe("biobank");
    expect(getDemoScenarioFromSearch("?scenario=support")).toBe("support");
    expect(getDemoScenarioFromSearch("?scenario=production")).toBe(
      "production",
    );
  });

  it("falls back to the biobank for missing or invalid values", () => {
    expect(getDemoScenarioFromSearch("")).toBe("biobank");
    expect(getDemoScenarioFromSearch("?scenario=unknown")).toBe("biobank");
  });

  it("updates the scenario without dropping other URL state", () => {
    expect(createDemoScenarioSearch("?ref=docs", "support")).toBe(
      "?ref=docs&scenario=support",
    );
    expect(
      createDemoScenarioSearch("?scenario=support&ref=docs", "production"),
    ).toBe("?scenario=production&ref=docs");
  });

  it("removes legacy trailing slashes from the demo pathname", () => {
    expect(normalizeDemoPathname("/demo/")).toBe("/demo");
    expect(normalizeDemoPathname("/demo///")).toBe("/demo");
    expect(normalizeDemoPathname("/demo")).toBe("/demo");
  });
});
