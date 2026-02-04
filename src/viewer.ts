import * as slint from "slint-ui";
import sharp from "sharp";

let component: Record<string, any> | null = null;
let ui: Record<string, any> | null = null;

function ensureUI(): Record<string, any> {
  if (!ui) {
    ui = slint.loadFile(
      new URL("../ui/main.slint", import.meta.url),
    ) as Record<string, any>;
  }
  return ui;
}

function ensureWindow(): Record<string, any> {
  const mod = ensureUI();
  let needNew = !component;
  if (!needNew) {
    try {
      needNew = !(component as Record<string, any>).window.visible;
    } catch {
      needNew = true;
    }
  }
  if (needNew) {
    const Ctor = mod.MainWindow as new () => Record<string, any>;
    component = new Ctor();
    (component as Record<string, any>).show();
  }
  return component as Record<string, any>;
}

export function setStayOnTop(value: boolean): void {
  const win = ensureWindow();
  win.stay_on_top = value;
}

export async function showImage(
  data: string,
  _mimeType: string,
): Promise<void> {
  const buf = Buffer.from(data, "base64");
  const { data: rgba, info } = await sharp(buf)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const win = ensureWindow();
  win.current_image = {
    width: info.width,
    height: info.height,
    data: new Uint8ClampedArray(rgba.buffer, rgba.byteOffset, rgba.byteLength),
  };
  win.image_info = `${info.width} x ${info.height}`;
}

export function showWindow(): void {
  ensureWindow();
}

export function hideWindow(): void {
  if (component) {
    try {
      (component as Record<string, any>).hide();
    } catch {
      // ignore
    }
  }
}

export function cleanup(): void {
  if (component) {
    try {
      (component as Record<string, any>).hide();
    } catch {
      // ignore errors during cleanup
    }
    component = null;
  }
}
