const Animations = [];
const Easing = require('./libs/functions/Easing');
const noop = () => {};

const Animate = (item, xTo, yTo, callback, duration = 60, easing = Easing.cubicOut) => {
    let element = null;
    for (let i = 0; i < Animations.length; i++) {
        if(item == Animations[i].item) {
            element = Animations[i].item
            break;
        }
    }

    let data = {
        item,
        xFrom: item.altX || 0,
        yFrom: item.altY || 0,
        xTo,
        yTo,
        iterator: 0,
        duration: typeof callback == 'number' ? callback : duration,
        callback: typeof callback == 'function' ? callback : noop,
        cue: null,
        easing
    }

    if (element != null) {
        element._stopAnimation = true;
    }

    Animations.push(data);
}

const AnimationsLoop = () => {
    for (let i = 0; i < Animations.length; i++) {
        const element = Animations[i];

        element.item._isAnimating = i;

        if (++element.iterator >= element.duration || element._stopAnimation) {
            Animations.splice(i, 1);

            element.item._isAnimating = undefined;

            if (element.cue) element.cue();
            if (element.callback) element.callback();
        }

        element.item.altX = element.easing(element.iterator, element.xFrom, element.xTo - element.xFrom, element.duration);
        element.item.altY = element.easing(element.iterator, element.yFrom, element.yTo - element.yFrom, element.duration);

    }
}

module.exports = {
    Animate,
    AnimationsLoop
};