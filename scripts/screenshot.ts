/**
 * Full-page screenshot script for marketing team
 * Usage: npx tsx scripts/screenshot.ts
 *
 * Requirements: dev server must be running at BASE_URL
 */

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";
import os from "os";

const BASE_URL = process.env.SCREENSHOT_URL || "http://localhost:3000";
// Save to ~/Downloads/evalocal-screenshots so it's easy to find and share
const OUT_DIR = path.join(os.homedir(), "Downloads", "evalocal-screenshots");

// Pages to capture — add/remove as needed
const PAGES: { name: string; path: string; waitFor?: string }[] = [
  { name: "01-home", path: "/" },
  { name: "02-vendors", path: "/vendors", waitFor: ".vendor-card" },
  { name: "03-categories", path: "/categories" },
  { name: "04-about", path: "/about" },
  { name: "05-contact", path: "/contact" },
  { name: "06-auth-signin", path: "/auth/signin" },
  { name: "07-auth-register", path: "/auth" },
];

// Viewport sizes for marketing (desktop + mobile)
const VIEWPORTS = [
  { label: "desktop", width: 1440, height: 900 },
  { label: "mobile", width: 390, height: 844 },
];

async function screenshot() {
  // Ensure output directory exists
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  console.log(`\n📸 Starting screenshots → ${OUT_DIR}\n`);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  let successCount = 0;
  let failCount = 0;

  for (const viewport of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport({ width: viewport.width, height: viewport.height });

    // Disable animations for cleaner screenshots
    await page.addStyleTag({
      content: `*, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }`,
    });

    for (const route of PAGES) {
      const url = `${BASE_URL}${route.path}`;
      const filename = `${route.name}-${viewport.label}.png`;
      const filepath = path.join(OUT_DIR, filename);

      try {
        process.stdout.write(`  ${viewport.label.padEnd(8)} ${route.path.padEnd(25)} → `);

        await page.goto(url, { waitUntil: "networkidle2", timeout: 30000 });

        // Wait for a specific selector if provided
        if (route.waitFor) {
          await page.waitForSelector(route.waitFor, { timeout: 5000 }).catch(() => {});
        }

        // Extra settle time for fonts/images
        await new Promise((r) => setTimeout(r, 800));

        await page.screenshot({ path: filepath, fullPage: true });

        const sizeKb = Math.round(fs.statSync(filepath).size / 1024);
        console.log(`✅ ${filename} (${sizeKb}kb)`);
        successCount++;
      } catch (err: any) {
        console.log(`❌ FAILED — ${err.message}`);
        failCount++;
      }
    }

    await page.close();
  }

  await browser.close();

  console.log(`\n✨ Done — ${successCount} captured, ${failCount} failed`);
  console.log(`📁 Saved to: ${OUT_DIR}\n`);
}

screenshot().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
