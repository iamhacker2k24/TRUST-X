import axios from "axios"

const phiislink = async () => {
    try {
        const res = await axios.get("https://checkurl.phishtank.com/checkurl/https://verify-cs2.com/")
        console.log(res)
    } catch (error) {
        console.log(error.message)
    }
}

phiislink(0)

//sorry curent registarion is not implemet so we can not implimented this 