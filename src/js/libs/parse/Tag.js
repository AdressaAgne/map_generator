const Ajax = require('./libs/functions/Ajax');


const url = (tag, count = 99) => {
    // if(location.href.indexOf('localhost')) {
    //     return `data/tag.json`;
    // }
    return `https://www.adressa.no/tema/${tag}/?service=jsonfeed&count=${count}`;
};



const fetch = (tag, callback, count = 99) => {
    let request = new Ajax(url(tag, count), 'GET');
    request.fetch(data => {
        if(data.items) {
            for(let article of data.items) {
                if(article.id && article.id != (location.href.match(/\d{8}/g) || [''])[0]) {
                    callback(article);
                }
            }
        }
    });
    return request;
}


module.exports = {
    fetch,
    url
}