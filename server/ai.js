import { GoogleGenAI } from '@google/genai';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Ensure .env is loaded reliably
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Import tool definitions
import { allFn } from './aiFnDetails/fn.js';

// Import actual tool implementations
import { AllDomainInfo } from './DomainInfo/getAllDomaininfo.js';
import { allipSslinfo } from './sslInfo/allipSslinfo.js';
import { webSerach } from './websearch/websearch.js';
import { webpageextrator } from './websearch/webPageExtractor.js';
import { featchWeb } from './inspection/featchWeb.js';
import { allthreatIntelligence } from './threatIntelligence/allthreatIntelligence.js';

const system_instruction = `
You are the TRUST-X AI Threat Intelligence & Scam Protection Agent — an expert autonomous cybersecurity auditor analyzing URLs, domains, IPs, and web targets.

### FORENSIC TOOLS AT YOUR DISPOSAL:
1. **allthreatIntelligence**: Scans across global threat intelligence engines (VirusTotal, URLScan.io, McAfee SiteLookup, local heuristic rules) for active malware, phishing campaigns, and blacklists.
2. **AllDomainInfo**: Inspects DNS records, WHOIS registration date, domain age, subdomains, and IP addresses to detect lookalike domains, brand spoofing, and newly-registered disposable infrastructure.
3. **sslInfo**: Inspects SSL/TLS certificates (issuer, validity window, cipher strength) and Autonomous System Number (ASN) / hosting ISP to detect free/rogue certificates and bulletproof hosting.
4. **websearch**: Searches the live web via Exa for public scam reports, consumer fraud complaints, community leak alerts, or fraudulent business warnings.
5. **webPageExtractor**: Extracts visible text claims, business guarantees, contact numbers, and corporate promises directly from the target page.
6. **featchWeb**: Safely renders the target page via a headless browser to inspect DOM elements, titles, and detect deceptive login clones or hidden redirect scripts.

### INVESTIGATION INSTRUCTIONS:
- When a user asks you to inspect a target, invoke the forensic tools necessary to gather concrete technical evidence (e.g., threat intelligence, domain/IP info, SSL validity, and public scam searches).
- Do not invent or assume data without tool verification.
- Cross-correlate findings: a new domain (<30 days), lack of reputable SSL, positive virus detections, or scam complaints indicate an immediate HIGH RISK / SCAM.

### OUTPUT REQUIREMENT (CRITICAL):
Your final response MUST BE STRICTLY VALID JSON. Do not wrap it in markdown code blocks (\`\`\`json), do not include conversational filler, greetings, or text before/after the JSON. Return only the JSON object following this exact schema:

{
  "target": "<target_url_or_domain>",
  "trustScore": <number between 0 and 100>,
  "riskLevel": "<SAFE | SUSPICIOUS | DANGEROUS | CRITICAL>",
  "summary": "<1-2 sentence executive verdict>",
  "threatVectors": {
    "phishing": {
      "score": <0-100>,
      "status": "<Clean | Suspicious | Malicious>",
      "details": "<Evidence from threat feeds>"
    },
    "malware": {
      "score": <0-100>,
      "status": "<Clean | Suspicious | Malicious>",
      "details": "<Evidence from VirusTotal/URLScan>"
    },
    "webSecurity": {
      "score": <0-100>,
      "status": "<Secure | Warning | Insecure>",
      "details": "<Evidence from heuristics and DOM inspection>"
    },
    "sslCertificate": {
      "score": <0-100>,
      "status": "<Valid | Untrusted | Expired | Missing>",
      "details": "<Issuer, validity, ASN network data>"
    },
    "domainIntegrity": {
      "score": <0-100>,
      "status": "<Established | Newly Registered | Spoofed>",
      "details": "<Age, DNS, subdomains>"
    }
  },
  "technicalDetails": {
    "ipAddress": "<Resolved IP or unknown>",
    "asn": "<ASN / Host organization>",
    "domainAge": "<Calculated age or registration date>",
    "sslIssuer": "<Certificate Authority>",
    "threatEnginesFlagged": <number of detection engines flagged>
  },
  "redFlags": [
    "<List of specific forensic red flags discovered>"
  ],
  "recommendation": "<Direct, actionable user advice (e.g. Block site, proceed with caution, etc.)>"
}
`;

