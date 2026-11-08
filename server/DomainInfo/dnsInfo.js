
import { getDomain } from "tldts";

const TIMEOUT = 10000;

const DNS_URL = "https://cloudflare-dns.com/dns-query";
const RDAP_BOOTSTRAP = "https://data.iana.org/rdap/dns.json";


// 1. Normalize hostname


function normalizeHostname(input) {
    if (typeof input !== "string" || !input.trim()) {
        throw new Error("Domain is required");
    }

    const value = input.trim();

    const url = new URL(
        value.includes("://") ? value : `https://${value}`
    );

    const hostname = url.hostname.toLowerCase().replace(/\.$/, "");

    if (
        !hostname.includes(".") ||
        hostname.length > 253 ||
        hostname.split(".").some(
            part => !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(part)
        )
    ) {
        throw new Error("Invalid hostname");
    }

    return {
        hostname,
        protocol: url.protocol,
        inputUrl: url
    };
}


// 2. HTTP JSON helper


async function fetchJSON(url, headers = {}) {
    const response = await fetch(url, {
        headers,
        signal: AbortSignal.timeout(TIMEOUT)
    });

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }

    return response.json();
}


// 3. DNS lookup using Cloudflare DoH


async function dnsLookup(hostname, type) {
    try {
        const url = new URL(DNS_URL);

        url.searchParams.set("name", hostname);
        url.searchParams.set("type", type);

        const data = await fetchJSON(url, {
            Accept: "application/dns-json"
        });

        const statusNames = {
            0: "NOERROR",
            1: "FORMERR",
            2: "SERVFAIL",
            3: "NXDOMAIN",
            4: "NOTIMP",
            5: "REFUSED"
        };

        return {
            type,
            status: statusNames[data.Status] || "UNKNOWN",
            answers: (data.Answer || []).map(record => ({
                name: record.name,
                type: record.type,
                ttl: record.TTL,
                value: record.data
            }))
        };
    } catch (error) {
        return {
            type,
            status: "LOOKUP_FAILED",
            error: error.message,
            answers: []
        };
    }
}


// 4. Get important DNS records


async function getDNSDetails(hostname) {
    const types = [
        "A",
        "AAAA",
        "CNAME",
        "NS",
        "MX",
        "TXT",
        "CAA",
        "SOA"
    ];

    const results = await Promise.all(
        types.map(type => dnsLookup(hostname, type))
    );

    return Object.fromEntries(
        results.map(item => [item.type, item])
    );
}


// 5. Check hostname existence


function checkHostname(dns) {
    const records = [
        ...(dns.A?.answers || []),
        ...(dns.AAAA?.answers || []),
        ...(dns.CNAME?.answers || [])
    ];

    const failures = [
        dns.A,
        dns.AAAA,
        dns.CNAME
    ].filter(item => item?.status === "LOOKUP_FAILED");

    const nxdomain = [
        dns.A,
        dns.AAAA,
        dns.CNAME
    ].some(item => item?.status === "NXDOMAIN");

    if (records.length) {
        return {
            exists: true,
            status: "RESOLVES",
            reason: "Hostname has DNS address or alias records"
        };
    }

    if (failures.length) {
        return {
            exists: null,
            status: "DNS_LOOKUP_FAILED",
            reason: "DNS provider could not complete the lookup"
        };
    }

    if (nxdomain) {
        return {
            exists: false,
            status: "HOSTNAME_NOT_FOUND",
            reason: "DNS returned NXDOMAIN"
        };
    }

    return {
        exists: false,
        status: "NO_ADDRESS_RECORD",
        reason: "No A, AAAA or CNAME record found"
    };
}


// 6. Get root domain RDAP details


