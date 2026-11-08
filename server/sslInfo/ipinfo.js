import axios from "axios"

export const getASNInfo = async (domain) => {
    try {
        // Step 1: Get IP from domain
        const dnsRes = await axios.get(`https://dns.google/resolve?name=${domain}&type=A`);
        const ip = dnsRes.data.Answer?.[0]?.data;

        if (!ip) {
            console.log("Could not resolve IP for domain:", domain);
            return null;
        }

        // Step 2: Get ASN and ISP info from IP
        console.log("Get ASN and ISP info from IP")
        const ipRes = await axios.get(`https://ipinfo.io/${ip}/json`);
        const data = ipRes.data;

        // console.log(`Domain      : ${domain}`);
        // console.log(`IP          : ${data.ip}`);
        // console.log(`ISP         : ${data.org}`);        // includes ASN + ISP name
        // console.log(`ASN         : ${data.org?.split(" ")[0]}`);   // e.g AS15169
        // console.log(`ISP Name    : ${data.org?.split(" ").slice(1).join(" ")}`); // e.g Google LLC
        // console.log(`City        : ${data.city}`);
        // console.log(`Region      : ${data.region}`);
        // console.log(`Country     : ${data.country}`);
        // console.log(`Timezone    : ${data.timezone}`);
        // console.log(`Hostname    : ${data.hostname || "N/A"}`);


        return data;

    } catch (error) {
        console.log("Failed:", error.message);
        return null;
    }
};

getASNInfo("google.com");