import dotenv from "dotenv";
dotenv.config();
import Exa from "exa-js";

const api = process.env.EXA_API_KEY
const exa = new Exa(api);

const webSerach = async (ques) => {
    const result = await exa.search(ques, {
        type: "auto",
        numResults: 10,
        contents: {
            highlights: {
                maxCharacters: 2000
            }
        }
    });

    console.log(result.results)

}


webSerach("what is  ai ")