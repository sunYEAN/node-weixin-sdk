const fs = require('fs');

exports.readFileAsync = function (path, encoding) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, encoding, (err, data) => {
            if (err) reject(err);
            else resolve(data);
        })
    })
};

exports.writeFileAsync = function (path, content) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, content, (err) => {
            if (err) reject(err);
            else resolve(JSON.parse(content));
        })
    })
};