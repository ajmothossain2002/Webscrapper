import type { NextApiRequest, NextApiResponse } from "next";
import { chromium } from "playwright";
import fetch from "node-fetch";
import { JSDOM } from "jsdom";
import { isValidUrl } from "@/libs/validateUrl";

interface ScrapedMetaData {
  title: string;
  description: string;
  image?: string | null;
  url?: string;
}

function extractMetaFromDocument(doc: Document): ScrapedMetaData {
  const getMeta = (nameOrProp: string): string | null => {
    const el =
      doc.querySelector(`meta[name="${nameOrProp}"]`) ||
      doc.querySelector(`meta[property="${nameOrProp}"]`);
    return (el && (el as HTMLMetaElement).getAttribute("content")) || null;
  };

  const canonical =
    (
      doc.querySelector('link[rel="canonical"]') as HTMLAnchorElement | null
    )?.getAttribute("href") || null;

  return {
    title: doc.title || "",
    description: getMeta("description") || getMeta("og:description") || "",
    image: getMeta("og:image") || getMeta("twitter:image") || null,
    url:
      canonical ||
      (typeof doc.defaultView?.location?.href === "string"
        ? doc.defaultView!.location!.href
        : undefined),
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ScrapedMetaData | { error: string }>
) {
  const rawUrl = Array.isArray(req.query.url)
    ? req.query.url[0]
    : req.query.url;

  if (!rawUrl || typeof rawUrl !== "string") {
    return res.status(400).json({ error: "Missing `url` query parameter" });
  }

  if (!isValidUrl(rawUrl)) {
    try {
      const parsed = new URL(rawUrl);
      if (!["http:", "https:"].includes(parsed.protocol)) {
        return res.status(400).json({ error: "Only http(s) URLs are allowed" });
      }
    } catch {
      return res.status(400).json({ error: "Invalid URL" });
    }
  }

  try {
    const response = await fetch(rawUrl, {
      headers: { "User-Agent": "meta-scraper/1.0 (+https://your-app.example)" },
      redirect: "follow",
    });

    const ct = response.headers.get("content-type") || "";
    const html = await response.text();

    if (ct.includes("text/html") || html.includes("<html")) {
      const dom = new JSDOM(html, { url: rawUrl });
      const metaData = extractMetaFromDocument(dom.window.document);

      if (metaData.title || metaData.description || metaData.image) {
        return res.status(200).json(metaData);
      }
    } else {
      return res
        .status(400)
        .json({ error: "URL does not point to an HTML resource" });
    }
  } catch (err) {
    console.warn(
      "Lightweight fetch failed, falling back to Playwright:",
      (err as Error).message
    );
  }

  let browser = null;
  try {
    browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });

    const context = await browser.newContext({
      userAgent: "meta-scraper-playwright/1.0",
    });
    const page = await context.newPage();

    await page.goto(rawUrl, { waitUntil: "domcontentloaded", timeout: 30_000 });

    await page.waitForTimeout(600);

    const metaData = await page.evaluate(() => {
      const getMetaContent = (nameOrProperty: string): string | null => {
        const el =
          document.querySelector(`meta[name="${nameOrProperty}"]`) ||
          document.querySelector(`meta[property="${nameOrProperty}"]`);
        return (el && (el as HTMLMetaElement).getAttribute("content")) || null;
      };

      const canonical =
        (
          document.querySelector(
            'link[rel="canonical"]'
          ) as HTMLAnchorElement | null
        )?.getAttribute("href") || null;

      return {
        title: document.title || "",
        description:
          getMetaContent("description") ||
          getMetaContent("og:description") ||
          "",
        image:
          getMetaContent("og:image") || getMetaContent("twitter:image") || null,
        url: canonical || window.location.href,
      };
    });

    return res.status(200).json(metaData);
  } catch (error) {
    console.error("Playwright scraping failed:", error);
    return res.status(500).json({ error: "Failed to scrape the URL" });
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (e) {
        console.warn("Failed to close browser cleanly:", (e as Error).message);
      }
    }
  }
}
