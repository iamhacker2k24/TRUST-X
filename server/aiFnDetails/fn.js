// OpenRouter & OpenAI standard tool schemas
const AllDomainInfos = {
    type: "function",
    function: {
        name: "AllDomainInfo",
        description: "Analyzes domain infrastructure including IP resolution, DNS records (A, MX, TXT, NS, SOA), WHOIS domain age, and subdomains to uncover brand spoofing and deceptive domain registration.",
        parameters: {
            type: "object",
            properties: {
                url: {
                    type: "string",
                    description: "The target website URL or domain name to inspect (e.g. 'paypal-security-login.com' or 'google.com')."
                }
            },
            required: ["url"]
        }
    }
};

const sslInfos = {
    type: "function",
    function: {
        name: "sslInfo",
        description: "Inspects SSL/TLS certificates (validity period, issuer, security cipher, protocol) and ASN/hosting provider details to verify HTTPS trust and detect rogue or transient certificate authorities.",
        parameters: {
            type: "object",
            properties: {
                url: {
                    type: "string",
                    description: "The target website domain or URL to inspect SSL/TLS certificates and ASN network data for (e.g. 'github.com')."
                }
            },
            required: ["url"]
        }
    }
};

const webSearch = {
    type: "function",
    function: {
        name: "websearch",
        description: "Performs real-time web search to look up consumer fraud complaints, community scam reports, and public reputation for a specific URL, brand, or suspected domain.",
        parameters: {
            type: "object",
            properties: {
                content: {
                    type: "string",
                    description: "The search query or URL keyword to investigate for scam reports and public reputation (e.g. 'is example.com legit or scam')."
                }
            },
            required: ["content"]
        }
    }
};

const webPageExtractors = {
    type: "function",
    function: {
        name: "webPageExtractor",
        description: "Extracts key highlights, text content, and stated business claims from a webpage using neural search extraction to check for suspicious promises or counterfeit information.",
        parameters: {
            type: "object",
            properties: {
                websiteUrl: {
                    type: "string",
                    description: "The full website URL to extract text highlights and webpage content from (e.g. 'https://example.com')."
                }
            },
            required: ["websiteUrl"]
        }
    }
};

const featchWebs = {
    type: "function",
    function: {
        name: "featchWeb",
        description: "Visits the website with a headless browser to fetch live HTML title, DOM content, and rendered page elements for visual spoofing and phishing clone detection.",
        parameters: {
            type: "object",
            properties: {
                websiteUrl: {
                    type: "string",
                    description: "The full website URL to visit and inspect live rendered DOM content (e.g. 'https://example.com/login')."
                }
            },
            required: ["websiteUrl"]
        }
    }
};

const threatIntelligenceInfo = {
    type: "function",
    function: {
        name: "allthreatIntelligence",
        description: "Scans the URL across multiple cybersecurity threat intelligence databases (VirusTotal, URLScan.io, McAfee SiteLookup, Google Web Risk, and local heuristic analysis) to identify confirmed malware, phishing, and blacklisted domains.",
        parameters: {
            type: "object",
            properties: {
                websiteUrl: {
                    type: "string",
                    description: "The target website URL or domain name to scan against global threat intelligence feeds and reputation databases."
                }
            },
            required: ["websiteUrl"]
        }
    }
};

export const allFn = [
    AllDomainInfos,
    sslInfos,
    webSearch,
    webPageExtractors,
    featchWebs,
    threatIntelligenceInfo
];
