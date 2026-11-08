import dotenv from "dotenv";
dotenv.config();
import Exa from "exa-js";
const exa = new Exa('');


const webpageextrator = async ([url]) => {
    try {
        const result = await exa.getContents(
            [url],
            {
                highlights: {
                    query: "enterprise plan features and pricing",
                },
            },
        );

        console.log(result.results[0].highlights);
        return result.results[0].highlights

    } catch (error) {
        console.log(error.message)
    }
}
webpageextrator(["https://itz-dev.vercel.app/"])