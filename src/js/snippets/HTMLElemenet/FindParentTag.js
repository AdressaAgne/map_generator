/**
 * Get get first parent of a tagName
 * @param {HTMLElement} elm 
 * @param {string} tag tagName
 */
const findParentTag = (elm, tag) => {
    if (!elm) return false;

    if (elm.parentElement.tagName == tag.toUpperCase()) {
        return elm.parentElement;
    }
    return findParentTag(elm.parentElement, tag);
}

module.exports = findParentTag;