
module.exports = {

    /**
     * wrap word at index
     */
    wrapWordAtIndex: (elm, wrapper, index) => {
        var text = elm.innerHTML.split(" ");
        if (index < 0) index = text.length + index;
        text[index] = "<" + wrapper + ">" + text[index] + "</" + wrapper + ">";
        elm.innerHTML = text.join(" ");
    },

    /**
     * Wrap text from index to index
     */
    wrapInRange: (elm, wrapper, from, to) => {
        var text = elm.innerText.trim();
        elm.innerHTML = text.slice(0, from) + "<" + wrapper + ">" + text.slice(from, to) + "</" + wrapper + ">" + text.slice(to, text.length);
    },

    /**
     *   Wrap text from word index to word index;
     */
    wrapWordInRage: (elm, wrapper, from, to) => {
        var text = elm.innerText.trim();
        var index = text.split(" ");

        if (from < 0) from = (index.length + 1) + from;
        if (to < 0) to = (index.length + 1) + to;

        var from_index = index.slice(0, from).join(' ').length;
        var to_index = index.slice(0, to).join(' ').length;

        elm.innerHTML = text.slice(0, from_index) + "<" + wrapper + ">" + text.slice(from_index, to_index) + "</" + wrapper + ">" + text.slice(to_index, text.length);

        return elm.querySelector('span');
    },

    /**
     * Wrap the last line of a string thats under 40 words
     */
    wrapLastLine: (elm) => {
        var loop = (elm, i, index, startH) => {
            // 40 iteration safty
            if (i > 40) return;
            var span = this.wrapWordInRage('span', --index, -1);

            if (startH == undefined) startH = span.offsetHeight;
            if (startH !== span.offsetHeight) {
                this.wrapWordInRage('span', ++index, -1);
                return;
            }

            loop(elm, ++i, index, startH);
        }
        loop(elm, 0, -1);
    }
}