const fs = require('fs');
const { config } = require('../config');
const { defaultEscape } = require('./utils');

exports.createCsvWhenNotExists = (fileName) => {
    if (!fileName) {
        return;
    }

    if (!fs.existsSync(fileName)) {
        fs.writeFileSync(fileName, config.CSV_HEADER);
    } else {
        const con = fs.readFileSync(fileName, { encoding: 'utf-8' });

        if (!con.startsWith(config.CSV_HEADER)) {
            fs.writeFileSync(fileName, `${config.CSV_HEADER}\n${con}`);
        }
    }
};

exports.addToCsv = (fileName, line = '') => {
    if (!fileName) {
        return;
    }

    if (!line || !line.length) {
        return;
    }

    this.createCsvWhenNotExists();

    fs.appendFileSync(fileName, `${line}\n`);
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
                  .map((image) => `${config.DEFAULT_IMAGE_PREFIX}${image}`)
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
