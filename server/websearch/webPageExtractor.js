import dotenv from "dotenv";
dotenv.config();
import Exa from "exa-js";
const exa = new Exa(process.env.EXA_API_KEY);

export const webpageextrator = async (url) => {
    try {
        const targetUrl = Array.isArray(url) ? url : [url];
        const result = await exa.getContents(
            targetUrl,
            {
                highlights: {
                    query: "about company services contact features",
                },
            },
        );

        return result?.results?.[0]?.highlights || [];
    } catch (error) {
        console.error("Exa extractor error:", error.message);
        return [];
    }
};

// webpageextrator(["https://itz-dev.vercel.app/"])