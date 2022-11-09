import { NodePath, types } from '@babel/core';
import { ELEM_CONNECTOR, MODS_CONNECTOR } from './constants';
import {
    BEMProps, Mods,
} from './types';

export const EMPTY_STRING = '';
export const SPACE = ' ';

type BuiltModsType = types.TemplateLiteral | string | null;

const buildMods = (block: string | null, elem: string | null, mods: Mods, element: NodePath<types.JSXElement>): BuiltModsType => {
    const prefix = (() => {
        if (block && elem) return elem;
        if (block && !elem) return block;
    })();

    if (!prefix) return null;

    if (types.isStringLiteral(mods) && mods.value) {
        return `${SPACE}${prefix}${MODS_CONNECTOR}${mods.value}`;
    }

    const template = types.templateLiteral([types.templateElement({ raw: prefix }, false)], []);

    if (types.isObjectExpression(mods)) {
        mods.properties.forEach((property) => {
            if (types.isSpreadElement(property)) return;

            if (types.isObjectProperty(property)) {
                const key = (() => {
                    if (types.isIdentifier(property.key)) {
                        return property.key.name;
                    }
                    if (types.isStringLiteral(property.key)) {
                        return property.key.value;
                    }
                })();

                // If there's no key, it's pointless to continue
                if (!key) return;

                // If we know that the value will always be false, then yet again no point to continue
                if (types.isBooleanLiteral(property.value) && property.value.value === false) return;
                if (types.isRestElement(property.value)) return;

                template.expressions.push(types.conditionalExpression(
                    property.value as types.Expression,
                    types.stringLiteral(`${SPACE}${prefix}${MODS_CONNECTOR}${key}`),
                    types.stringLiteral(EMPTY_STRING)
                ));
                template.quasis.push(types.templateElement({ raw: EMPTY_STRING }));
            }

        });
    }

    // leave call alone, but convert function expr to callexpr and give it prefix arg

    if (types.isCallExpression(mods)) {
        template.expressions.push(mods);
        template.quasis.push(types.templateElement({ raw: EMPTY_STRING }));
    }

    if (types.isFunctionExpression(mods) || types.isArrowFunctionExpression(mods)) {
        template.expressions.push(
            types.callExpression(mods, [
                types.stringLiteral(`${SPACE}${prefix}${MODS_CONNECTOR}`)
            ])
        );
        template.quasis.push(types.templateElement({ raw: EMPTY_STRING }));
    }

    if (types.isIdentifier(mods)) {
        const binding = element.scope.getBinding(mods.name);

        if (!binding) return null;

        const node = binding.path.node;

        // If 'mods' is a function declaration with var/let/const, call it with prefix argument
        if (types.isVariableDeclarator(node)) {
            if (types.isFunctionExpression(node.init) || types.isArrowFunctionExpression(node.init)) {
                template.expressions.push(
                    types.callExpression(mods, [
                        types.stringLiteral(`${SPACE}${prefix}${MODS_CONNECTOR}`)
                    ])
                );
                template.quasis.push(types.templateElement({ raw: EMPTY_STRING }));
            }
        }

        // If 'mods' is a function declaration, call it with prefix argument
        if (types.isFunctionDeclaration(node)) {
            template.expressions.push(
                types.callExpression(mods, [
                    types.stringLiteral(`${SPACE}${prefix}${MODS_CONNECTOR}`)
                ])
            );
            template.quasis.push(types.templateElement({ raw: EMPTY_STRING }));
        }
    }

    if (template.expressions.length === 0) return null;

    return template;
};

const constructClassNameAttribute = (
    BEM_PROPS: BEMProps,
    ELEMENT: NodePath<types.JSXElement>,
    IS_BLOCK_INHERITED: boolean
): types.JSXAttribute | null => {
    const {
        block,
        elem,
        mods,
        className
    } = BEM_PROPS;

    if (!block) return null;

    const BLOCK = block.value || null;

    const ELEM = elem && BLOCK
        ? `${BLOCK}${ELEM_CONNECTOR}${elem.value}`
        : null;

    const MODS = buildMods(BLOCK, ELEM, mods, ELEMENT);

    let final: string = EMPTY_STRING;

    if (!IS_BLOCK_INHERITED) {
        BLOCK && (final += BLOCK);
        ELEM && (final += `${SPACE}${ELEM}`);
    }
    else {
        ELEM && (final += ELEM);
    }

    if (typeof MODS === 'string') {
        final += MODS;
    }

    // INVESTIGATE:
    // when block and elem are both top level, block is omitted (which makes sense, methinks)
    // so, let's think about whether or not we should keep this behaviour


    const attributeValue = (() => {
        if (typeof MODS !== 'string' && types.isTemplateLiteral(MODS)) {
            return types.jsxExpressionContainer(
                MODS
            );
        }
        if (typeof final === 'string') return types.stringLiteral(final);
    })();

    if (!attributeValue) return null;

    return types.jsxAttribute(
        types.jsxIdentifier('className'),
        attributeValue
    );
};
export default constructClassNameAttribute;