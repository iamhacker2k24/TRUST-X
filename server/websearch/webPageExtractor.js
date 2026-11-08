import dotenv from "dotenv";
dotenv.config();
import Exa from "exa-js";
const exa = new Exa('21f669cd-76ee-42b4-aa3b-735ac05c240e');


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