"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeAttrPaths = void 0;
function removeAttrPaths(attrPaths) {
    if (attrPaths.length === 0) {
        return;
    }
    // Looping backwards makes sure we don't have problems with the indexes
    // (otherwise we'll skip every 2nd element!)
    for (let index = attrPaths.length - 1; index >= 0; index--) {
        attrPaths[index].remove();
    }
}
exports.removeAttrPaths = removeAttrPaths;
;
