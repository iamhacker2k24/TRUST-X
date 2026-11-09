import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

/**
 * Build authentication headers for Pinata.
 * Supports modern Pinata JWT (recommended) OR Pinata API Key + Secret.
 */
function getPinataHeaders(isFormData = false) {
    const jwt = process.env.PINATA_JWT;
    const apiKey = process.env.PINATA_API_KEY;
    const apiSecret = process.env.PINATA_API_SECRET;

    const headers = {};

    if (jwt) {
        // Modern Pinata Bearer JWT Authentication
        headers["Authorization"] = `Bearer ${jwt.trim()}`;
    } else if (apiKey && apiSecret) {
        // Classic Pinata API Key + Secret Authentication
        headers["pinata_api_key"] = apiKey.trim();
        headers["pinata_secret_api_key"] = apiSecret.trim();
    } else {
        throw new Error(
            "Pinata credentials missing. Please set PINATA_JWT or (PINATA_API_KEY and PINATA_API_SECRET) in server/.env"
        );
    }

    if (!isFormData) {
        headers["Content-Type"] = "application/json";
    }

    return headers;
}

/**
 * 1. Test Pinata API Authentication
 * Verifies if the provided Pinata credentials are valid.
 * 
 * @returns {Promise<{success: boolean, message: string}>}
 */
export async function testPinataAuthentication() {
    try {
        const headers = getPinataHeaders();
        const response = await axios.get("https://api.pinata.cloud/data/testAuthentication", {
            headers
        });

        console.log("[Pinata Auth Success]:", response.data.message);
        return {
            success: true,
            message: response.data.message || "Authenticated with Pinata successfully."
        };
    } catch (err) {
        const errMsg = err.response?.data?.error?.details || err.response?.data?.message || err.message;
        console.error("[Pinata Auth Error]:", errMsg);
        return {
            success: false,
            message: errMsg
        };
    }
}

/**
 * 2. Upload JSON Data / Audit Report to Pinata IPFS
 * Pins any JSON object directly to IPFS without creating a local disk file.
 * 
 * @param {object} jsonData - The audit report or threat intelligence object to pin
 * @param {object} [options]
 * @param {string} [options.name] - Custom file name identifier for Pinata dashboard
 * @param {object} [options.metadata] - Custom key-value tags (e.g. { target: 'example.com', scanId: '123' })
 * @param {number} [options.cidVersion=1] - 0 (Qm...) or 1 (bafy...)
 * 
 * @returns {Promise<{success: boolean, ipfsHash: string, pinSize: number, timestamp: string, gatewayUrl: string}>}
 */
export async function uploadJsonToPinata(jsonData, options = {}) {
    try {
        const headers = getPinataHeaders();

        const reportName = options.name || `trustx-audit-${Date.now()}`;
        const keyvalues = options.metadata || {};

        const payload = {
            pinataContent: jsonData,
            pinataMetadata: {
                name: reportName,
                keyvalues: {
                    service: "TRUST-X-Guardian",
                    uploadedAt: new Date().toISOString(),
                    ...keyvalues
                }
            },
            pinataOptions: {
                cidVersion: options.cidVersion !== undefined ? options.cidVersion : 1
            }
        };

        const response = await axios.post("https://api.pinata.cloud/pinning/pinJSONToIPFS", payload, {
            headers
        });

        const { IpfsHash, PinSize, Timestamp } = response.data;

        // Custom dedicated gateway or fallback to public Pinata gateway
        const gatewayDomain = process.env.PINATA_GATEWAY 
            ? process.env.PINATA_GATEWAY.replace(/^https?:\/\//, "").replace(/\/$/, "")
            : "gateway.pinata.cloud";

        const gatewayUrl = `https://${gatewayDomain}/ipfs/${IpfsHash}`;

        console.log(`[Pinata Upload Success] IPFS CID: ${IpfsHash} | Size: ${PinSize} bytes`);

        return {
            success: true,
            ipfsHash: IpfsHash,
            pinSize: PinSize,
            timestamp: Timestamp,
            gatewayUrl
        };
    } catch (err) {
        const errMsg = err.response?.data?.error?.details || err.response?.data?.error || err.message;
        console.error("[Pinata JSON Upload Failed]:", errMsg);
        return {
            success: false,
            error: errMsg
        };
    }
}

/**
 * 3. Unpin / Remove Content from Pinata IPFS
 * 
 * @param {string} ipfsHash - The IPFS CID hash to unpin
 * @returns {Promise<{success: boolean, message?: string, error?: string}>}
 */
export async function unpinFromPinata(ipfsHash) {
    try {
        const headers = getPinataHeaders();
        await axios.delete(`https://api.pinata.cloud/pinning/unpin/${ipfsHash}`, {
            headers
        });

        console.log(`[Pinata Unpin Success] Removed CID: ${ipfsHash}`);
        return {
            success: true,
            message: `Successfully unpinned ${ipfsHash}`
        };
    } catch (err) {
        const errMsg = err.response?.data?.error?.details || err.message;
        console.error("[Pinata Unpin Error]:", errMsg);
        return {
            success: false,
            error: errMsg
        };
    }
}

export default {
    testPinataAuthentication,
    uploadJsonToPinata,
    unpinFromPinata
};

