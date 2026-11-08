import { GoogleGenAI, Type } from '@google/genai';
import 'dotenv/config'

const system_instruction = `


`

const ai = new GoogleGenAI({});


const AllDomainInfos = {
    type: "function",
    name: "AllDomainInfo",
    description: "",
    parameters: {
        type: Type.OBJECT,
        properties: {
            coin: {
                type: Type.STRING,
                description: ""
            }
        },
        require: ['url']
    }
}

const sslInfos = {
    type: "function",
    name: "sslInfo",
    description: "",
    parameters: {
        type: Type.OBJECT,
        properties: {
            coin: {
                type: Type.STRING,
                description: ""
            }
        },
        require: ['url']
    }
}

const webSearch = {
    type: "function",
    name: "websearch",
    description: "",
    parameters: {
        type: Type.OBJECT,
        properties: {
            coin: {
                type: Type.STRING,
                description: ""
            }
        },
        require: ['content']
    }
}

const webPageExtractors = {
    type: "function",
    name: "webPageExtractor",
    description: "",
    parameters: {
        type: Type.OBJECT,
        properties: {
            coin: {
                type: Type.STRING,
                description: ""
            }
        },
        require: ['websiteUrl']
    }

}

const featchWebs={
    type: "function",
    name: "featchWeb",
    description: "",
    parameters: {
        type: Type.OBJECT,
        properties: {
            coin: {
                type: Type.STRING,
                description: ""
            }
        },
        require: ['websiteUrl']
    }
}




