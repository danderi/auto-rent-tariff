const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

async function scrapeSixt(url, location) {
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
        // Navegar a la página de Sixt
        await page.goto(url, { waitUntil: 'load', timeout: 120000 });

        // Intentamos hacer clic en el botón de aceptar cookies
        // try {
        //     const acceptCookiesButton = await page.waitForSelector('button.sc-dcJsrY.byCChc', { timeout: 30000 });
        //     if (acceptCookiesButton) {
        //         await acceptCookiesButton.click();
        //         console.log('Se hizo clic en el botón de aceptar cookies.');
        //     } else {
        //         console.error('No se encontró el botón de aceptar cookies en el tiempo esperado.');
        //     }
        // } catch (error) {
        //     console.error('Error al esperar o hacer clic en el botón de aceptar cookies:', error);
        // }

        // Hacer clic en el input para seleccionar la localidad
        await page.waitForSelector('button.sc-1609ze3-0.hNJlby.sc-1a85fbf-2.kCRFly');
        await page.click('button.sc-1609ze3-0.hNJlby.sc-1a85fbf-2.kCRFly');

        // Esperar un breve momento para que aparezca el input de búsqueda de localización
        await page.waitForTimeout(2000);

        // Ingresar la ubicación en el input de búsqueda
        const locationInput = await page.$('input[name="searchLocation"]');
        await locationInput.type(location);

        // Esperar un momento para que se actualicen las sugerencias de ubicación
        await page.waitForTimeout(2000);

        // Seleccionar la primera opción visible en la lista de sugerencias (suponiendo que es "San Carlos de Bariloche")
        await page.click('.rs-1m3oiv3.kYMdEq');

        // Puedes tomar una captura de pantalla para verificar que la ubicación se haya seleccionado correctamente
        await page.screenshot({ path: 'sixt-location-selected.png' });

        // Retornar los datos recolectados hasta ahora
        return { location };

    } catch (error) {
        console.error('Error durante la ejecución del scraper de Sixt:', error);
        return { error: 'Error durante la ejecución del scraper de Sixt' };

    } finally {
        await browser.close();
    }
}

module.exports = { scrapeSixt };
