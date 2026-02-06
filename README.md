# mcp-image-previewer

An MCP (Model Context Protocol) server that previews base64-encoded images in a native GUI window using [Slint](https://slint.dev/).

## Features

- **Native GUI** — Slint-based window, no Python or external runtime needed
- **Window reuse** — Same window updates in-place across multiple images
- **Always-on-top** — Optionally pin the preview window above other windows
- **Show/hide** — Toggle window visibility without losing state
- **Format support** — PNG, JPEG, WebP, GIF, TIFF, etc. (via sharp)

## Requirements

- Node.js 18+

## Installation

### Claude Code

```bash
claude mcp add image-previewer -- npx mcp-image-previewer
```

### Manual configuration

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "image-previewer": {
      "command": "npx",
      "args": ["mcp-image-previewer"]
    }
  }
}
```

### Tools

#### `preview_image`

Display a base64-encoded image in the viewer window.

| Parameter  | Type   | Required | Description |
|-----------|--------|----------|-------------|
| `data`    | string | Yes      | Base64-encoded image data |
| `mimeType`| string | Yes      | MIME type (e.g. `image/png`, `image/jpeg`) |

#### `show_window`

Show or hide the preview window.

| Parameter | Type    | Required | Description |
|-----------|---------|----------|-------------|
| `visible` | boolean | Yes      | `true` to show, `false` to hide |

#### `stay_on_top`

Set whether the preview window stays on top of other windows (X11/Windows only).

| Parameter | Type    | Required | Description |
|-----------|---------|----------|-------------|
| `enabled` | boolean | Yes      | `true` to enable, `false` to disable |

## Development

```bash
npm install
npm run build
npm start
```

## License

MIT
