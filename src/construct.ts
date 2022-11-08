import { NodePath, types } from '@babel/core';
import { ELEM_CONNECTOR, MODS_CONNECTOR } from './constants';
import {
    BEMProps, Mods,
} from './types';

export const EMPTY_STRING = '';
export const SPACE = ' ';

type BuiltModsType = types.TemplateLiteral | string | null;

const buildMods = (block: string | null, elem: string | null, mods: Mods): BuiltModsType => {
    const prefix = (() => {
        if (block && elem) return elem;
        if (block && !elem) return block;
    })();

    if (!prefix) return null;

    if (types.isStringLiteral(mods) && mods.value) {
        return `${SPACE}${prefix}${MODS_CONNECTOR}${mods.value}`;
    }

    const tl = types.templateLiteral([types.templateElement({ raw: prefix }, false)], []);

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

                tl.expressions.push(types.conditionalExpression(
                    property.value as types.Expression,
                    types.stringLiteral(`${SPACE}${prefix}${MODS_CONNECTOR}${key}`),
                    types.stringLiteral(EMPTY_STRING)
                ));
                tl.quasis.push(types.templateElement({ raw: EMPTY_STRING }));
            }

        });
    }

    if (tl.expressions.length === 0) return null;

    return tl;
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

    const MODS = buildMods(BLOCK, ELEM, mods);

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

    // console.log(attributeValue);

    if (!attributeValue) return null;

    return types.jsxAttribute(
        types.jsxIdentifier('className'),
        attributeValue
    );
};
export default constructClassNameAttribute;