exports.defaultEscape = (str = '') => {
    return `${str}`
        .replaceAll(`#ft5_slash#`, '/')
        .replaceAll(`&#34;`, `""`)
        .replaceAll(`"`, `""`);
};
