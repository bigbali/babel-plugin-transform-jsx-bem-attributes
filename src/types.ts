import { types } from '@babel/core';

export type BEMBaseAttribute = null
    | types.ArrayExpression
    | types.CallExpression
    | types.StringLiteral
    | types.TemplateLiteral;

// export type Block = BEMBaseAttribute;
// export type Elem = BEMBaseAttribute;
// export type Mods = BEMBaseAttribute | types.ObjectExpression;
// export type ClassName = BEMBaseAttribute;
export type Block = types.Expression | null;
export type Elem = types.Expression | null;
export type Mods = types.Expression | null;
export type ClassName = types.Expression | null;

export interface BEMProps {
    block: Block;
    elem: Elem;
    mods: Mods;
    className: ClassName;
};
export interface Attribute {
    value: types.StringLiteral | types.JSXExpressionContainer,
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

// export const isObjectPropertyArray = (
//     properties: (ObjectMethod | ObjectProperty | SpreadElement)[]
// ): properties is ObjectProperty[] => {
//     return properties.every(property => isObjectProperty(property));
// };

export const isArray = Array.isArray;

