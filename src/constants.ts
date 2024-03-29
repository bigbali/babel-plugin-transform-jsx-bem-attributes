import { BEMPropTypes } from './types';

export const BEM_PROP_TYPES: string[] = [
    BEMPropTypes.BLOCK,
    BEMPropTypes.ELEM,
    BEMPropTypes.MODS,
    BEMPropTypes.CLASSNAME
];

export const WHITESPACE = ' ';
export const EMPTY = '';
export const COMMA = ',';

// These are functions because we need to get the latest value, as it might change
export const DISABLE_BLOCK_INHERITANCE = () => process.env.BEM_JSX_DISABLE_BLOCK_INHERITANCE || false;
// export const ELEM_CONNECTOR = () => process.env.BEM_JSX_ELEM_CONNECTOR ?? '-';
// export const MODS_CONNECTOR = () => process.env.BEM_JSX_MODS_CONNECTOR ?? '_';
export const ELEM_CONNECTOR = process.env.BEM_JSX_ELEM_CONNECTOR ?? '-';
export const MODS_CONNECTOR = process.env.BEM_JSX_MODS_CONNECTOR ?? '_';