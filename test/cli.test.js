import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { once } from "node:events";

const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI = resolve(__dirname, "..", "bin", "colormeshop-mcp.js");

// Spawns the CLI, writes a single MCP JSON-RPC request to stdin, and returns
// the first newline-delimited JSON response from stdout. Times out after 3s.
async function rpc(request) {
  const child = spawn(process.execPath, [CLI], {
    stdio: ["pipe", "pipe", "pipe"],
  });

  let out = "";
  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (chunk) => {
    out += chunk;
  });

  child.stdin.write(JSON.stringify(request) + "\n");

  const timeout = setTimeout(() => child.kill("SIGKILL"), 3000);
  const line = await new Promise((res) => {
    const iv = setInterval(() => {
      const nl = out.indexOf("\n");
      if (nl >= 0) {
        clearInterval(iv);
        res(out.slice(0, nl));
      }
    }, 20);
  });
  clearTimeout(timeout);
  child.kill();
  await once(child, "exit").catch(() => {});
  return JSON.parse(line);
}

describe("CLI stdio smoke test", () => {
  it("responds to initialize without opening network connections", async () => {
    const response = await rpc({
      jsonrpc: "2.0",
      id: 1,
      method: "initialize",
      params: {
        protocolVersion: "2025-06-18",
        capabilities: {},
        clientInfo: { name: "cli-test", version: "0.0.0" },
      },
    });
    assert.equal(response.jsonrpc, "2.0");
    assert.equal(response.id, 1);
    assert.equal(response.result.serverInfo.name, "colormeshop-mcp");
  });
});