const ai = new GoogleGenAI({
    apiKey: process.env.GEN_API_KEY || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY,
    apiVersion: 'v1beta'
});

const tools = allFn;

export async function analyzeTarget(text) {
    try {
        console.log(`\n[AI Guardian] Initiating investigation for: "${text}"`);

        const interaction = await ai.interactions.create({
            model: "gemini-2.5-flash",
            input: text,
            system_instruction,
            tools,
            store: false
        });

        // Find all function calls requested by Gemini
        const calls = interaction.steps?.filter(
            step => step.type === "function_call"
        ) || [];

        if (calls.length === 0) {
            console.log("\n[Gemini Raw Response]:\n", interaction.output_text);
            return cleanJsonResponse(interaction.output_text);
        }

        console.log(`\n[Tools Requested]: ${calls.map(c => c.name).join(", ")}`);

        // Execute each requested tool and format results
        const functionResultSteps = [];

        for (const call of calls) {
            console.log(`\n[Executing Tool]: ${call.name}`);
            let result;

            try {
                switch (call.name) {
                    case "AllDomainInfo":
                        result = await AllDomainInfo(call.arguments.url || text);
                        break;

                    case "sslInfo":
                        result = await allipSslinfo(call.arguments.url || text);
                        break;

                    case "websearch":
                        result = await webSerach(call.arguments.content || text);
                        break;

                    case "webPageExtractor":
                        result = await webpageextrator(call.arguments.websiteUrl || text);
                        break;

                    case "featchWeb":
                        result = await featchWeb(call.arguments.websiteUrl || text);
                        break;

                    case "allthreatIntelligence":
                        result = await allthreatIntelligence(call.arguments.websiteUrl || text);
                        break;

                    default:
                        result = { error: `Unknown tool: ${call.name}` };
                }
            } catch (toolErr) {
                console.error(`[Tool Error in ${call.name}]:`, toolErr.message);
                result = { error: toolErr.message };
            }

            console.log(`[Tool Complete]: ${call.name}`);

            functionResultSteps.push({
                type: "function_result",
                name: call.name,
                call_id: call.id,
                result: JSON.stringify(result)
            });
        }

        // Build history with user input, model tool requests, and function results
        const history = [
            {
                type: "user_input",
                content: [{
                    type: "text",
                    text
                }]
            },
            ...interaction.steps,
            ...functionResultSteps
        ];

        // Send results back to Gemini for final synthesized JSON report
        const finalResponse = await ai.interactions.create({
            model: "gemini-2.5-flash",
            input: history,
            system_instruction,
            tools,
            store: false
        });

        // Extract text output from response
        let rawOutput = finalResponse.output_text;
        if (!rawOutput && finalResponse.steps) {
            for (const step of finalResponse.steps) {
                if (step.text) {
                    rawOutput = (rawOutput ? rawOutput + "\n" : "") + step.text;
                } else if (Array.isArray(step.content)) {
                    for (const c of step.content) {
                        if (c.text) {
                            rawOutput = (rawOutput ? rawOutput + "\n" : "") + c.text;
                        }
                    }
                }
            }
        }

        const jsonReport = cleanJsonResponse(rawOutput);
        console.log("\n[Final Verified JSON Audit]:\n", JSON.stringify(jsonReport, null, 2));
        return jsonReport;

    } catch (err) {
        console.error("[AI Guardian Error]:", err.message);
        return {
            status: "error",
            message: err.message
        };
    }
}

// Utility to ensure clean JSON output without markdown backticks
function cleanJsonResponse(rawText) {
    if (!rawText) return { status: "error", message: "Empty model output" };

    try {
        let cleaned = rawText.trim();
        // Remove markdown ```json ... ``` fences if present
        if (cleaned.startsWith("```json")) {
            cleaned = cleaned.slice(7);
        } else if (cleaned.startsWith("```")) {
            cleaned = cleaned.slice(3);
        }
        if (cleaned.endsWith("```")) {
            cleaned = cleaned.slice(0, -3);
        }
        cleaned = cleaned.trim();

        return JSON.parse(cleaned);
    } catch {
        // If parsing fails, wrap raw output
        return {
            status: "raw",
            output: rawText
        };
    }
}

// Test when run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    analyzeTarget("Check if https://testsafebrowsing.appspot.com/s/malware.html is safe");
}
