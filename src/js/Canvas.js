let images = {};

const fetchImage = (url, callback) => {
    if(images[url] !== undefined) {
        callback(images[url])
        return images[url];
    }
    let image = null
    if(url instanceof HTMLCanvasElement) {
        image = url;
        callback(url);
    } else {
        image = new Image();
        image.src = '/Assets/' + url;
        image.onload = () => {
            images[url] = image;
            callback(image);
        }
    }
    return image;
}

module.exports = (w, h, callback, colorChange) => {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    
    canvas.width = w;
    canvas.height = h;

    context.clearRect(0, 0, w, h);

    if(colorChange) {
        context.fillStyle = colorChange;
        context.fillRect(0, 0, w, h);
        context.globalCompositeOperation = "destination-in";
    }

    callback(context, fetchImage);

    return canvas;
}