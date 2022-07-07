import {
    ObjectProperty,
    ObjectMethod,
    StringLiteral,
    JSXExpressionContainer,
    SpreadElement,
    isObjectProperty,
    TemplateLiteral,
    CallExpression
} from '@babel/types';

export type BEMBaseAttribute = null | string | StringLiteral[] | TemplateLiteral | CallExpression;
export type Block = BEMBaseAttribute;
export type Elem = BEMBaseAttribute;
export type Mods = BEMBaseAttribute | (ObjectProperty | ObjectMethod)[];
export type ClassName = BEMBaseAttribute;

export interface BEMProps {
    block: Block;
    elem: Elem;
    mods: Mods;
    className: ClassName;
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
};

export const isArray = Array.isArray;

