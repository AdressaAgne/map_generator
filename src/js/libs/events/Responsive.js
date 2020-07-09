const Event = require('./Event.js');

module.exports = class Responsive extends Event {

    constructor(mobileSize = 641, tabletSize = 1024) {
        super();

        let mobile = window.matchMedia(`(max-width: ${mobileSize}px)`);
        let tablet = window.matchMedia(`(max-width: ${tabletSize}px)`);

        this.device = mobile.matches ? 'mobile' : (tablet.matches ? 'tablet' : 'desktop');

        const change = e => {
            this.device = mobile.matches ? 'mobile' : (tablet.matches ? 'tablet' : 'desktop');

            this.fireEvent(this.device, this);
            this.fireEvent('deviceChange', this);
        }

        mobile.addListener(change);
        tablet.addListener(change);
    }
}