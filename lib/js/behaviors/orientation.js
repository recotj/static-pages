var assert = require('../utils/assert');
var EventUtil = require('../dom/EventUtil');

var supports = {
    matchMedia: typeof window.matchMedia === 'function',
    onOrientationChange: 'onorientationchange' in window
};

var OrientationUtil = module.exports = {
    addListener: createListenerUtil('addListener'),
    removeListener: createListenerUtil('removeListener')
};

function createListenerUtil(key) {
    if (!createListenerUtil.EventKeys)
        createListenerUtil.EventKeys = {addListener: 'addEventListener', removeListener: 'removeEventListener'};

    return function (handler) {
        if (supports.matchMedia)
            OrientationUtil[key] = function (handler) {
                checkArguments(handler);
                window.matchMedia("(orientation: landscape)")[key](handler);
            };
        else if (supports.onOrientationChange)
            OrientationUtil[key] = function (handler) {
                checkArguments(handler);
                EventUtil[createListenerUtil.EventKeys[key]](window, 'orientationchange', handler, false);
            };
        else
            EventUtil[createListenerUtil.EventKeys[key]](window, 'resize', handler, false);

        OrientationUtil[key](handler);
    };
}

function checkArguments(handler) {
    assert(typeof handler === 'function', 'expected #handler# as function');
}