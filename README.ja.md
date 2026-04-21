# カラーミーショップ AIコネクター (MCPサーバー)

[English README](./README.md)

[カラーミーショップ](https://shop-pro.jp/)（[GMO ペパボ株式会社](https://pepabo.com/)が運営する EC プラットフォーム）の公式リモート [Model Context Protocol (MCP)](https://modelcontextprotocol.io/) サーバーです。

Claude など AI ツールへの自然な指示だけで、カラーミーショップの受注・商品・顧客情報を取得・操作できます。「今日の未処理の受注を教えて」「在庫が5以下の商品を一覧にして」と話しかけるだけでショップ運営を AI にまかせられます。

## エンドポイント

```
https://agent.colorme.app/api/mcp
```

トランスポート: Streamable HTTP / 認証: OAuth 2.0 with Dynamic Client Registration（対応クライアントが自動処理）

## 主な機能

- 受注管理 — 受注一覧・検索（日付・顧客・決済状況等）、更新・キャンセル、売上統計、受注メール送信、決済 URL 発行
- 商品管理 — 商品一覧・検索、登録・更新、在庫・カテゴリ・グループ管理、おすすめ商品設定
- 顧客管理 — 顧客一覧・検索、登録・更新、ポイント付与・会員ランク操作
- クーポン管理 — クーポンの作成・更新・削除
- ショップ情報 — 配送方法・決済方法・ギフト設定・商品レビューの閲覧

カラーミーショップ OAuth 認証のもと、必要最小限の権限でデータにアクセスします。

## 料金

MCP サーバーの利用はカラーミーショップ全プランで無料です。カラーミーショップの通常契約料金のみかかります。

## クイックスタート

接続前に [カラーミーショップ アプリストア](https://app.shop-pro.jp/apps/956) から「カラーミーショップ AIコネクター」をインストールしてください。

### Claude Code

```bash
claude mcp add --transport http colormeshop https://agent.colorme.app/api/mcp
```

その後、Claude Code 内で `/mcp` を実行し Authenticate を選んで OAuth フローを完了します。

[Claude Code MCP ドキュメント](https://docs.anthropic.com/en/docs/claude-code/mcp)

### Claude Desktop / claude.ai

設定 → コネクタ → カスタムコネクタを追加 で以下の URL を入力:

```
https://agent.colorme.app/api/mcp
```

OAuth は Claude が自動で処理します。

### Cursor

`.cursor/mcp.json` に追加:

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

リモート MCP サーバー追加方法は [Gemini CLI MCP サーバードキュメント](https://github.com/google-gemini/gemini-cli/blob/main/docs/tools/mcp-server.md) を参照してください。

### ローカル stdio ブリッジ（上級者向け）

stdio トランスポートのみをサポートするクライアント向けには [`mcp-remote`](https://www.npmjs.com/package/mcp-remote) を利用します:

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

## ドキュメント

- [カラーミーショップ AIコネクター ヘルプ](https://help.shop-pro.jp/hc/ja/articles/49646901116819)
- [サービスページ](https://shop-pro.jp/func/colorme-ai-connector/)
- [アプリストア掲載ページ](https://app.shop-pro.jp/apps/956)

## 必要なもの

- [カラーミーショップ](https://shop-pro.jp/) のアカウント
- カラーミーショップ アプリストアからインストール済みの [「カラーミーショップ AIコネクター」](https://app.shop-pro.jp/apps/956)
- MCP 対応クライアント（Claude Desktop、Claude Code、Cursor、OpenAI Codex CLI、Gemini CLI など）

## サポート

- サービスに関するお問い合わせ: [カラーミーショップ お問い合わせ](https://shop-pro.jp/contact/)
- 本リポジトリに関する不具合: [GitHub Issue](https://github.com/pepabo/colormeshop-mcp/issues) を作成してください
