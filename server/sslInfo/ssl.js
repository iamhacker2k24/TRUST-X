import tls from "tls";
import axios from "axios";

const getSSLDetails = (domain) => {
    return new Promise((resolve, reject) => {
        const socket = tls.connect(443, domain, { servername: domain }, () => {
            const cert = socket.getPeerCertificate(true);

            const info = {
                domain,
                isValid: socket.authorized,
                subject: cert.subject?.CN,
                issuer: cert.issuer?.O,
                validFrom: cert.valid_from,
                validTo: cert.valid_to,
                daysLeft: Math.floor((new Date(cert.valid_to) - new Date()) / (1000 * 60 * 60 * 24)),
                protocol: socket.getProtocol(),
                cipher: socket.getCipher()?.name,
                serialNumber: cert.serialNumber,
                fingerprint: cert.fingerprint,
                subjectAltNames: cert.subjectaltname,
            };

            socket.end();
            resolve(info);
        });

        socket.on("error", (err) => reject(err));
        socket.setTimeout(5000, () => reject(new Error("Connection Timeout")));
    });
};

const getSSLGrade = async (domain) => {
    try {
        const res = await axios.get(
            `https://api.ssllabs.com/api/v3/analyze?host=${domain}&publish=off&all=done`,
            { timeout: 15000 }
        );

        const data = res.data;

        return {
            status: data.status,
            grade: data.endpoints?.[0]?.grade || "N/A",
            gradeIgnoreTrust: data.endpoints?.[0]?.gradeTrustIgnored || "N/A",
            serverName: data.endpoints?.[0]?.serverName || "N/A",
            warnings: data.endpoints?.[0]?.hasWarnings || false,
        };
    } catch (error) {
        return {
            status: "FAILED",
            grade: "N/A",
            error: error.message,
        };
    }
};

export const checkSSL = async (domain) => {
    try {
        console.log(`Checking SSL/TLS for: ${domain}`);
        // console.log("=".repeat(45));

        // Run both in parallel
        const [tlsInfo, gradeInfo] = await Promise.all([
            getSSLDetails(domain),
            getSSLGrade(domain),
        ]);

        // console.log("\n--- Certificate Info ---");
        // console.log(`Domain          : ${tlsInfo.domain}`);
        // console.log(`Valid           : ${tlsInfo.isValid ? "Yes" : "No"}`);
        // console.log(`Issued To       : ${tlsInfo.subject}`);
        // console.log(`Issuer          : ${tlsInfo.issuer}`);
        // console.log(`Valid From      : ${tlsInfo.validFrom}`);
        // console.log(`Valid To        : ${tlsInfo.validTo}`);
        // console.log(`Days Left       : ${tlsInfo.daysLeft}`);
        // console.log(`Serial Number   : ${tlsInfo.serialNumber}`);
        // console.log(`Fingerprint     : ${tlsInfo.fingerprint}`);
        // console.log(`Alt Names       : ${tlsInfo.subjectAltNames}`);

        // console.log("\n--- TLS Info ---");
        // console.log(`Protocol        : ${tlsInfo.protocol}`);
        // console.log(`Cipher          : ${tlsInfo.cipher}`);

        // console.log("\n--- SSL Labs Grade ---");
        // console.log(`Status          : ${gradeInfo.status}`);
        // console.log(`Grade           : ${gradeInfo.grade}`);
        // console.log(`Grade (No Trust): ${gradeInfo.gradeIgnoreTrust}`);
        // console.log(`Server Name     : ${gradeInfo.serverName}`);
        // console.log(`Has Warnings    : ${gradeInfo.warnings}`);

        // console.log("\n--- Verification ---");
        // console.log(`SSL Valid       : ${tlsInfo.isValid ? "Verified" : "Not Verified"}`);
        // console.log(`Expiry Status   : ${tlsInfo.daysLeft > 30 ? "Good" : tlsInfo.daysLeft > 0 ? "Expiring Soon" : "Expired"}`);
        // console.log(`Grade Status    : ${gradeInfo.grade === "A+" || gradeInfo.grade === "A" ? "Strong" : "Needs Improvement"}`);

        return { tlsInfo, gradeInfo };

    } catch (error) {
        console.log("SSL Check Failed:", error.message);
        return null;
    }
};

// checkSSL("github.com");