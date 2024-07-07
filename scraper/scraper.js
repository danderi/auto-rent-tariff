const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// Usa el plugin stealth para evitar ser detectado
puppeteer.use(StealthPlugin());

(async () => {
    const browser = await puppeteer.launch({
        headless: false,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', 
            '--disable-gpu'
        ]
    });

    const page = await browser.newPage();

    // Establecer el agente de usuario
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Establecer un viewport para simular una ventana de navegador
    await page.setViewport({ width: 1280, height: 800 });

    // Configurar el manejo de errores y capturar cualquier mensaje de la consola del navegador
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('error', err => console.error('PAGE ERROR:', err));
    page.on('pageerror', pageErr => console.error('PAGE ERROR:', pageErr));

    try {
        await page.goto('https://www.localiza.com/argentina/es-ar', { waitUntil: 'load', timeout: 120000 });

        // Esperar a que el campo de localidad esté disponible
        console.log('Esperando el campo de localidad...');
        await page.waitForSelector('input[formcontrolname="searchValue"]', { visible: true, timeout: 60000 });
        console.log('Campo de localidad encontrado');

        // Hacer clic en el campo de entrada
        await page.click('input[formcontrolname="searchValue"]');
        console.log('Campo de localidad clicado');

        // Esperar un segundo antes de escribir
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Escribir la localidad en el campo de input
        const location = 'Centro Bariloche';
        await page.type('input[formcontrolname="searchValue"]', location);
        console.log(`Localidad "${location}" escrita en el campo de input`);

        // Esperar unos segundos para que se carguen los resultados
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Esperar a que la opción deseada esté disponible
        console.log('Esperando la opción de localidad...');
        await page.waitForSelector('span.places-list__item__name', { visible: true, timeout: 60000 });
        console.log('Opción de localidad encontrada');

        // Hacer clic en la opción deseada
        await page.click('span.places-list__item__name');
        console.log(`Opción de localidad "${location}" seleccionada`);

        // Esperar 3 segundos para observar la selección
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Esperar a que el campo de fecha de retiro esté disponible
        console.log('Esperando el campo de fecha de retiro...');
        await page.waitForSelector('input[formcontrolname="pickupDate"]', { visible: true, timeout: 60000 });
        console.log('Campo de fecha de retiro encontrado');

        // Hacer clic en el campo de fecha de retiro
        await page.click('input[formcontrolname="pickupDate"]');
        console.log('Campo de fecha de retiro clicado');

        // Esperar a que el calendario esté disponible
        console.log('Esperando que el calendario esté disponible...');
        await page.waitForSelector('button.mat-calendar-period-button', { visible: true, timeout: 60000 });
        console.log('Botón para ver el calendario de año clicado');

        // Agregar más tiempo de espera para asegurar que el calendario esté completamente cargado
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Verificar el mes actual
        const currentMonth = await page.$eval('button.mat-calendar-period-button span.mat-button-wrapper span[id^="mat-calendar-button', el => el.textContent.trim());
        console.log(`Mes actual: ${currentMonth}`);

        if (currentMonth !== 'JUL 2024') {
            console.log('Cambiando al mes deseado...');
            while (true) {
                await page.click('button.mat-calendar-next-button');
                await new Promise(resolve => setTimeout(resolve, 500));
                const newMonth = await page.$eval('span[id^="mat-calendar-button"]', el => el.textContent.trim());
                console.log(`Nuevo mes actual: ${newMonth}`);
                if (newMonth === 'JUL 2024') {
                    break;
                }
            }
        }

        // Hacer clic en el día deseado
        await page.click('div.mat-calendar-body-cell-content.mat-focus-indicator:contains("5")');
        console.log('Fecha de retiro seleccionada');
    } catch (error) {
        console.error('Error durante la ejecución del script:', error);
    } finally {
        await browser.close();
    }
})();
