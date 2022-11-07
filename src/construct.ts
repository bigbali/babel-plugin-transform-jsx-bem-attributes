import { NodePath, types } from '@babel/core';
import { Block } from '@babel/types';
import { ELEM_CONNECTOR, MODS_CONNECTOR } from './constants';
import {
    BEMProps, Elem, Mods, ModsType,
} from './types';

export const EMPTY_STRING = '';
export const SPACE = ' ';

type BuiltModsType = types.TemplateLiteral | string | null;

const buildMods = (block: string, elem: string | null, mods: Mods): BuiltModsType => {
    const prefix = (() => {
        if (block && elem) return elem.trimStart();
        if (!block && elem) return null;
        if (block && !elem) return block;
    })();

    if (prefix && types.isStringLiteral(mods) && mods.value) {
        return `${SPACE}${prefix}${MODS_CONNECTOR}${mods.value}`;
    }
    return null;
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

    //    block = BLOCK
    //    elem  = block
    //        ? block + ELEM
    //        : null
    //    mods  = elem
    //        ? elem + MODS
    //        : block
    //            ? block + MODS
    //            : null
    // IF BLOCK IS INHERITED, OMIT FROM FINAL

    if (!block) return null;

    const BLOCK = block.value;

    const ELEM = elem
        ? `${SPACE}${BLOCK}${ELEM_CONNECTOR}${elem.value}`
        : null;

    const MODS = buildMods(BLOCK, ELEM, mods);

    let final = EMPTY_STRING;
    final += BLOCK;
    final += ELEM || EMPTY_STRING;

    if (typeof MODS === 'string') {
        final += MODS;
    }

    return types.jsxAttribute(
        types.jsxIdentifier('className'),
        types.stringLiteral(final)
    );



};
export default constructClassNameAttribute;