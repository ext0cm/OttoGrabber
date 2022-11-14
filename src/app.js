const { config } = require('../config');
const { addToCsv, createCsvWhenNotExists, productToCsv } = require('./csv');
const { parseProduct } = require('./product');
const { getUrls } = require('./urls');

(async () => {
    createCsvWhenNotExists(config.PRODUCTS_CSV_NAME);

    getUrls().forEach(async (url) => {
        const product = await parseProduct(url).catch(console.error);

        const productVars = product.variations;
        const productVarsKeys = productVars ? Object.keys(productVars) : [];

        if (productVarsKeys.length) {
            productVarsKeys.forEach((productVarKey) => {
                const productVar = productVars[productVarKey];

                addToCsv(
                    config.PRODUCTS_CSV_NAME,
                    productToCsv(
                        productVar,
                        product.brand || '',
                        product.htmlCharacteristics || ''
                    )
                );
            });

            return;
        }

        addToCsv(config.PRODUCTS_CSV_NAME, productToCsv(product));
    });
})();
