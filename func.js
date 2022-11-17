exports.renderFunc = function (time, url) {
    const str = time.split(':');
    url = `${url}?t=${str[0]}m${str[1]}s`
    return url;
};