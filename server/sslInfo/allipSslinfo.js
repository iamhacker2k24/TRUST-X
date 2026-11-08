import { getASNInfo } from "./ipinfo.js";
import { checkSSL } from "./ssl.js";



const allipSslinfo = async (domain) => {
    const sslInfo = await checkSSL(domain)
    const getASN = await getASNInfo(domain)
    const result = { sslInfo, getASN }
    console.log(result)
    return result
}



allipSslinfo("github.com")