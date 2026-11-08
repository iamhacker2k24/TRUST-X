import fetch from 'node-fetch';
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Ensure .env is loaded regardless of which directory node is executed from
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const API_KEY = process.env.API_KEY_URLSCAN;
console.log("Loaded API_KEY:", API_KEY ? `${API_KEY.slice(0, 8)}...` : "UNDEFINED");

const submit = async (url) => {
    if (!API_KEY) {
        throw new Error("Missing API_KEY_URLSCAN in environment variables (.env)");
    }

    const resp = await fetch(
        `https://urlscan.io/api/v1/scan`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': API_KEY
            },
            body: JSON.stringify({
                url: url,
                visibility: 'public',
                country: 'de',
                tags: [
                    'iloveurlscan',
                    'testing'
                ]
            })
        }
    );
    const data = await resp.json();
    return data;
};

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

export const getData = async (url) => {
    try {
        // Step 1: Submit URL to scan
        const scanResponse = await submit(url);

        if (!scanResponse || !scanResponse.uuid) {
            console.error("URLScan Submission Failed:", scanResponse);
            return {
                status: "error",
                message: scanResponse?.message || "Failed to submit URL to urlscan.io",
                details: scanResponse
            };
        }

        const id = scanResponse.uuid;
        console.log("Scan submitted successfully! Scan ID:", id);

        // Step 2: Keep polling until scan is complete (urlscan usually takes 10-25 seconds)
        for (let i = 0; i < 12; i++) {
            await wait(4000); // wait 4 seconds before checking

            console.log(`Attempt ${i + 1} - Fetching result...`);

            const resp = await fetch(
                `https://urlscan.io/api/v1/result/${id}/`,
                {
                    method: "GET",
                    headers: {
                        "api-key": API_KEY
                    }
                }
            );

            // If 404, the scan is still running on urlscan.io, wait and retry
            if (resp.status === 404) {
                console.log(`Attempt ${i + 1} - Scan still processing, waiting...`);
                continue;
            }

            // If success
            if (resp.status === 200) {
                const data = await resp.json();
                console.log("urlscan complete successfully!");
                return data;
            }

            // If rate limited or other error
            if (resp.status === 429) {
                console.warn("URLScan Rate limit reached, retrying...");
                await wait(5000);
            }
        }

        console.log("Scan did not complete in time");
        return { status: "pending", uuid: id };
    } catch (err) {
        console.error("URLScan error:", err.message);
        return { status: "error", message: err.message };
    }
};

// Test if executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    getData("https://testsafebrowsing.appspot.com/s/malware.html");
} 