import { NodePath, types } from '@babel/core';
import { SupportedTypes } from 'src';
import { EMPTY_STRING } from './construct';

export const purifyTemplate = (template: types.TemplateLiteral) => {
    if (types.isTemplateLiteral(template)) {
        if (template.expressions.length === 0) {
            return types.stringLiteral( // If there are no dynamic elements, replace with a static string
                template.quasis.join(EMPTY_STRING)
            );
        }

        if (template.expressions.length > 0) {
            template.expressions = template.expressions.map(
                expression => {
                    if (types.isTemplateLiteral(expression)) {
                        return purifyTemplate(expression);
                    }

                    return expression;
                }
            );
        }
    }

    return template;
};

export const filter = (expression: types.Expression | null, path: NodePath<types.JSXElement>): SupportedTypes[] | null => {
    if (types.isStringLiteral(expression) && expression.value) {
        return [expression];
    }

    if (types.isTemplateLiteral(expression) && expression.quasis.length > 0 && expression.expressions.length > 0) {
        return [purifyTemplate(expression)];
    }

    if (types.isCallExpression(expression) || types.isObjectExpression(expression) || types.isIdentifier(expression)) {
        return [expression];
    }

    if (types.isArrayExpression(expression)) {
        const array = expression.elements.filter((element) => {
            if (types.isExpression(element)) {
                if (types.isStringLiteral(element) && element.value) {
                    return true;
                }

                if (types.isTemplateLiteral(element) && element.quasis.length > 0 && element.expressions.length > 0) {
                    return true;
                }

                if (types.isCallExpression(element) || types.isObjectExpression(element) || types.isIdentifier(element)) {
                    return true;
                }

                if (types.isArrayExpression(element)) { // Nested arrays are not supported
                    throw path.buildCodeFrameError('Array element may not be an array.');
                }
            }

            return false;
        });

        // TS has no clue, but we know that we have eliminated all unsupported types
        return array as unknown as SupportedTypes[];
    }

    return null;
};
