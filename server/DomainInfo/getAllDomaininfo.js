import { checkDomain } from "./dnsInfo.js";
import { getAddress } from "./getIp.js";
import { getSubdomain } from "./getSubdomain.js";


const AllDomainInfo = async (url) => {
    try {

        const ipInfo = await getAddress(url)
        const DnsInfo = await checkDomain(url)
        const subdomain = await getSubdomain(url)
        const results = { ipInfo, DnsInfo, subdomain };

        console.log(results)

    } catch (error) {
        console.log(error.message)
    }
}

AllDomainInfo("google.com")