const puppeteer = require('puppeteer');

async function scrape(url) {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    try {
        await page.goto(url);

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

        // Esperar un poco para que se refleje la selección
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Seleccionar la fecha de devolución directamente en el input
        console.log('Esperando el campo de fecha de devolución...');
        await page.waitForSelector('input[aria-label="Fecha de Devolución"]', { visible: true, timeout: 60000 });
        console.log('Campo de fecha de devolución encontrado');
        
        await page.evaluate(() => {
            const returnDateInput = document.querySelector('input[aria-label="Fecha de Devolución"]');
            returnDateInput.removeAttribute('readonly');
            returnDateInput.value = '01/07/2024'; // Fecha deseada de devolución
            returnDateInput.dispatchEvent(new Event('change', { bubbles: true }));
        });

        console.log('Fecha de devolución seleccionada directamente en el input');

        // Esperar un poco para que se refleje la selección
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Seleccionar la hora de entrega
        console.log('Esperando el campo de hora de entrega...');
        await page.waitForSelector('#pickupTime', { visible: true, timeout: 60000 });
        console.log('Campo de hora de entrega encontrado');
        
        await page.select('#pickupTime', '11:00');
        console.log('Hora de entrega seleccionada: 11:00');

        // Esperar un poco para que se refleje la selección
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Seleccionar la hora de devolución
        console.log('Esperando el campo de hora de devolución...');
        await page.waitForSelector('#returnTime', { visible: true, timeout: 60000 });
        console.log('Campo de hora de devolución encontrado');
        
        await page.select('#returnTime', '11:00');
        console.log('Hora de devolución seleccionada: 11:00');

        // Esperar un poco para que se refleje la selección
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Hacer clic en el botón de buscar
        console.log('Esperando el botón de buscar...');
        await page.waitForSelector('.sc-jwKygS.cAXtoF.submit-btn.search-form_button', { visible: true, timeout: 60000 });
        console.log('Botón de buscar encontrado');
        await page.click('.sc-jwKygS.cAXtoF.submit-btn.search-form_button');
        console.log('Botón de buscar clicado');

        // Esperar un tiempo para que se carguen los resultados
        await new Promise(resolve => setTimeout(resolve, 15000));

        // Capturar una pantalla para verificar visualmente la selección
        await page.screenshot({ path: 'resultados_busqueda.png' });

        // Obtener precios, categorías y modelos
        const carData = await page.evaluate(() => {
            const cars = [];
            const carElements = document.querySelectorAll('.carClass'); // Ajusta el selector según la estructura real del sitio

            carElements.forEach(carElement => {
                const model = carElement.querySelector('.carModel').innerText.trim(); // Ajusta el selector según la estructura real del sitio
                const category = carElement.querySelector('.carCategory').innerText.trim(); // Ajusta el selector según la estructura real del sitio
                const price = carElement.querySelector('.carPrice').innerText.trim(); // Ajusta el selector según la estructura real del sitio
                cars.push({ model, category, price });
            });

            return cars;
        });

        console.log('Datos de los autos:', carData);

        await browser.close();

        return carData;
    } catch (error) {
        console.error('Error durante la ejecución del scraper:', error);
        await browser.close();
        return null;
    }
}

module.exports = { scrape };
