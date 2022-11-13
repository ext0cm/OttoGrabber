const {
    addToCsv,
    DEFAULT_CSV_NAME,
    createCsvWhenNotExists,
    productToCsv,
} = require('./csv');
const { parseProduct } = require('./product');
const { getUrls } = require('./urls');

(async () => {
    createCsvWhenNotExists();

    getUrls().forEach(async (url) => {
        const product = await parseProduct(url);

        const productVars = product.variations;
        const productVarsKeys = productVars ? Object.keys(productVars) : [];

        if (productVarsKeys.length) {
            productVarsKeys.forEach((productVarKey) => {
                const productVar = productVars[productVarKey];

                addToCsv(
                    DEFAULT_CSV_NAME,
                    productToCsv(
                        productVar,
                        product.brand || '',
                        product.htmlCharacteristics || ''
                    )
                );
            });

            return;
        }

        addToCsv(DEFAULT_CSV_NAME, productToCsv(product));
    });
})();
