import fetch from 'node-fetch';
import dotenv from "dotenv";
const API_KEY = process.env.API_KEY_URLSCAN
console.log(API_KEY)

const submit = async (url) => {
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
    console.log(data);
    return data;
}

const wait = (ms) => new Promise((res) => setTimeout(res, ms));

export const getData = async (url) => {
    // Step 1: Submit
    const scanId = await submit(url);
    const id = scanId.uuid;
    console.log("Scan ID:", id);

    // Step 2: Keep retrying until scan is complete
    for (let i = 0; i < 10; i++) {
        await wait(5000); // wait 5 seconds before each attempt

        console.log(`Attempt ${i + 1} - Fetching result...`);

        const resp = await fetch(
            `https://urlscan.io/api/v1/result/${id}/`,
            {
                method: "GET",
                headers: {
                    "API-Key": API_KEY  // fix: correct header name
                }
            }
        );

        // If 404 means scan not ready yet, keep waiting
        if (resp.status === 404) {
            console.log(`Attempt ${i + 1} - Scan not ready yet, waiting...`);
            continue;
        }

        // If success
        if (resp.status === 200) {
            const data = await resp.json();
            console.log("Scan complete:", data);
            return data;
        }
    }

    console.log("Scan did not complete in time");
    return null;
};
getData("https://testsafebrowsing.appspot.com/s/malware.html")




//checking in later 