import { BEMPropTypes } from "./types";

export const BEM_PROP_TYPES: string[] = [
    BEMPropTypes.BLOCK,
    BEMPropTypes.ELEM,
    BEMPropTypes.MODS,
    BEMPropTypes.CLASSNAME
];

// Node.js environment variables
export const PASSIVE = process.env.REACT_BEM_MODE_PASSIVE;
export const DISABLE_BLOCK_INHERITANCE = process.env.REACT_BEM_DISABLE_BLOCK_INHERITANCE;
export const ELEM_CONNECTOR = process.env.REACT_BEM_ELEM_CONNECTOR || '-';
export const MODS_CONNECTOR = process.env.REACT_BEM_MODS_CONNECTOR || '_';
