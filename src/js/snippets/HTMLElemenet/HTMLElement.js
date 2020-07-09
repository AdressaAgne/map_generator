/**
 * Wrap a HTMLElement with a tag.
 */
HTMLElement.prototype.wrapElement = function (string) {
    var wrapper = document.createElement(string);
    this.parentNode.replaceChild(wrapper, this);
    wrapper.appendChild(this);
}