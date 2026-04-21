# Color Me Shop MCP Server

[日本語版 README はこちら / Japanese README](./README.ja.md)

The official remote [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) server for [Color Me Shop](https://shop-pro.jp/) — a Japanese e-commerce platform operated by [GMO Pepabo, Inc.](https://pepabo.com/)

Run your online store through natural conversation with AI. "Show me today's unprocessed orders" or "List products with 5 or fewer in stock" — delegate your shop operations to Claude and other MCP-capable AI tools.

## Endpoint

```
https://agent.colorme.app/api/mcp
```

Transport: Streamable HTTP. Authentication: OAuth 2.0 with Dynamic Client Registration (handled automatically by supported clients).

## Features

- Order management — list and search orders (by date, customer, payment status), update, cancel, view sales statistics, send order emails, and generate payment URLs
- Product management — list and search products, register, update, manage inventory/categories/groups, configure featured products
- Customer management — list and search customers, register, update, award points, manage membership ranks
- Coupon management — create, update, and delete coupons
- Shop settings — inspect delivery methods, payment methods, gift settings, and product reviews

Access is scoped via Color Me Shop OAuth with least-privilege permissions.

## Pricing

MCP server access is free on all Color Me Shop plans. Standard Color Me Shop subscription fees apply as usual.

## Quick Start

Before connecting, install the "Color Me Shop AI Connector" app from the [Color Me Shop App Store](https://app.shop-pro.jp/apps/956).

### Claude Code

```bash
claude mcp add --transport http colormeshop https://agent.colorme.app/api/mcp
```

Then run `/mcp` inside Claude Code and select Authenticate to complete the OAuth flow.

[Claude Code MCP docs](https://docs.anthropic.com/en/docs/claude-code/mcp)

### Claude Desktop / claude.ai

Settings → Connectors → Add custom connector → enter:

```
https://agent.colorme.app/api/mcp
```

OAuth is handled automatically by Claude.

### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "colormeshop": {
      "url": "https://agent.colorme.app/api/mcp"
    }
  }
}
```

### OpenAI Codex CLI

```bash
codex mcp add colormeshop --url https://agent.colorme.app/api/mcp
```

### Gemini CLI

See the [Gemini CLI MCP server documentation](https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/mcp-server.md) for adding remote MCP servers.

### Local stdio bridge (advanced)

For clients that only support stdio transport, use [`mcp-remote`](https://www.npmjs.com/package/mcp-remote):

```json
{
  "mcpServers": {
    "colormeshop": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://agent.colorme.app/api/mcp"]
    }
  }
}
```

## Documentation

- [Color Me Shop AI Connector guide (Japanese)](https://help.shop-pro.jp/hc/ja/articles/49646901116819)
- [Product page (Japanese)](https://shop-pro.jp/func/colorme-ai-connector/)
- [Color Me Shop App Store listing](https://app.shop-pro.jp/apps/956)

## Requirements

- A [Color Me Shop](https://shop-pro.jp/) account
- The "Color Me Shop AI Connector" app installed from the [App Store](https://app.shop-pro.jp/apps/956)
- An MCP-compatible client (Claude Desktop, Claude Code, Cursor, OpenAI Codex CLI, Gemini CLI, etc.)

## Support

- For service-related inquiries: [Color Me Shop contact](https://shop-pro.jp/contact/)
- For issues with this repository: please open a [GitHub Issue](https://github.com/pepabo/colormeshop-mcp/issues)
