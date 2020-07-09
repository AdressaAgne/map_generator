const base64img = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

/**
 * async 
 * @param {string} img 
 * @param {string} replacement 
 * @param {function} callback 
 * @param {boolean} async
 * @return image string if !async, xhr if async
 */
const placeholder = (img, replacement, callback, async = true) => {
    var xhr = new XMLHttpRequest();
    xhr.open('HEAD', img, async);

    xhr.onload = xhr.onerror = e => {
        if (xhr.status == 404) return placeholder(replacement, base64img, callback, async);
        let image = new Image();
        image.src = img;
        callback(image);
    }
    xhr.send();

    return !async ?(xhr.status == 404 ? replacement : img): xhr;
}

module.exports = {
    placeholder
}