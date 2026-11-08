import axios from "axios"

const checkMcAfee = async (url) => {
    try {
        const domain = new URL(url).hostname;

        const res = await axios.get(
            `https://www.mcafee.com/en-us/consumer-threat-research/lookup.html?url=${domain}`,
            {
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
                }
            }
        );

        console.log("McAfee Response:", res.data);
        return res.data;

    } catch (error) {
        console.log("Failed:", error.message);
    }
};

checkMcAfee("https://google.com");