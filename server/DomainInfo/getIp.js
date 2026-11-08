import dns from "node:dns/promises";

export const getAddress = async (domain) => {
    console.log("getting all ip info 1pv4 and ipv6 ")
    dns.setServers(["8.8.8.8", "1.1.1.1", "8.8.4.4"]);

    const results = { ipv4: [], ipv6: [] };

    const hostname = new URL(
        domain.includes("://") ? domain : `https://${domain}`
    ).hostname;
    console.log(hostname)
    try {
        results.ipv4 = await dns.resolve4(hostname);
    } catch (error) {
        console.log("IPv4 lookup failed:", error.code);
    }

    try {
        results.ipv6 = await dns.resolve6(hostname);
    } catch (error) {
        console.log("IPv6 lookup failed:", error.code);
    }
    return results;
};
