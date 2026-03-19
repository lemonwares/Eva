import fs from "fs";
import path from "path";

const TEMPLATES_DIR = path.join(process.cwd(), "emails");

/**
 * Loads an email template and replaces {{variable}} placeholders.
 *
 * Built-in variables always injected:
 *   {{logoDark}}  — Cloudinary-hosted eva-logo-dark.png (works in all email clients)
 *   {{logoLight}} — Cloudinary-hosted eva-logo-light.png
 *   {{appUrl}}    — NEXTAUTH_URL env var
 *
 * Standalone mode: full <!DOCTYPE html> file — variables replaced directly.
 * Fragment mode:   content between CONTENT_START/END injected into _layout.html.
 */
export function loadTemplate(
  templateName: string,
  vars: Record<string, string>,
): string {
  const contentPath = path.join(TEMPLATES_DIR, `${templateName}.html`);

  if (!fs.existsSync(contentPath)) {
    throw new Error(`Email template not found: ${templateName}.html`);
  }

  const raw = fs.readFileSync(contentPath, "utf-8");

  const builtins: Record<string, string> = {
    appUrl: process.env.NEXTAUTH_URL || "https://evalocal.com",
    // Hosted on Cloudinary — Gmail and other clients block base64 data URIs
    logoDark: "https://res.cloudinary.com/duy8dw0cx/image/upload/brand/eva-logo-dark.png",
    logoLight: "https://res.cloudinary.com/duy8dw0cx/image/upload/brand/eva-logo-light.png",
  };

  const allVars = { ...builtins, ...vars };

  // Standalone mode — full HTML file
  if (raw.trimStart().startsWith("<!DOCTYPE") || raw.trimStart().startsWith("<html")) {
    return interpolate(raw, allVars);
  }

  // Fragment mode — inject into _layout.html
  const layoutPath = path.join(TEMPLATES_DIR, "_layout.html");
  const layout = fs.readFileSync(layoutPath, "utf-8");

  const startMarker = "<!-- CONTENT_START -->";
  const endMarker = "<!-- CONTENT_END -->";
  const start = raw.indexOf(startMarker);
  const end = raw.indexOf(endMarker);

  if (start === -1 || end === -1) {
    throw new Error(`Template ${templateName}.html is missing CONTENT_START / CONTENT_END markers`);
  }

  const content = raw.slice(start + startMarker.length, end).trim();
  const full = layout.replace("{{content}}", content);
  return interpolate(full, allVars);
}

function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? "");
}
