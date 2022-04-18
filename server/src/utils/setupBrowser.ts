import { Browser, LaunchOptions, Page } from "puppeteer";
import puppeteer from 'puppeteer';

async function setupBrowser(options?: LaunchOptions): Promise<{ page: Page; browser: Browser }> {
    const browser = await puppeteer.launch({
        ...options, headless: true,
        args: ["--no-sandbox", "--disable-setupid-sandbox"]
    });

    const page = (await browser.pages())[0];

    await page.setRequestInterception(true);
    page.on('request', (ev) => {
        if (ev.resourceType() === 'image') {
            ev.abort()
        } else {
            ev.continue()
        }
    })

    return { page, browser }
}

export default setupBrowser