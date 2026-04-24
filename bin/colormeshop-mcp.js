#!/usr/bin/env node
// Introspection-only MCP server for registry indexing (Glama etc).
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createIntrospectServer } from "../lib/introspect.js";

const server = createIntrospectServer();
const transport = new StdioServerTransport();
await server.connect(transport);
