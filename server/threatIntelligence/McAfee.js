import axios from "axios";

/**
 * McAfee SiteLookup / WebAdvisor Threat Reputation Checker
 *
 * Programmatically queries McAfee's official SiteLookup service (sitelookup.mcafee.com)
 * by initializing session cookies and tokens, submitting the single-URL verification form,
 * and extracting the live Categorization and Trust Risk Rating.
 */

const BASE_URL = "https://sitelookup.mcafee.com/en/feedback/url";

const BROWSER_HEADERS = {
    "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
    Referer: BASE_URL,
};

/**
 * Check URL/Domain reputation via McAfee SiteLookup
 * @param {string} input - URL or Domain name to check
 * @returns {Promise<Object>} Structured reputation result
 */
export const checkMcAfee = async (input) => {
    if (!input || typeof input !== "string") {
        throw new Error("A valid URL or domain is required.");
    }

    // Normalize input to hostname/domain
    let targetDomain = input.trim();
    try {
        const parsed = new URL(
            targetDomain.includes("://") ? targetDomain : `https://${targetDomain}`
        );
        targetDomain = parsed.hostname;
    } catch {
        // Keep raw string if not a standard URL
    }

    try {
        // Step 1: Initialize session and retrieve security tokens (e, c, sid)
        const sessionRes = await axios.get(BASE_URL, {
            headers: BROWSER_HEADERS,
            timeout: 20000,
        });
        const rawCookies = sessionRes.headers["set-cookie"] || [];
        const cookieHeader = rawCookies.map((c) => c.split(";")[0]).join("; ");
        const eToken = sessionRes.data.match(/name=["']e["']\s+value=["']([^"']+)["']/i)?.[1] || "";
        const cToken = sessionRes.data.match(/name=["']c["']\s+value=["']([^"']+)["']/i)?.[1] || "";
        const sidToken = sessionRes.data.match(/name=["']sid["']\s+value=["']([^"']*)["']/i)?.[1] || "";
        if (!cToken) {
            throw new Error("Failed to extract validation security token from McAfee portal.");
        }

        // Step 2: Submit single-URL lookup request
        const formParams = new URLSearchParams();
        formParams.append("action", "checksingle");
        formParams.append("url", targetDomain);
        formParams.append("e", eToken);
        formParams.append("c", cToken);
        formParams.append("sid", sidToken);
        formParams.append("p", "");

        const postRes = await axios.post(BASE_URL, formParams.toString(), {
            headers: {
                ...BROWSER_HEADERS,
                "Content-Type": "application/x-www-form-urlencoded",
                Cookie: cookieHeader,
            },
            timeout: 20000,
        });

        const html = postRes.data;

        // Step 3: Extract the result table from HTML
        const resultTableMatch = html.match(/<table\s+class=["']result-table["'][\s\S]*?<\/table>/i);

        let categories = [];
        let urlStatus = "Categorized URL";
        let trustLevel = "Minimal Risk";
        let isMalicious = false;

        if (resultTableMatch) {
            const tableHtml = resultTableMatch[0];
            // Find data rows (rows containing td tags)
            const dataRowMatch = tableHtml.match(/<tr[^>]*bgcolor=["']#ffffff["'][^>]*>([\s\S]*?)<\/tr>/i);

            if (dataRowMatch) {
                const rowContent = dataRowMatch[1];
                const cells = [...rowContent.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((m) => m[1]);

                // Cells: [0]=spacer, [1]=URL, [2]=Status, [3]=Categorization, [4]=Trust
                if (cells.length >= 5) {
                    urlStatus = cells[2].replace(/<[^>]+>/g, "").trim() || urlStatus;

                    const rawCat = cells[3]
                        .replace(/<br\s*\/?>/gi, "\n")
                        .replace(/<[^>]+>/g, " ")
                        .split("\n")
                        .map((c) => c.replace(/^-\s*/, "").trim())
                        .filter(Boolean);

                    if (rawCat.length > 0) {
                        categories = rawCat;
                    }

                    trustLevel = cells[4].replace(/<[^>]+>/g, "").trim() || trustLevel;
                }
            }
        }

        // Evaluate risk verdict
        const lowerTrust = trustLevel.toLowerCase();
        const lowerCat = categories.join(" ").toLowerCase();

        if (
            lowerTrust.includes("high risk") ||
            lowerCat.includes("malicious") ||
            lowerCat.includes("phishing") ||
            lowerCat.includes("spam")
        ) {
            isMalicious = true;
        }

        const threatStatus = isMalicious
            ? "MALICIOUS"
            : lowerTrust.includes("medium")
                ? "SUSPICIOUS"
                : "CLEAN";

        const result = {
            success: true,
            provider: "McAfee SiteLookup",
            target: targetDomain,
            status: threatStatus,
            riskLevel: trustLevel,
            urlStatus,
            categories: categories.length > 0 ? categories : ["General Web"],
            isMalicious,
            timestamp: new Date().toISOString(),
        };

        // console.log("=========================================");
        // console.log(`McAfee Target   : ${result.target}`);
        // console.log(`Result Status   : ${result.status}`);
        // console.log(`Risk Level      : ${result.riskLevel}`);
        // console.log(`URL Status      : ${result.urlStatus}`);
        // console.log(`Categories      : ${result.categories.join(", ")}`);
        // console.log(`Malicious       : ${result.isMalicious}`);
        // console.log("=========================================");
        console.log("macfee done")

        return result;
    } catch (error) {
        const errorMsg = error.response
            ? `HTTP ${error.response.status} - ${error.response.statusText}`
            : error.message;

        console.error(`[McAfee Provider Error]: ${errorMsg}`);

        return {
            success: false,
            provider: "McAfee SiteLookup",
            target: targetDomain,
            status: "UNKNOWN",
            riskLevel: "Unknown",
            categories: [],
            error: errorMsg,
            isMalicious: false,
            timestamp: new Date().toISOString(),
        };
    }
};

// Allow CLI execution with custom URL: node McAfee.js <url>
const targetUrl = process.argv[2] || "https://testsafebrowsing.appspot.com/s/malware.html";
// checkMcAfee(targetUrl);
