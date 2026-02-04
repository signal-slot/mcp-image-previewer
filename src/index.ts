#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import * as slint from "slint-ui";
import {
  showImage,
  setStayOnTop,
  showWindow,
  hideWindow,
  cleanup,
} from "./viewer.js";

const server = new McpServer({
  name: "mcp-image-previewer",
  version: "0.1.0",
});

server.tool(
  "preview_image",
  "Preview a base64-encoded image. Opens a GUI viewer window that is reused across calls.",
  {
    data: z.string().describe("Base64-encoded image data"),
    mimeType: z
      .string()
      .describe("MIME type of the image (e.g. image/png, image/jpeg)"),
  },
  async ({ data, mimeType }) => {
    try {
      await showImage(data, mimeType);
      return {
        content: [
          {
            type: "text" as const,
            text: "Image displayed.",
          },
        ],
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);
      return {
        content: [
          { type: "text" as const, text: `Preview failed: ${message}` },
        ],
        isError: true,
      };
    }
  },
);

server.tool(
  "show_window",
  "Show or hide the image preview window.",
  {
    visible: z.boolean().describe("true to show, false to hide"),
  },
  async ({ visible }) => {
    try {
      if (visible) {
        showWindow();
      } else {
        hideWindow();
      }
      return {
        content: [
          {
            type: "text" as const,
            text: `Window ${visible ? "shown" : "hidden"}.`,
          },
        ],
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);
      return {
        content: [
          { type: "text" as const, text: `Failed: ${message}` },
        ],
        isError: true,
      };
    }
  },
);

server.tool(
  "stay_on_top",
  "Set whether the image preview window stays on top of other windows.",
  {
    enabled: z.boolean().describe("true to enable always-on-top, false to disable"),
  },
  async ({ enabled }) => {
    try {
      setStayOnTop(enabled);
      return {
        content: [
          {
            type: "text" as const,
            text: `Stay-on-top ${enabled ? "enabled" : "disabled"}.`,
          },
        ],
      };
    } catch (error) {
      const message =
        error instanceof Error ? error.message : String(error);
      return {
        content: [
          { type: "text" as const, text: `Failed: ${message}` },
        ],
        isError: true,
      };
    }
  },
);

process.on("exit", cleanup);
process.on("SIGINT", () => {
  cleanup();
  slint.quitEventLoop();
  process.exit(0);
});
process.on("SIGTERM", () => {
  cleanup();
  slint.quitEventLoop();
  process.exit(0);
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);

  // Slint event loop merges with Node.js event loop at ~16ms intervals,
  // so MCP stdio I/O continues to work while the GUI is running.
  await slint.runEventLoop({ quitOnLastWindowClosed: false });
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
