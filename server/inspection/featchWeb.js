import axios from "axios"

// const featchWebsite = async () => {

//     const res = await axios.get("")
//     console.log(res.data)

// }



// featchWebsite()

import { chromium } from "playwright";

const browser = await chromium.launch({
    headless: true
});

const page = await browser.newPage();

await page.goto("https://itz-dev.vercel.app/");

console.log(await page.title());

console.log(await page.content());

await page.waitForTimeout(10000);

await browser.close();