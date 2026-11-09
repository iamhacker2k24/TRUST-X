import { chromium } from "playwright";

export const featchWeb = async (websiteUrl) => {
    let browser = null;
    try {
        browser = await chromium.launch({
            headless: true
        });

        const page = await browser.newPage();
        await page.goto(websiteUrl, { timeout: 15000, waitUntil: "domcontentloaded" });

        const title = await page.title();
        const content = await page.content();

        return {
            title,
            contentSnippet: content.slice(0, 3000),
            status: "success"
        };
    } catch (err) {
        console.error("Playwright inspection error:", err.message);
        return {
            status: "error",
            message: err.message
        };
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};