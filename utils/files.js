const fs = require('fs');

exports.readFileAsync = function (path, encoding) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, encoding, (err, data) => {
            if (err) reject(err);
            else {
                // return  string
                resolve(data)
            }
        })
    })
};

exports.writeFileAsync = function (path, content) {
    return new Promise((resolve, reject) => {
        let str;
        if (typeof content !== "string") str = JSON.stringify(content);
        fs.writeFile(path, str, (err) => {
            if (err) reject(err);

            // return origin(content)
            else resolve(content);
        })
    })
};


exports.createTimestamp = function () {
    return parseInt(new Date().getTime() / 1000) + '';
};
exports.createNonceStr = function () {
    return Math.random().toString(36).substr(2, 15);
};