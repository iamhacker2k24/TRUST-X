import { checkUrl } from "./GoogleWebRisk.js";
import { checkMcAfee } from "./McAfee.js";
import { detectSuspiciousURL } from "./nodemethode.js";
import { phiislink } from "./phislink.js";
import { getData } from "./urlscan.js";
import { checkURL } from "./virusztotal.js";


const allthreatIntelligence = async (url) => {
    console.log("working")
    // const checkUrlData = await checkUrl(url)
    const checkMcfeeData = await checkMcAfee(url)
    const detectSuspiciousURLData = await detectSuspiciousURL(url)
    const phiislinkData = await phiislink(url)
    const getDataData = await getData(url)
    const checkURLData = await checkURL(url)
    const result = {
        // checkUrlData,
        checkMcfeeData,
        detectSuspiciousURLData,
        phiislinkData,
        getDataData,
        checkURLData
    }
    // console.log(result)
    return result
}

allthreatIntelligence("https://testsafebrowsing.appspot.com/s/malware.html")

