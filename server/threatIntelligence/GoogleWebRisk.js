import { WebRiskServiceClient } from '@google-cloud/web-risk'

// Instantiates a client
const client = new WebRiskServiceClient({
    apiKey: ""
});

async function checkUrl(urlToCheck) {
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
        }
    } catch (error) {
        console.error('Error checking URL:', error);
    }
}

checkUrl('http://www.eicar.org/download/eicar.com');


//check in later 