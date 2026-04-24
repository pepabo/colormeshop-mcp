import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { loadTools } from "../lib/introspect.js";

const tools = loadTools();

describe("tools manifest", () => {
  it("exposes a non-empty tool list", () => {
    assert.ok(tools.length > 0);
  });

  it("has no duplicate tool names", () => {
    const names = tools.map((t) => t.name);
    const unique = new Set(names);
    assert.equal(unique.size, names.length);
  });

  it("every tool has a non-empty description", () => {
    for (const t of tools) {
      assert.ok(
        typeof t.description === "string" && t.description.length > 0,
        `tool ${t.name} must have a non-empty description`
      );
    }
  });

  it("every tool has a JSON-Schema inputSchema of type object", () => {
    for (const t of tools) {
      assert.equal(
        t.inputSchema?.type,
        "object",
        `tool ${t.name} inputSchema must be an object schema`
      );
    }
  });

  it("every tool declares MCP annotations with all four hints", () => {
    for (const t of tools) {
      const a = t.annotations;
      assert.ok(a, `tool ${t.name} must declare annotations`);
      assert.equal(typeof a.readOnlyHint, "boolean", `${t.name} readOnlyHint`);
      assert.equal(typeof a.destructiveHint, "boolean", `${t.name} destructiveHint`);
      assert.equal(typeof a.idempotentHint, "boolean", `${t.name} idempotentHint`);
      assert.equal(typeof a.openWorldHint, "boolean", `${t.name} openWorldHint`);
    }
  });

  it("GET-derived tools (prefixed with get/list/stat) are readOnly and not destructive", () => {
    const readOnlyPrefixes = ["get", "list", "stat"];
    for (const t of tools) {
      const isReadOnly = readOnlyPrefixes.some((p) => t.name.startsWith(p));
      if (isReadOnly) {
        assert.equal(t.annotations.readOnlyHint, true, `${t.name} must be readOnly`);
        assert.equal(t.annotations.destructiveHint, false, `${t.name} must not be destructive`);
      }
    }
  });

  it("delete-prefixed tools are flagged destructive", () => {
    for (const t of tools) {
      if (t.name.startsWith("delete")) {
        assert.equal(
          t.annotations.destructiveHint,
          true,
          `${t.name} must be flagged destructive`
        );
      }
    }
  });

  it("includes core shop tool (getShop)", () => {
    const names = new Set(tools.map((t) => t.name));
    assert.ok(names.has("getShop"), "getShop must be present");
  });
});
