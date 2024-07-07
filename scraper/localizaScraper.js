const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// Usa el plugin stealth para evitar ser detectado
puppeteer.use(StealthPlugin());

async function scrapeLocaliza(url, location, fechaRetiro, fechaDevolucion, horaRetiro, horaDevolucion) {
    const browser = await puppeteer.launch({
        headless: false, // Cambia a true si no necesitas ver el navegador
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // Este parámetro a veces puede causar problemas, puedes probar a eliminarlo si es necesario
            '--disable-gpu'
        ]
    });

    const page = await browser.newPage();

    // Establece el agente de usuario
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Establece un viewport para simular una ventana de navegador
    await page.setViewport({ width: 1280, height: 800 });

    // Configurar el manejo de errores y capturar cualquier mensaje de la consola del navegador
    page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    page.on('error', err => console.error('PAGE ERROR:', err));
    page.on('pageerror', pageErr => console.error('PAGE ERROR:', pageErr));

    try {
        await page.goto(url, { waitUntil: 'load', timeout: 120000 });

        console.log('Esperando dropdown de selección de lugar...');
        await page.waitForSelector('.selector-dropdown', { visible: true, timeout: 60000 }); // Ajusta este selector
        console.log('Dropdown de selección de lugar encontrado');
        await page.click('.selector-dropdown'); // Ajusta este selector
        console.log('Dropdown de selección de lugar clicado');

        console.log('Esperando que las opciones se carguen...');
        await new Promise(resolve => setTimeout(resolve, 3000)); // Esperar 3 segundos

        const options = await page.$$eval('.selector-option', options => options.map(option => option.textContent.trim())); // Ajusta este selector
        console.log('Opciones disponibles:', options);

        const optionIndex = options.indexOf(location);
        console.log(`Índice de "${location}":`, optionIndex);

        if (optionIndex !== -1) {
            const selector = `.selector-option:nth-child(${optionIndex + 1})`; // Ajusta este selector
            console.log(`Usando selector: ${selector}`);
            await page.click(selector);
            console.log(`Opción "${location}" seleccionada`);
        } else {
            console.log(`Opción "${location}" no encontrada`);
        }

        // Seleccionar la fecha de retiro directamente en el input
        console.log('Esperando el campo de fecha de entrega/retiro...');
        await page.waitForSelector('#fechaRetiro', { visible: true, timeout: 60000 }); // Ajusta este selector
        console.log('Campo de fecha de entrega/retiro encontrado');
        
        await page.evaluate((fechaRetiro) => {
            const dateInput = document.querySelector('#fechaRetiro'); // Ajusta este selector
            dateInput.removeAttribute('readonly');
            dateInput.value = fechaRetiro;
            dateInput.dispatchEvent(new Event('change', { bubbles: true }));
        }, fechaRetiro);

        console.log('Fecha de entrega/retiro seleccionada directamente en el input');

        // Esperar un poco para que se refleje la selección
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Seleccionar la fecha de devolución directamente en el input
        console.log('Esperando el campo de fecha de devolución...');
        await page.waitForSelector('#fechaDevolucion', { visible: true, timeout: 60000 }); // Ajusta este selector
        console.log('Campo de fecha de devolución encontrado');
        
        await page.evaluate((fechaDevolucion) => {
            const returnDateInput = document.querySelector('#fechaDevolucion'); // Ajusta este selector
            returnDateInput.removeAttribute('readonly');
            returnDateInput.value = fechaDevolucion;
            returnDateInput.dispatchEvent(new Event('change', { bubbles: true }));
        }, fechaDevolucion);

        console.log('Fecha de devolución seleccionada directamente en el input');

        // Esperar un poco para que se refleje la selección
        await new Promise(resolve => setTimeout(resolve, 3000));

        // Seleccionar la hora de entrega
        console.log('Esperando el campo de hora de entrega...');
        await page.waitForSelector('#horaRetiro', { visible: true, timeout: 60000 }); // Ajusta este selector
        console.log('Campo de hora de entrega encontrado');
        
        await page.select('#horaRetiro', horaRetiro); // Ajusta este selector
        console.log(`Hora de entrega seleccionada: ${horaRetiro}`);

        // Esperar un poco para que se refleje la selección
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Seleccionar la hora de devolución
        console.log('Esperando el campo de hora de devolución...');
        await page.waitForSelector('#horaDevolucion', { visible: true, timeout: 60000 }); // Ajusta este selector
        console.log('Campo de hora de devolución encontrado');
        
        await page.select('#horaDevolucion', horaDevolucion); // Ajusta este selector
        console.log(`Hora de devolución seleccionada: ${horaDevolucion}`);

        // Esperar un poco para que se refleje la selección
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Hacer clic en el botón de buscar
        console.log('Esperando el botón de buscar...');
        await page.waitForSelector('.search-button', { visible: true, timeout: 60000 }); // Ajusta este selector
        console.log('Botón de buscar encontrado');
        await page.click('.search-button'); // Ajusta este selector
        console.log('Botón de buscar clicado');

        // Esperar un tiempo para que se carguen los resultados
        await new Promise(resolve => setTimeout(resolve, 15000));

        // Capturar una pantalla para verificar visualmente la selección
        await page.screenshot({ path: 'resultados_busqueda.png' });

        // Extraer los precios, categorías y modelos
        console.log('Extrayendo datos de los resultados...');
        const results = await page.evaluate(() => {
            const cars = [];
            const carElements = document.querySelectorAll('.result-item'); // Ajusta este selector
            carElements.forEach(carElement => {
                const model = carElement.querySelector('.car-name')?.innerText; // Ajusta este selector
                const category = carElement.querySelector('.car-category')?.innerText; // Ajusta este selector
                const price = carElement.querySelector('.car-price')?.innerText; // Ajusta este selector
                cars.push({ model, category, price });
            });
            return cars;
        });

        console.log('Datos extraídos:', results);
        return results;
    } catch (error) {
        console.error('Error durante la ejecución del script:', error);
        return [];
    } finally {
        await browser.close();
    }
}

module.exports = { scrapeLocaliza };
