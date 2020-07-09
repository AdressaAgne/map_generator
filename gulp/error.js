module.exports = function error(e) {
    console.error(`[${e.plugin} ${e.name}]:`, e.message);
}