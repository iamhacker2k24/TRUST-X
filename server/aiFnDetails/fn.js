
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

const featchWebs = {
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

const threatIntelligenceInfo = {
    type: "function",
    name: "allthreatIntelligence",
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






export const allFn = [AllDomainInfos, sslInfos, webSearch, webPageExtractors, featchWebs, threatIntelligenceInfo];