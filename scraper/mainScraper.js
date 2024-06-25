const hertzScraper = require('./hertzScraper');
// const localizaScraper = require('./localizaScraper'); // Asegúrate de tener este archivo implementado
// const avisScraper = require('./avisScraper'); // Asegúrate de tener este archivo implementado
// const fitScraper = require('./fitScraper'); // Asegúrate de tener este archivo implementado
// const europcarScraper = require('./europcarScraper'); // Asegúrate de tener este archivo implementado
// const alamoScraper = require('./alamoScraper'); // Asegúrate de tener este archivo implementado
// const taraboreliScraper = require('./taraboreliScraper'); // Asegúrate de tener este archivo implementado

(async () => {
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
        const hertzData = await hertzScraper.scrape(urls.hertz);
        console.log('Datos de Hertz:', hertzData);

        // await localizaScraper.scrape(urls.localiza); // Descomenta cuando tengas estos archivos implementados
        // await avisScraper.scrape(urls.avis);
        // await fitScraper.scrape(urls.fit);
        // await europcarScrape.scrape(urls.europcar);
        // await alamoScraper.scrape(urls.alamo);
        // await taraboreliScrape.scrape(urls.taraboreli);
    } catch (error) {
        console.error('Error en mainScraper:', error);
    }
})();
