"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODS_CONNECTOR = exports.ELEM_CONNECTOR = exports.DISABLE_BLOCK_INHERITANCE = exports.COMMA = exports.EMPTY = exports.WHITESPACE = exports.BEM_PROP_TYPES = void 0;
const types_1 = require("./types");
exports.BEM_PROP_TYPES = [
    types_1.BEMPropTypes.BLOCK,
    types_1.BEMPropTypes.ELEM,
    types_1.BEMPropTypes.MODS,
    types_1.BEMPropTypes.CLASSNAME
];
exports.WHITESPACE = ' ';
exports.EMPTY = '';
exports.COMMA = ',';
// These are functions because we need to get the latest value, as it might change
const DISABLE_BLOCK_INHERITANCE = () => process.env.BEM_JSX_DISABLE_BLOCK_INHERITANCE || false;
exports.DISABLE_BLOCK_INHERITANCE = DISABLE_BLOCK_INHERITANCE;
// export const ELEM_CONNECTOR = () => process.env.BEM_JSX_ELEM_CONNECTOR ?? '-';
// export const MODS_CONNECTOR = () => process.env.BEM_JSX_MODS_CONNECTOR ?? '_';
exports.ELEM_CONNECTOR = (_a = process.env.BEM_JSX_ELEM_CONNECTOR) !== null && _a !== void 0 ? _a : '-';
exports.MODS_CONNECTOR = (_b = process.env.BEM_JSX_MODS_CONNECTOR) !== null && _b !== void 0 ? _b : '_';
