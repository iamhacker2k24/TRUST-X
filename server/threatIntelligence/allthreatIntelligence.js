import { checkUrl } from "./GoogleWebRisk.js";
import { checkMcAfee } from "./McAfee.js";
import { detectSuspiciousURL } from "./nodemethode.js";
import { phiislink } from "./phislink.js";
import { getData } from "./urlscan.js";
import { checkURL } from "./virusztotal.js";


export const allthreatIntelligence = async (url) => {
    console.log("[ThreatIntel] Initiating multi-vector scans for:", url);
    try {
        const detectSuspiciousURLData = await detectSuspiciousURL(url);
        const checkMcfeeData = await checkMcAfee(url).catch(err => ({ status: "error", message: err.message }));
        const getDataData = await getData(url).catch(err => ({ status: "error", message: err.message }));
        const checkURLData = await checkURL(url).catch(err => ({ status: "error", message: err.message }));

        const result = {
            heuristics: detectSuspiciousURLData,
            mcAfee: checkMcfeeData,
            urlScan: getDataData,
            virusTotal: checkURLData
        };
        return result;
    } catch (err) {
        console.error("[ThreatIntel] Scan error:", err.message);
        return { error: err.message };
    }
};

// if directly run
// allthreatIntelligence("https://testsafebrowsing.appspot.com/s/malware.html")

