import axios from "axios"
import dotenv from "dotenv";
const API_KEY = process.env.VIRUSSZTOTAL_API_KEY;


const wait = (ms) => new Promise((res) => setTimeout(res, ms));

export const submitURL = async (url) => {
    const res = await axios.post(
        "https://www.virustotal.com/api/v3/urls",
        `url=${encodeURIComponent(url)}`,
        {
            headers: {
                "x-apikey": API_KEY,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        }
    );
    return res.data.data.id;
};

const getResult = async (scanId) => {
    const res = await axios.get(
        `https://www.virustotal.com/api/v3/analyses/${scanId}`,
        {
            headers: {
                "x-apikey": API_KEY,
            },
        }
    );
    return res.data.data;
};

export const checkURL = async (url) => {
    try {
        console.log(`Submitting URL: ${url}`);

        // Step 1: Submit URL
        const scanId = await submitURL(url);
        console.log(`Scan ID: ${scanId}`);

        // Step 2: Poll until status is completed
        let attempt = 0;
        let result = null;

        while (attempt < 10) {
            await wait(3000); // wait 3 seconds each time

            const data = await getResult(scanId);
            const status = data.attributes.status;

            console.log(`Attempt ${attempt + 1} - Status: ${status}`);

            if (status === "completed") {
                result = data.attributes;
                break;
            }

            attempt++;
        }

        if (!result) {
            console.log("Scan did not complete in time, try again");
            return null;
        }

        const stats = result.stats;
        const threat = stats.malicious > 0 ? "MALICIOUS" : stats.suspicious > 0 ? "SUSPICIOUS" : "CLEAN";

        console.log("=".repeat(45));
        console.log(`URL         : ${url}`);
        console.log(`Result      : ${threat}`);
        console.log(`Malicious   : ${stats.malicious}`);
        console.log(`Suspicious  : ${stats.suspicious}`);
        console.log(`Harmless    : ${stats.harmless}`);
        console.log(`Undetected  : ${stats.undetected}`);
        console.log("=".repeat(45));

        return { url, threat, stats };

    } catch (error) {
        if (error.response) {
            console.log("Status Code :", error.response.status);
            console.log("Error       :", error.response.data?.error?.message || error.response.data);
        } else {
            console.log("Error:", error.message);
        }
        return null;
    }
};

// checkURL("https://testsafebrowsing.appspot.com/s/malware.html");