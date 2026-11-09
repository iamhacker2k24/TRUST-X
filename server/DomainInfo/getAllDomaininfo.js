import { checkDomain } from "./dnsInfo.js";
import { getAddress } from "./getIp.js";
import { getSubdomain } from "./getSubdomain.js";


export const AllDomainInfo = async (url) => {
    try {
        console.log("all ip detils featc working...........")
        const ipInfo = await getAddress(url)
        const DnsInfo = await checkDomain(url)
        const subdomain = await getSubdomain(url)
        const results = { ipInfo, DnsInfo, subdomain };
        console.log(results)
        return results

    } catch (error) {
        console.log(error.message)
    }
}

// AllDomainInfo("google.com")