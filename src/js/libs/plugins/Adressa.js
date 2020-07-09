const Cue = require('./Cue');

module.exports = {
    acc : () => new Cue('acc-cue-1','acc-cue-1', 'adressa'),
    live : () => new Cue('cue.polarismedia.no', 'cue.polarismedia.no', 'adressa'),
    trdby : () => new Cue('cue.polarismedia.no', 'cue.polarismedia.no', 'trdby'),
}