// Introspection-only MCP server: serves static tools.json, never calls the backend.
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import {
  CallToolRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const TOOLS_JSON_PATH = path.resolve(__dirname, "../tools.json");

const SERVER_NAME = "colormeshop-mcp";
const SERVER_VERSION = "0.1.0";
const HOSTED_ENDPOINT_URL = "https://agent.colorme.app/api/mcp";

export function loadTools(toolsPath = TOOLS_JSON_PATH) {
  const { tools } = JSON.parse(readFileSync(toolsPath, "utf-8"));
  return tools;
}

export function createIntrospectServer({ tools = loadTools() } = {}) {
  const server = new Server(
    { name: SERVER_NAME, version: SERVER_VERSION },
    { capabilities: { tools: {}, prompts: {}, resources: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools }));

  server.setRequestHandler(CallToolRequestSchema, async () => ({
    isError: true,
    content: [
      {
        type: "text",
        text: `Introspection-only. Connect to ${HOSTED_ENDPOINT_URL} with OAuth to call tools.`,
      },
    ],
  }));

  server.setRequestHandler(ListPromptsRequestSchema, async () => ({ prompts: [] }));
  server.setRequestHandler(ListResourcesRequestSchema, async () => ({ resources: [] }));
  server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => ({
    resourceTemplates: [],
  }));

  return server;
}
