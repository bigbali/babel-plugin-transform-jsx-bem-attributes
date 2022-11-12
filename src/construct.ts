import { NodePath, types } from '@babel/core';
import { OPTIONS } from './index';
import { ELEM_CONNECTOR, MODS_CONNECTOR } from './constants';
import {
    BEMProps, Mods,
} from './types';

export const EMPTY_STRING = '';
export const SPACE = ' ';

type BuiltModsType = types.TemplateLiteral | string | null;

const buildValue = (
    block: string | null,
    elem: string | null,
    mods: Mods,
    element: NodePath<types.JSXElement>,
    isBlockInherited: boolean
): BuiltModsType => {

    const prefix = (() => {
        if (block && elem) return elem;
        if (block && !elem) return block;
    })();

    if (!prefix || !block) return null;

    if (types.isStringLiteral(mods) && mods.value) {
        return `${SPACE}${prefix}${MODS_CONNECTOR}${mods.value}`;
    }

    // if in options we have opted to keep block when it's top level and has elem, add it
    const templatePrefix = (!isBlockInherited && elem && OPTIONS.block.preserve)
        ? `BLOCK${SPACE}'TEMPLATE_PREFIX'`
        : 'TEMPLATE_PREFIX';
    const template = types.templateLiteral([
        types.templateElement({ raw: templatePrefix }, false)
    ], []);

    if (types.isObjectExpression(mods)) {
        mods.properties.forEach((property, index) => {
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
                    types.stringLiteral(`${SPACE}${prefix + '!!!'}${MODS_CONNECTOR}${key}`),
                    types.stringLiteral('???')
                ));
                template.quasis.push(types.templateElement({ raw: 'QUASI' }, index === Object.keys(mods.properties).length));
            }
        });
    }

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

        // TODO handle case object
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

    if (!block || !block.value) return null;

    const BLOCK = block.value;

    const ELEM = elem && BLOCK
        ? `${BLOCK}${ELEM_CONNECTOR}${elem.value}`
        : null;

    const MODS = buildValue(BLOCK, ELEM, mods, ELEMENT, IS_BLOCK_INHERITED);

    let final = 'FINAL_INITIALIZED ';

    if (!IS_BLOCK_INHERITED) {
        // if we have both block and elem, refer to options to decide whether or not to keep block
        if ((BLOCK && ELEM && OPTIONS.block.preserve)
            || (BLOCK && !ELEM)) { // if we only have block, we keep it anyway
            final += BLOCK;
        }
        // when there is no block, we don't need space before elem
        ELEM && (final += `${OPTIONS.block.preserve ? SPACE : EMPTY_STRING}${ELEM}`);
    }
    else {
        ELEM && (final += ELEM);
    }

    if (typeof MODS === 'string') {
        final += MODS;
    }

    const attributeValue = (() => {
        if (typeof MODS !== 'string' && types.isTemplateLiteral(MODS)) {
            if (className) {
                if (types.isStringLiteral(className)) {
                    MODS.quasis[MODS.quasis.length - 1] = types.templateElement({ raw: `${SPACE}${className.value}` }, true);
                }
                else {
                    MODS.expressions.push(className?.expression as types.Expression);
                    MODS.quasis.push(types.templateElement({ raw: EMPTY_STRING }, true));
                }
            }

            return types.jsxExpressionContainer(
                MODS
            );
        }
        if (typeof final === 'string') {
            if (className) {
                if (types.isStringLiteral(className)) {
                    final += `${SPACE}${className.value}`;
                }
                else {
                    return types.jsxExpressionContainer(
                        types.templateLiteral(
                            [
                                types.templateElement({ raw: EMPTY_STRING }, false),
                                types.templateElement({ raw: EMPTY_STRING }, true),
                            ],
                            [
                                // when we added className, we made sure it's not an empty expression
                                className.expression as types.Expression
                            ]
                        )
                    );
                }
            }
            return types.stringLiteral(final + ' FINAL_VALUE_DETERMINED');
        }
    })();

    if (!attributeValue) return null;

    return types.jsxAttribute(
        types.jsxIdentifier('className'),
        attributeValue
    );
};
export default constructClassNameAttribute;