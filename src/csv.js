const fs = require('fs');
const { defaultEscape } = require('./utils');

exports.DEFAULT_CSV_NAME = 'products.csv';

exports.DEFAULT_IMAGE_PREFIX = `https://i.otto.de/i/otto/`;

exports.createCsvWhenNotExists = (fileName = undefined) => {
    const fn = fileName || this.DEFAULT_CSV_NAME;
    if (!fs.existsSync(fn)) {
        fs.writeFileSync(fn, `GTIN,SKU,NAME,IMAGES,PRICE,BRAND\n`);
    } else {
        const con = fs.readFileSync(fn, { encoding: 'utf-8' });

        if (!con.startsWith('GTIN')) {
            fs.writeFileSync(
                fn,
                `GTIN,SKU,NAME,IMAGES,PRICE,BRAND,HTML,FEATURES\n${con}`
            );
        }
    }
};

exports.addToCsv = (fileName = undefined, line = '') => {
    if (!line || !line.length) {
        return;
    }

    this.createCsvWhenNotExists();

    fs.appendFileSync(fileName || this.DEFAULT_CSV_NAME, `${line}\n`);
};

exports.productToCsv = (product, brand = '', htmlCharacteristics = '') => {
    const images =
        product.image || product.images
            ? product.images.map((img) => `${img.id}`)
            : [];

    return product && (product.gtin13 || product.ean)
        ? [
              `"${product.gtin13 || product.ean || ''}"`,
              `"${product.sku || product.articleNumber || ''}"`,
              `"${defaultEscape(product.name || '')}"`,
              `"${images
                  .map((image) => `${this.DEFAULT_IMAGE_PREFIX}${image}`)
                  .join('||')}"`,
              `"${
                  product.offers
                      ? product.offers.price || ''
                      : product.displayPrice.techPriceAmount
              } ${
                  product.offers ? product.offers.priceCurrency || 'EUR' : 'EUR'
              }"`,
              `"${defaultEscape(
                  product.brand
                      ? product.brand.name || brand
                          ? brand.name
                          : ''
                      : brand
                      ? brand.name
                      : ''
              )}"`,
              `"${defaultEscape(
                  product.htmlCharacteristics || htmlCharacteristics
              )}"`,
              `"${(product.sellingPoints.sellingPoint || []).join('||')}"`,
          ].join(',')
        : '';
};
