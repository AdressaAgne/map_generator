module.exports = class LatLng {
    constructor(lat, lng) {
        this.lat = lat;
        this.lng = lng;
    }

    /**
     * Haversine formula, get distance between 2 LatLng points
     * @method haversine
     * @param  {LatLng}  that
     * @return {distance} km
     */
    distanceTo(that) {
        if(!(that instanceof LatLng)) throw new Error('distanceTo takes LatLng as first param');

        const R = 6371; // km

        let x1 = that.lat - this.lat;
        let deltaLat = LatLng.toRad(x1);
        let x2 = that.lng - this.lng;
        let deltaLng = LatLng.toRad(x2);

        let a = Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
            Math.cos(LatLng.toRad(this.lat)) * Math.cos(LatLng.toRad(that.lat)) *
            Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return (R * c) * 1000;
    }

    static toRad(int) {
        return int * Math.PI / 180;
    }

}