import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import { createIntrospectServer, loadTools } from "../lib/introspect.js";

const tools = loadTools();

describe("introspect-only MCP server", () => {
  let client;
  let server;

  before(async () => {
    const [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();
    server = createIntrospectServer();
    await server.connect(serverTransport);

    client = new Client({ name: "test-client", version: "0.0.0" }, { capabilities: {} });
    await client.connect(clientTransport);
  });

  after(async () => {
    await client?.close();
    await server?.close();
  });

  it("responds to initialize with server info identifying colormeshop-mcp", () => {
    const info = client.getServerVersion();
    assert.equal(info?.name, "colormeshop-mcp");
    assert.ok(info?.version);
  });

  it("lists the full tool set via tools/list (matches tools.json)", async () => {
    const result = await client.listTools();
    assert.equal(result.tools.length, tools.length);
    const got = result.tools.map((t) => t.name).sort();
    const want = tools.map((t) => t.name).sort();
    assert.deepEqual(got, want);
  });

  it("lists empty prompts (no prompts in introspect mode)", async () => {
    const result = await client.listPrompts();
    assert.deepEqual(result.prompts, []);
  });

  it("lists empty resources (no resources in introspect mode)", async () => {
    const result = await client.listResources();
    assert.deepEqual(result.resources, []);
  });

  it("tools/call always returns isError=true (no data access)", async () => {
    const result = await client.callTool({ name: "getShop", arguments: {} });
    assert.equal(result.isError, true);
    const text = JSON.stringify(result.content);
    assert.ok(/introspection/i.test(text), "error must mention introspection mode");
  });

  it("tools/call for every declared tool returns isError=true (no partial implementation)", async () => {
    for (const t of tools) {
      const result = await client.callTool({ name: t.name, arguments: {} });
      assert.equal(result.isError, true, `${t.name} must return isError=true`);
    }
  });

  it("tools/call for an unknown tool also returns isError (no backend reach)", async () => {
    const result = await client.callTool({ name: "nonexistent-tool", arguments: {} });
    assert.equal(result.isError, true);
  });
});
