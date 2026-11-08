import { WebRiskServiceClient } from '@google-cloud/web-risk'
import dotenv from "dotenv";
// Instantiates a client
const client = new WebRiskServiceClient({
    apiKey: process.env.GOOGLE_API_KEY
});

export async function checkUrl(urlToCheck) {
    const request = {
        uri: urlToCheck,
        threatTypes: ['MALWARE', 'SOCIAL_ENGINEERING', 'UNWANTED_SOFTWARE'],
    };

    try {
        // Call the SearchUris API
        const [response] = await client.searchUris(request);

        if (response.threat) {
            console.log(`⚠️ Threat detected! Type: ${response.threat.threatTypes}`);
        } else {
            console.log('✅ URL is clean.');
        } return response.threat.threatTypes
    } catch (error) {
        console.error('Error checking URL:', error);
    }
}

// checkUrl('http://www.eicar.org/download/eicar.com');


//check in later 