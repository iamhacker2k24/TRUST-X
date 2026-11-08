import axios from "axios"


export const getSubdomain = async (url) => {

    // Aadding protocol if missing 
    if (!url.startsWith("http")) {
        url = "https://" + url;
    }
    const hostname = new URL(url).hostname; // "dev.versel.com"
    const parts = hostname.split(".");       // ["dev", "versel", "com"]
    // getting only domain of versel type apps 
    const domain = parts.slice(-2).join(".");


    try {
        console.log(domain)
        const result = await axios.get(`https://api.subdomainfinder.in/?domain=${domain}`)
        const subdomains = result.data.data

        // Get first 20 or less if not enough as versel type returning too much subdomain 
        const first20 = subdomains.slice(0, 20)

        // console.log(first20)


        return first20
    } catch (error) {
        console.log(error.message)
    }
}
// getDomain("dev.google.app")
