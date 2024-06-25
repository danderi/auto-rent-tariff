const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('https://www.hertz.com.ar');

    console.log('Esperando dropdown de selección de lugar...');
    await page.waitForSelector('.css-1hwfws3', { visible: true, timeout: 60000 });
    console.log('Dropdown de selección de lugar encontrado');
    await page.click('.css-1hwfws3');
    console.log('Dropdown de selección de lugar clicado');

    console.log('Esperando que las opciones se carguen...');
    await new Promise(resolve => setTimeout(resolve, 3000)); // Esperar 3 segundos

    const options = await page.$$eval('.css-fk865s-option, .css-1kti9hw-option', options => options.map(option => option.textContent.trim()));
    console.log('Opciones disponibles:', options);

    const desiredLocation = 'Bariloche Centro'; // Cambia esta línea por la localidad deseada
    const optionIndex = options.indexOf(desiredLocation);
    console.log(`Índice de "${desiredLocation}":`, optionIndex);

    if (optionIndex !== -1) {
        const selector = `.css-fk865s-option:nth-child(${optionIndex + 1}), .css-1kti9hw-option:nth-child(${optionIndex + 1})`;
        console.log(`Usando selector: ${selector}`);
        await page.click(selector);
        console.log(`Opción "${desiredLocation}" seleccionada`);
    } else {
        console.log(`Opción "${desiredLocation}" no encontrada`);
    }

    // Seleccionar la fecha de retiro directamente en el input
    console.log('Esperando el campo de fecha de entrega/retiro...');
    await page.waitForSelector('#drop-up-date-start', { visible: true, timeout: 60000 });
    console.log('Campo de fecha de entrega/retiro encontrado');
    
    await page.evaluate(() => {
        const dateInput = document.querySelector('#drop-up-date-start');
        dateInput.removeAttribute('readonly');
        dateInput.value = '28/06/2024'; // Fecha deseada
        dateInput.dispatchEvent(new Event('change', { bubbles: true }));
    });

    console.log('Fecha de entrega/retiro seleccionada directamente en el input');

    // Capturar una pantalla para verificar visualmente la selección
    await page.screenshot({ path: 'seleccion_fecha_retiro.png' });

    await browser.close();
})();
