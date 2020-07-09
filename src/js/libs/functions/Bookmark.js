/**
 * Usage:
 * require('./libs/functions/Bookmark');
 */

const bookmarkID = 'lastVisitBookmark'+(location.href.match(/\d{8}/g) || [1])[0];
const query = document.querySelector.bind(document);
const _debounce = require('./libs/functions/Debounce');


module.exports = class Bookmark {

    constructor(btn = null) {
        this.btn = btn;
        this.body = query('body');
        this.html = query('html');
        this.lastPos = localStorage.getItem(bookmarkID);

        window.addEventListener('scroll', _debounce(this.unload.bind(this), 1000, true));

        if(this.hasLastPos()) {
            if(this.btn == null) {
                this.btn = document.createElement('div');
                this.btn.className = 'bookmark';
                this.btn.innerHTML = '<span>Vi har satt et bokmerke der du stoppet å lese sist. Vil du fortsette der du slapp? <span class="buttons"><a id="bookmark_a">Ja</a><a id="bookmark_b">Nei</a></span></span>'
                this.body.appendChild(this.btn);
            }

            this.btn.querySelector('#bookmark_a').addEventListener('click', this.setScroll.bind(this));
            this.btn.querySelector('#bookmark_b').addEventListener('click', e => {
                this.btn.classList.remove('show');
                localStorage.removeItem(bookmarkID);
            });

            setTimeout(() => {this.btn.classList.add('show')}, 10);
        }
    }

    getScroll() {
        return this.body.scrollTop || this.html.scrollTop;
    }

    hasLastPos() {
        return this.lastPos !== null;
    }

    static Factory(btn = null) {
        return  new Bookmark(btn);
    }

    setScroll() {
        let int = this.lastPos;

        if(int == null) return;

        int = parseInt(int);

        this.btn.classList.remove('show');
        this.body.scrollTop = int;
        this.html.scrollTop = int;

        localStorage.removeItem(bookmarkID);
    }

    unload(e) {
        if(this.getScroll() > 1000) {
            if(this.btn) this.btn.classList.remove('show');
            localStorage.setItem(bookmarkID, this.getScroll());
        }
    }
}