async function getRDAPDetails(rootDomain) {
    try {
        const bootstrap = await fetchJSON(RDAP_BOOTSTRAP);

        const matches = [];

        for (const [tlds, urls] of bootstrap.services || []) {
            for (const tld of tlds) {
                if (
                    rootDomain === tld ||
                    rootDomain.endsWith(`.${tld}`)
                ) {
                    matches.push({
                        tld,
                        url: urls[0]
                    });
                }
            }
        }

        matches.sort((a, b) => b.tld.length - a.tld.length);

        if (!matches.length) {
            return {
                status: "UNAVAILABLE",
                reason: "No RDAP server found"
            };
        }

        const server = matches[0].url.replace(/\/+$/, "");

        const response = await fetch(
            `${server}/domain/${encodeURIComponent(rootDomain)}`,
            {
                headers: {
                    Accept: "application/rdap+json"
                },
                signal: AbortSignal.timeout(TIMEOUT)
            }
        );

        if (response.status === 404) {
            return {
                status: "NOT_REGISTERED_OR_NOT_FOUND",
                reason: "RDAP returned 404"
            };
        }

        if (!response.ok) {
            throw new Error(`RDAP HTTP ${response.status}`);
        }

        const data = await response.json();

        const events = data.events || [];

        const eventDate = (...actions) =>
            events.find(e => actions.includes(e.eventAction))
                ?.eventDate || null;

        const registrar = (data.entities || []).find(
            entity => entity.roles?.includes("registrar")
        );

        const registrarName =
            registrar?.vcardArray?.[1]?.find(
                item => item[0] === "fn"
            )?.[3] || null;

        return {
            status: "FOUND",
            domain: data.ldhName,
            registrar: registrarName,
            registered: eventDate("registration"),
            expires: eventDate("expiration"),
            updated: eventDate("last changed"),
            statusCodes: data.status || [],
            nameservers: (data.nameservers || []).map(
                ns => ns.ldhName
            ),
            dnssec: data.secureDNS?.delegationSigned ?? null
        };
    } catch (error) {
        return {
            status: "LOOKUP_FAILED",
            error: error.message
        };
    }
}


// 7. Website HTTP and security headers


async function getWebsiteDetails(hostname) {
    const headersToCheck = [
        "content-security-policy",
        "strict-transport-security",
        "x-content-type-options",
        "x-frame-options",
        "referrer-policy",
        "permissions-policy"
    ];

    try {
        const response = await fetch(`https://${hostname}`, {
            method: "GET",
            redirect: "follow",
            signal: AbortSignal.timeout(TIMEOUT),
            headers: {
                "User-Agent": "DomainSecurityChecker/1.0"
            }
        });

        const headers = {};

        for (const name of headersToCheck) {
            headers[name] = response.headers.get(name);
        }

        const result = {
            reachable: true,
            statusCode: response.status,
            finalUrl: response.url,
            https: response.url.startsWith("https://"),
            securityHeaders: headers,
            missingHeaders: headersToCheck.filter(
                name => !headers[name]
            )
        };

        await response.body?.cancel();

        return result;
    } catch (error) {
        return {
            reachable: false,
            error: error.message,
            securityHeaders: null
        };
    }
}


// 8. Main security information function


export async function checkDomain(input) {
    const { hostname } = normalizeHostname(input);

    const rootDomain = getDomain(hostname);

    if (!rootDomain) {
        throw new Error("Could not identify registered root domain");
    }

    const [dns, registration] = await Promise.all([
        getDNSDetails(hostname),
        getRDAPDetails(rootDomain)
    ]);

    const hostnameCheck = checkHostname(dns);

    // Do not make an HTTP request if DNS cannot resolve.
    const website =
        hostnameCheck.exists === true
            ? await getWebsiteDetails(hostname)
            : {
                reachable: null,
                reason: "Skipped because hostname does not resolve"
            };

    return {
        success: true,

        input: hostname,

        domain: {
            hostname,
            rootDomain,
            isSubdomain: hostname !== rootDomain
        },

        hostnameCheck,

        registration,

        dns,

        website,

        checkedAt: new Date().toISOString()
    };
}


// 9. Test


// const result = await checkDomain("dev.google.com");

// console.log(JSON.stringify(result, null, 2));