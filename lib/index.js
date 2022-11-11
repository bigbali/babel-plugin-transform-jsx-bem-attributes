"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.errorMessage = exports.OPTIONS = void 0;
const core_1 = require("@babel/core");
const types_1 = require("./types");
const constants_1 = require("./constants");
const util_1 = require("./util");
const construct_1 = __importStar(require("./construct"));
const SKIP_FILE = '@bem-skip-file';
const SKIP_ELEMENT = '@bem-skip-element';
const isBlock = (attrName) => {
    return attrName === types_1.BEMPropTypes.BLOCK;
};
const isMods = (attrName) => {
    return attrName === types_1.BEMPropTypes.MODS;
};
const isClassName = (attrName) => {
    return attrName === types_1.BEMPropTypes.CLASSNAME;
};
const isJSXAttribute = (attrPath) => {
    return core_1.types.isJSXAttribute(attrPath.node);
};
const DEFAULT_OPTIONS = {
    plugin: {
        enable: true,
        error: 'throw'
    },
    block: {
        preserve: true
    }
};
exports.OPTIONS = DEFAULT_OPTIONS;
const hasPlugin = (opts) => 'plugin' in opts;
const hasBlock = (opts) => 'block' in opts;
function transformJSXBEMAttributes() {
    return {
        name: 'transform-jsx-bem-attributes',
        pre() {
            if (hasPlugin(this.opts)) {
                exports.OPTIONS.plugin = Object.assign(Object.assign({}, exports.OPTIONS.plugin), this.opts.plugin);
            }
            if (hasBlock(this.opts)) {
                exports.OPTIONS.block = Object.assign(Object.assign({}, exports.OPTIONS.block), this.opts.block);
            }
        },
        visitor: {
            JSXElement(element, { file }) {
                var _a, _b, _c;
                if ((_b = (_a = file === null || file === void 0 ? void 0 : file.ast) === null || _a === void 0 ? void 0 : _a.comments) === null || _b === void 0 ? void 0 : _b.some((comment) => comment.value.includes(SKIP_FILE)))
                    return; // skip file
                if ((_c = element.node.leadingComments) === null || _c === void 0 ? void 0 : _c.some((comment) => comment.value.includes(SKIP_ELEMENT)))
                    return; // skip element
                if (!exports.OPTIONS.plugin.enable)
                    return;
                traverseJSXElementTree(element, null);
                // Don't traverse child nodes, as we will do that manually
                element.skipKey('children');
            }
        }
    };
}
exports.default = transformJSXBEMAttributes;
;
/**
 * Recursively traverses the JSXElement tree and constructs the 'className' attribute
 * @param element - The JSXElement to recursively traverse
 * @param block - Passed to the next iteration to allow block inheritance
 */
const traverseJSXElementTree = (element, block) => {
    const openingElement = element.get('openingElement');
    const attrPaths = openingElement.get('attributes');
    const isBlockInherited = { value: true };
    let isClassNameOnly = true;
    const BEM_PROPS = {
        block,
        elem: null,
        mods: null,
        className: null
    };
    const attrPathsToRemove = [];
    attrPaths.forEach(attrPath => {
        if (!isJSXAttribute(attrPath)) {
            return; // There's not much we can do with spread attributes, so let's skip them
        }
        const { node } = attrPath;
        const { value: attrValue, name: { name: attrName } } = node;
        if (!constants_1.BEM_PROP_TYPES.includes(attrName)) {
            return;
        }
        if (isClassNameOnly && attrName !== types_1.BEMPropTypes.CLASSNAME) {
            isClassNameOnly = false;
        }
        if (core_1.types.isStringLiteral(attrValue)) {
            assignString(BEM_PROPS, attrPath, attrName, attrValue, isBlockInherited);
        }
        if (core_1.types.isJSXExpressionContainer(attrValue)) {
            const { expression } = attrValue;
            if (core_1.types.isStringLiteral(expression) && expression.value) {
                assignString(BEM_PROPS, attrPath, attrName, expression, isBlockInherited);
            }
            if (isMods(attrName) && (core_1.types.isFunctionExpression(expression)
                || core_1.types.isArrowFunctionExpression(expression)
                || core_1.types.isCallExpression(expression)
                || core_1.types.isObjectExpression(expression)
                || core_1.types.isTemplateLiteral(expression)
                || core_1.types.isIdentifier(expression))) {
                BEM_PROPS.mods = expression;
            }
            if (isClassName(attrName) && !core_1.types.isJSXEmptyExpression(expression)) { // className allows any value
                BEM_PROPS.className = attrValue;
            }
        }
        attrPathsToRemove.push(attrPath);
    });
    (0, util_1.removeAttrPaths)(attrPathsToRemove);
    if (!BEM_PROPS.block) {
        BEM_PROPS.elem && throwError(element, 'An \'elem\' attribute is provided, but \'block\' missing.');
        BEM_PROPS.mods && throwError(element, 'A \'mods\' attribute is provided, but \'block\' missing.');
    }
    classNameCheck: if (isClassNameOnly) {
        // INVESTIGATE:
        // without this label-break thing, we can find that SVG paths have 'className=true' on them (wtf?)
        // additionally, without this, top level element in JSX expressions {true && [<div>]<span />[</div>]}
        // don't have block, but it's children apparently receive it properly
        if (!BEM_PROPS.className)
            break classNameCheck;
        element.node.openingElement.attributes.push(core_1.types.jsxAttribute(core_1.types.jsxIdentifier('className'), BEM_PROPS.className));
    }
    else {
        const classNameAttribute = (0, construct_1.default)(BEM_PROPS, element, isBlockInherited.value);
        (classNameAttribute === null || classNameAttribute === void 0 ? void 0 : classNameAttribute.value) && element.node.openingElement.attributes.push(classNameAttribute);
    }
    element.get('children').forEach(childElement => {
        if (core_1.types.isJSXElement(childElement.node)) {
            traverseJSXElementTree(childElement, BEM_PROPS.block);
        }
    });
};
const assignString = (BEM_PROPS, attrPath, attrName, expression, isBlockInherited) => {
    if (expression.value === construct_1.EMPTY_STRING) {
        const { start } = attrPath.node.loc || {};
        (0, exports.error)(attrPath, `Empty string is not a valid value at ${attrName}, line ${(start === null || start === void 0 ? void 0 : start.line) || 'unknown'}, column ${(start === null || start === void 0 ? void 0 : start.column) || 'unknown'}.`);
    }
    if (isBlock(attrName)) {
        BEM_PROPS.block = expression;
        isBlockInherited.value = false;
        return;
    }
    BEM_PROPS[attrName] = expression;
};
const errorMessage = (attr, type, detailedType) => {
    var _a;
    const aOrAn = ((_a = (detailedType || type).at(0)) === null || _a === void 0 ? void 0 : _a.match(/[aeiou]/)) ? 'an' : 'a';
    return (`${aOrAn}${detailedType || type} value was passed in for the '${attr}' attribute,
        but it is explicitly disabled. See '<PLUGIN OPTIONS>.${attr === 'mods' ? 'mod' : attr}.${type}'.`);
};
exports.errorMessage = errorMessage;
/**
 * If error mode is 'throw', throw an error when one is found, otherwise warn in the console.
 */
const error = (attrPath, message) => {
    if (exports.OPTIONS.plugin.error === 'throw') {
        throwError(attrPath, message);
        return;
    }
    console.warn(message);
};
exports.error = error;
/**
 * A wrapper around the 'throw' keyword to allow use in logical expressions.
 */
const throwError = (attrPath, error) => {
    throw attrPath.buildCodeFrameError(error);
};
