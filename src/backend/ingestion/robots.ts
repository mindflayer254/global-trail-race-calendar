type RobotsRule = {
  userAgent: string;
  disallow: string[];
  allow: string[];
};

const robotsCache = new Map<string, RobotsRule[]>();

export async function isAllowedByRobotsTxt(url: string, userAgent: string, fetcher: typeof fetch) {
  const target = new URL(url);
  const origin = target.origin;
  const rules = await getRobotsRules(origin, fetcher);

  if (rules.length === 0) {
    return true;
  }

  const applicableRules = rules.filter((rule) =>
    rule.userAgent === "*" || userAgent.toLowerCase().includes(rule.userAgent.toLowerCase()),
  );

  if (applicableRules.length === 0) {
    return true;
  }

  const path = `${target.pathname}${target.search}`;
  const allowMatch = longestMatchingPath(
    applicableRules.flatMap((rule) => rule.allow),
    path,
  );
  const disallowMatch = longestMatchingPath(
    applicableRules.flatMap((rule) => rule.disallow),
    path,
  );

  if (!disallowMatch) {
    return true;
  }

  return Boolean(allowMatch && allowMatch.length >= disallowMatch.length);
}

async function getRobotsRules(origin: string, fetcher: typeof fetch) {
  const cached = robotsCache.get(origin);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetcher(`${origin}/robots.txt`);

    if (!response.ok) {
      robotsCache.set(origin, []);
      return [];
    }

    const rules = parseRobotsTxt(await response.text());
    robotsCache.set(origin, rules);
    return rules;
  } catch {
    robotsCache.set(origin, []);
    return [];
  }
}

export function parseRobotsTxt(robotsTxt: string) {
  const rules: RobotsRule[] = [];
  let currentRule: RobotsRule | undefined;

  robotsTxt.split(/\r?\n/).forEach((line) => {
    const cleanLine = line.split("#")[0].trim();

    if (!cleanLine) {
      return;
    }

    const [rawKey, ...rawValueParts] = cleanLine.split(":");
    const key = rawKey?.trim().toLowerCase();
    const value = rawValueParts.join(":").trim();

    if (!key || !value) {
      return;
    }

    if (key === "user-agent") {
      currentRule = { userAgent: value.toLowerCase(), allow: [], disallow: [] };
      rules.push(currentRule);
      return;
    }

    if (!currentRule) {
      return;
    }

    if (key === "allow") {
      currentRule.allow.push(value);
    }

    if (key === "disallow" && value) {
      currentRule.disallow.push(value);
    }
  });

  return rules;
}

function longestMatchingPath(patterns: string[], path: string) {
  return patterns
    .filter((pattern) => pattern === "/" || path.startsWith(pattern))
    .sort((a, b) => b.length - a.length)[0];
}
