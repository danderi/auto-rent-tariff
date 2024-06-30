const hertzScraper = require('./hertzScraper');
// const localizaScraper = require('./localizaScraper'); // Asegúrate de tener este archivo implementado
// const avisScraper = require('./avisScraper'); // Asegúrate de tener este archivo implementado
// const fitScraper = require('./fitScraper'); // Asegúrate de tener este archivo implementado
// const europcarScraper = require('./europcarScraper'); // Asegúrate de tener este archivo implementado
// const alamoScraper = require('./alamoScraper'); // Asegúrate de tener este archivo implementado
// const taraboreliScraper = require('./taraboreliScraper'); // Asegúrate de tener este archivo implementado

(async () => {
    const desiredLocation = 'Bariloche Centro';
    const startDate = '01/07/2024';
    const endDate = '02/07/2024';
    const startTime = '11:00';
    const endTime = '11:00';

    // URLs de las páginas de las rentadoras
    const urls = {
        hertz: 'https://www.hertz.com.ar',
        localiza: 'https://url_de_la_pagina_localiza',
        avis: 'https://url_de_la_pagina_avis',
        fit: 'https://url_de_la_pagina_fit',
        europcar: 'https://url_de_la_pagina_europcar',
        alamo: 'https://url_de_la_pagina_alamo',
        taraboreli: 'https://url_de_la_pagina_taraboreli'
    };

    try {
        // Llamadas a los scrapers de cada rentadora
        const hertzData = await hertzScraper.scrapeHertz(urls.hertz, desiredLocation, startDate, endDate, startTime, endTime);
        console.log('Datos de Hertz:', hertzData);

        // Llamar a los otros scrapers de la misma manera cuando estén implementados
        // const localizaData = await localizaScraper.scrapeLocaliza(urls.localiza, desiredLocation, startDate, endDate, startTime, endTime);
        // console.log('Datos de Localiza:', localizaData);
        
        // const avisData = await avisScraper.scrapeAvis(urls.avis, desiredLocation, startDate, endDate, startTime, endTime);
        // console.log('Datos de Avis:', avisData);

        // const fitData = await fitScraper.scrapeFit(urls.fit, desiredLocation, startDate, endDate, startTime, endTime);
        // console.log('Datos de Fit:', fitData);

        // const europcarData = await europcarScraper.scrapeEuropcar(urls.europcar, desiredLocation, startDate, endDate, startTime, endTime);
        // console.log('Datos de Europcar:', europcarData);

        // const alamoData = await alamoScraper.scrapeAlamo(urls.alamo, desiredLocation, startDate, endDate, startTime, endTime);
        // console.log('Datos de Alamo:', alamoData);

        // const taraboreliData = await taraboreliScraper.scrapeTaraboreli(urls.taraboreli, desiredLocation, startDate, endDate, startTime, endTime);
        // console.log('Datos de Taraboreli:', taraboreliData);
    } catch (error) {
        console.error('Error en mainScraper:', error);
    }
})();
