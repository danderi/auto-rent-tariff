const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

async function scrapeSixt(url, location) {
    puppeteer.use(StealthPlugin());

    const browser = await puppeteer.launch({
        headless: false, // Cambiar a true si no necesitas ver el navegador
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // Puede causar problemas en algunos casos, eliminar si es necesario
            '--disable-gpu'
        ]
    });

    const page = await browser.newPage();

    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.setViewport({ width: 1280, height: 800 });

    try {
        console.log(`Navigating to Sixt page: ${url}`);
        await page.goto(url, { waitUntil: 'load', timeout: 120000 });
        console.log('Successfully navigated to Sixt page.');

        // Esperar a que el body tenga la clase "overflowHidden"
        await page.waitForFunction(() => document.body.classList.contains('overflowHidden'));
        console.log('Body has class "overflowHidden". Proceeding...');

        // Simular presionar la tecla Tab varias veces para llegar al botón "ACEPTO"
        for (let i = 0; i < 4; i++) {
            await page.keyboard.press('Tab');
            await new Promise(resolve => setTimeout(resolve, 1000)); // Esperar un segundo después de cada presión de Tab
        }

        // Hacer clic en el botón "ACEPTO"
        await page.keyboard.press('Enter'); // Suponiendo que Enter activa el botón "ACEPTO"
        console.log('Se hizo clic en el botón "ACEPTO" para aceptar todas las cookies.');

        // Aquí puedes agregar el resto del código para seleccionar la localidad, etc.
        // ...

        await new Promise(resolve => setTimeout(resolve, 5000));

    } catch (error) {
        console.error('Error durante la ejecución del scraper de Sixt:', error);
        return { error: 'Error durante la ejecución del scraper de Sixt' };

    } finally {
        await browser.close();
        console.log('Browser closed.');
    }
}

module.exports = { scrapeSixt };
