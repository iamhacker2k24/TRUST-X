import axios from "axios"

//we using  subdomainfinder website api for getting subdomain
export const getSubdomain = async (url) => {

    // Add protocol if missing
    if (!url.startsWith("http")) {
        url = "https://" + url;
    }

    const hostname = new URL(url).hostname; // "dev.versel.com"
    const parts = hostname.split(".");       // ["dev", "versel", "com"]

    // Get last 2 parts => "versel.com"
    const domain = parts.slice(-2).join(".");


    try {
        console.log(domain)
        const result = await axios.get(`https://api.subdomainfinder.in/?domain=${domain}`)
        const subdomains = result.data.data

        // Get first 20 or less if not enough
        const first20 = subdomains.slice(0, 20)

        console.log(first20)
        return first20
    } catch (error) {
        console.log(error.message)
    }
}
// getDomain("dev.google.app")
