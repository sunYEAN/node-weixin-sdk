const path = require('path');
const resolve = (_path) => {
    return path.resolve(__dirname, _path);
};
module.exports = {
    port: 3000,
    appId: 'wx506ab5755c31468f',
    appSecret: 'ea3b1e325bbb35ce5f10d67540a06ddd',


    tokenPath: resolve('./wx/token.txt'),
    ticketPath: resolve('./wx/ticket.txt')
};
