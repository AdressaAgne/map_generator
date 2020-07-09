/**
 * Usage:
 * const {setMode, getMode} = require('./libs/functions/mode');
 * 
 * setMode('loading');
 * 
 * getMode();
 * 
 */


const query = require('../plugins/proto');
const modeSelector = 'html';


module.exports = {
    setMode: (mode) => {
        query(modeSelector).attr('data-mode', mode);
    },

    getMode: () => {
        return query(modeSelector).first().attr('data-mode');
    }
}