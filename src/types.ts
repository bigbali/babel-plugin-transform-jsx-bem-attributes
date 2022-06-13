import {
    ObjectProperty,
    ObjectMethod,
    StringLiteral,
    JSXExpressionContainer,
    SpreadElement,
    isObjectProperty
} from '@babel/types';

export type Block = string | StringLiteral[];
export type Elem = string | StringLiteral[];
export type Mods = string | StringLiteral[] | ObjectProperty[];
export type ClassName = string | StringLiteral[];

export interface BEMProps {
    block: Block;
    elem?: Elem;
    mods?: Mods;
    className?: ClassName;
    blockIsTopLevel: boolean;
};

export interface Attribute {
    value: StringLiteral | JSXExpressionContainer,
    name: {
        name: `${BEMPropTypes}` & keyof BEMProps
    };
};

export enum BEMPropTypes {
    BLOCK = 'block',
    ELEM = 'elem',
    MODS = 'mods',
    CLASSNAME = 'className'
};

export const isObjectPropertyArray = (
    properties: (ObjectMethod | ObjectProperty | SpreadElement)[]
): properties is ObjectProperty[] => {
    return properties.every(property => isObjectProperty(property));
}

export const isArray = Array.isArray;

