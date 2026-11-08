import { URL } from "node:url";
import { isIP } from "node:net";

export function detectSuspiciousURL(input) {
    let score = 0;
    const reasons = [];

    let parsed;

    try {
        parsed = new URL(
            input.includes("://") ? input : `https://${input}`
        );
    } catch {
        return {
            status: "invalid",
            riskScore: 100,
            reasons: ["Invalid URL"]
        };
    }

    const hostname = parsed.hostname.toLowerCase();
    const fullURL = parsed.href.toLowerCase();

    // 1. IP address instead of domain
    if (isIP(hostname)) {
        score += 25;
        reasons.push("Website uses an IP address instead of a domain");
    }

    // 2. Suspicious characters
    if (hostname.includes("@")) {
        score += 25;
        reasons.push("Suspicious @ character in hostname");
    }

    // 3. Punycode domain
    if (hostname.includes("xn--")) {
        score += 20;
        reasons.push("Internationalized/Punycode domain detected");
    }

    // 4. Too many subdomains
    const subdomains = hostname.split(".");

    if (subdomains.length >= 5) {
        score += 15;
        reasons.push("Unusually high number of subdomains");
    }

    // 5. Suspicious keywords
    const keywords = [
        "login",
        "verify",
        "account",
        "secure",
        "update",
        "banking",
        "wallet",
        "password",
        "signin",
        "free-gift",
        "claim-prize"
    ];

    const matched = keywords.filter(keyword =>
        hostname.includes(keyword)
    );

    if (matched.length >= 2) {
        score += 20;
        reasons.push(
            `Multiple suspicious keywords: ${matched.join(", ")}`
        );
    }

    // 6. Long URL
    if (fullURL.length > 150) {
        score += 10;
        reasons.push("Unusually long URL");
    }

    // 7. HTTP instead of HTTPS
    if (parsed.protocol === "http:") {
        score += 10;
        reasons.push("Website does not use HTTPS");
    }

    // 8. Suspicious URL encoding
    if (/%[0-9a-f]{2}/i.test(parsed.pathname)) {
        score += 5;
        reasons.push("URL contains encoded characters");
    }

    score = Math.min(score, 100);

    let status = "low-risk";

    if (score >= 60) {
        status = "high-risk";
    } else if (score >= 30) {
        status = "suspicious";
    }

    return {
        url: parsed.href,
        domain: hostname,
        status,
        riskScore: score,
        reasons
    };
}

// Test

//this is not corect of bets approach ok just for intitial 
console.log(
    detectSuspiciousURL("http://example.xyz")
);