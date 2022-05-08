import { types } from '@babel/core';
import {
    ObjectProperty,
    ConditionalExpression,
    Identifier
} from '@babel/types';

export const convertObjectPropertiesToConditionalExpressions = (mods: ObjectProperty[]): ConditionalExpression[] => {
    return mods.map((objectProperty: ObjectProperty) => {
        return types.conditionalExpression(
            // Pass in an array with a single ObjectProperty value
            types.objectExpression([objectProperty]),
            types.stringLiteral((objectProperty.key as Identifier).name),
            types.stringLiteral('')
        );
    });;
}

export default convertObjectPropertiesToConditionalExpressions;