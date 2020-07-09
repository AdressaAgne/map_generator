
const exists = typeof window._gaq != 'undefined' && window._gaq.push;
const title = document.querySelector('title');

console.log(title.textContent, exists);

const body = document.querySelector('body');
const html = document.querySelector('html');
let buckets = [];
const scroll = e => {
    const top = html.scrollTop || body.scrollTop;
    const height = html.scrollHeight || body.scrollHeight;

    const percent = (top / height * 100);
    if(parseInt(percent) % 5 == 0 && parseInt(percent) !== 0) {
        //push
        const bucket =  parseInt(percent)+"";

        if(buckets.indexOf(bucket) < 0) {
            console.log(title.textContent, bucket, top, height);
            buckets.push(bucket);
        }

        //window._gaq.push(title, percent+"");
    }
}

window.addEventListener('unload', e => {
    console.log(buckets);
});


document.addEventListener('scroll', scroll);



module.exports = {
    scroll
}