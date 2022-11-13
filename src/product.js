const axios = require('axios');

exports.SCRIPT_DELIMITER = `<script type="application/ld+json">`;
exports.SCRIPT_DELIMITER_2 = `</`;

exports.SCRIPT_DELIMITER_EXTRA = `script id="productDataJson" type="application/json">`;
exports.SCRIPT_DELIMITER_EXTRA_2 = `</`;

exports.parseProduct = async (url) => {
    const ax = await axios
        .get(`${url}`)
        .then((res) => {
            const r = {};

            if (res.data.indexOf(this.SCRIPT_DELIMITER) !== -1) {
                r.data =
                    res.data
                        .split(this.SCRIPT_DELIMITER)[1]
                        .split(this.SCRIPT_DELIMITER_2)[0] || '';
            } else {
                r.data = '{}';
            }

            if (res.data.indexOf(this.SCRIPT_DELIMITER_EXTRA) !== -1) {
                r.extra =
                    res.data
                        .split(this.SCRIPT_DELIMITER_EXTRA)[1]
                        .split(this.SCRIPT_DELIMITER_EXTRA_2)[0] || '';
            } else {
                r.extra = '{}';
            }

            return r;
        })
        .catch(console.error);

    let dataJson, extraJson;

    try {
        dataJson = JSON.parse(ax.data);

        extraJson = JSON.parse(ax.extra);

        dataJson.variations = extraJson.variations;
        dataJson.htmlCharacteristics = extraJson.htmlCharacteristics;
    } catch (err) {
        console.error(err);
    } finally {
        return dataJson;
    }
};
