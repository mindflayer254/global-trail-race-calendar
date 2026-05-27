import { assertPublicContentOnly } from "@/backend/ingestion/policy";
import { isAllowedByRobotsTxt } from "@/backend/ingestion/robots";
import type { FetchPolicy } from "@/backend/ingestion/types";

export async function fetchPublicPage(sourceUrl: string, policy: FetchPolicy) {
  const url = new URL(sourceUrl);

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`Unsupported URL protocol for public web ingestion: ${sourceUrl}`);
  }

  if (policy.respectRobotsTxt) {
    const isAllowed = await isAllowedByRobotsTxt(sourceUrl, policy.userAgent, fetch);

    if (!isAllowed) {
      throw new Error(`robots.txt disallows fetching: ${sourceUrl}`);
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), policy.timeoutMs);

  try {
    const response = await fetch(sourceUrl, {
      headers: {
        "user-agent": policy.userAgent,
        accept: "text/html,application/xhtml+xml",
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} while fetching ${sourceUrl}`);
    }

    const contentType = response.headers.get("content-type") ?? "";

    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml+xml")) {
      throw new Error(`Unsupported content type for ${sourceUrl}: ${contentType || "unknown"}`);
    }

    const html = await response.text();
    assertPublicContentOnly(html, sourceUrl);
    return html;
  } finally {
    clearTimeout(timeout);
  }
}
