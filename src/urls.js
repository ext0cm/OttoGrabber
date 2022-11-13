const fs = require('fs');

exports.DEFAULT_URLS_FILE_NAME = 'urls.txt';

exports.getUrls = (fileName = undefined) => {
    const fn = fileName || this.DEFAULT_URLS_FILE_NAME;
    return fs.existsSync(fn)
        ? fs.readFileSync(fn, { encoding: 'utf-8' }).split(/\n?\r/)
        : [];
};
