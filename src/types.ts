import { types } from '@babel/core';

export type ModsType = types.ObjectExpression
    | types.FunctionExpression
    | types.CallExpression
    | types.StringLiteral
    | types.TemplateLiteral
    | types.Identifier;

export type Block = types.StringLiteral | null;
export type Elem = types.StringLiteral | null;
export type Mods = ModsType | ModsType[] | null;
export type ClassName = types.StringLiteral | types.JSXExpressionContainer | null;

export interface BEMProps {
    block: Block;
    elem: Elem;
    mods: Mods;
    className: ClassName;
};
export interface Attribute {
    value: types.StringLiteral | types.JSXExpressionContainer,
    name: {
        name: BEMPropTypes
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

