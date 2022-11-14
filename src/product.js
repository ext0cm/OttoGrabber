const axios = require('axios');

const SCRIPT_DELIMITER = `<script type="application/ld+json">`;
const SCRIPT_DELIMITER_2 = `</`;

const SCRIPT_DELIMITER_EXTRA = `<script id="productDataJson" type="application/json">`;
const SCRIPT_DELIMITER_EXTRA_2 = `</`;

exports.parseProduct = async (url) => {
    const ax = await axios
        .get(`${url}`)
        .then((res) => {
            const r = {};

            if (res.data.indexOf(SCRIPT_DELIMITER) !== -1) {
                r.data =
                    res.data
                        .split(SCRIPT_DELIMITER)[1]
                        .split(SCRIPT_DELIMITER_2)[0] || '';
            } else {
                r.data = '{}';
            }

            if (res.data.indexOf(SCRIPT_DELIMITER_EXTRA) !== -1) {
                r.extra =
                    res.data
                        .split(SCRIPT_DELIMITER_EXTRA)[1]
                        .split(SCRIPT_DELIMITER_EXTRA_2)[0] || '';
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
