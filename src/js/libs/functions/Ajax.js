/**
 * Usage:
 * 
 * const Ajax = require('./libs/functions/Ajax');
 * let request = new Ajax('url', 'POST', {
 *      'id' : 1
 * });
 * 
 * request.progress((e, percent) => {
 *   // code
 * })
 * 
 * request.error((xhr, status) => {
 *   // code
 * })
 * 
 * // response is a json object if the url was a json file.
 * request.fetch(response => {
 * 
 *   // code
 * 
 * });
 * 
 */

module.exports = class Ajax {
    constructor(url, method = 'POST', data) {
        if (url === undefined) return null;

        this.xhr = new XMLHttpRequest();
        this.formData = new FormData();
        this.method = method;
        this.data = data;
        this.url = url;

        for (let key in data) {
            if (data.hasOwnProperty(key)) {
                this.formData.append(key, data[key]);
            }
        }

        this.xhr.open(method, url, true);

        return this;
    }

    progress(callback) {
        if (callback == undefined || typeof callback !== 'function') return error('progress callback is not typeof function');

        this.xhr.upload.addEventListener("progress", function (e) {
            if (e.lengthComputable) {
                let progress = Math.floor((e.loaded / e.total) * 100);
                callback.bind(this)(e, progress);
            }
        });

        return this;
    }

    error(callback) {
        this.xhr.onerror = function (e) {
            if (callback == undefined || typeof callback !== 'function') return error('Error callback is a not a function');
            callback.bind(this)(this.xhr, this.xhr.status);
        }.bind(this);

        return this;
    }

    fetch(response) {
        this.xhr.send(this.formData === undefined ? null : this.formData);

        if (response == undefined || typeof response !== 'function') return error('response callback is not typeof function');

        this.xhr.addEventListener("load", function (e) {
            let data = this.isJsonString(e.target.response) ? JSON.parse(e.target.response) : e.target.response;
            response.bind(this)(data);
        }.bind(this));

        return this;
    }

    isJsonString(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

}