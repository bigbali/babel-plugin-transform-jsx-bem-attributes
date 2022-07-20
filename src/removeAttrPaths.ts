import type { NPJSXAttribute } from './index';

export default function removeAttrPaths(attrPaths: NPJSXAttribute[]) {
    if (attrPaths.length === 0) {
        return;
    }

    for (let index = attrPaths.length - 1; index >= 0; index--) {
        attrPaths[index].remove();
    }
};