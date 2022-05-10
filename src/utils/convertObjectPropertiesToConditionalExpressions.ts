import { types } from '@babel/core';
import {
    ObjectProperty,
    ConditionalExpression,
    Identifier
} from '@babel/types';

const modsConnector = process.env.REACT_BEM_MODS_CONNECTOR || '_';

export const convertObjectPropertiesToConditionalExpressions = (mods: ObjectProperty[], blockElem: string): ConditionalExpression[] => {
    return mods.map((objectProperty: ObjectProperty) => {
        return types.conditionalExpression(
            // Pass in an array with a single ObjectProperty value
            types.objectExpression([objectProperty]),
            types.stringLiteral(`${blockElem}${modsConnector}${(objectProperty.key as Identifier).name}`),
            types.stringLiteral('')
        );
    });;
}

export default convertObjectPropertiesToConditionalExpressions;