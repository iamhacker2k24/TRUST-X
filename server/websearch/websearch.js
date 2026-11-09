import dotenv from "dotenv";
dotenv.config();
import Exa from "exa-js";

const api = process.env.EXA_API_KEY
const exa = new Exa(api);

export const webSerach = async (ques) => {
    try {
        const result = await exa.search(ques, {
            type: "auto",
            numResults: 5,
            contents: {
                highlights: {
                    maxCharacters: 2000
                }
            }
        });
        return result.results || [];
    } catch (err) {
        console.error("Exa search error:", err.message);
        return [];
    }
};

// webSerach("what is ai")