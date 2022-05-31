import { types } from '@babel/core';
import { ConditionalExpression, Identifier, ObjectProperty } from '@babel/types';
import { BEMProps, BEMPropTypes, ELEM_CONNECTOR, MODS_CONNECTOR, PASSIVE } from '..';

// TODO??? convert from StringLiteral EVERYWHERE to string before adding to bemprops

const WHITESPACE = ' ';
const EMPTY = '';

const isValidBlock = () => {

}

export function* constructBlock({ block, blockIsTopLevel }: BEMProps) {
    if (!block || !blockIsTopLevel) { // Don't need block if it's inherited
        yield EMPTY;
    }

    if (Array.isArray(block)) {
        for (const { value } of block) {
            yield value;
        }
    }

    if (typeof block === 'string') {
        yield block;
    }
};

export function* constructElem({ block, elem }: BEMProps) {
    if (!block?.length || !elem?.length) { // Abort if we have an empty array
        return EMPTY;
    }

    if (Array.isArray(block)) {
        for (const { value: blockValue } of block) {
            if (Array.isArray(elem)) {
                for (const { value: elemValue } of elem) {
                    yield `${blockValue}${ELEM_CONNECTOR}${elemValue}`;
                }
            }

            if (typeof elem === 'string') {
                yield `${blockValue}${ELEM_CONNECTOR}${elem}`;
            }
        }
    }

    if (typeof block === 'string' && Array.isArray(elem)) {
        for (const { value: elemValue } of elem) {

            yield `${block}${ELEM_CONNECTOR}${elemValue}`;
        }
    }

    if (typeof block === 'string' && typeof elem === 'string') {
        yield `${block}${ELEM_CONNECTOR}${elem}`;
    }
};

export function* constructMods(bemProps: BEMProps) {
    const { elem, mods } = bemProps;

    if (!mods || (!elem?.length && !mods?.length)) {
        return EMPTY;
    }

    // If 'block' is top level and we don't have 'elem', apply 'mods' to 'block'
    if (!elem && !elem?.length) {
        for (const block of constructBlock(bemProps)) {
            if (Array.isArray(mods)) {
                if (!block) {
                    continue;
                }

                for (const mod of mods) {
                    if (types.isStringLiteral(mod) && block) {
                        yield `${block}${MODS_CONNECTOR}${mod.value}`;
                    }

                    if (types.isObjectProperty(mod)) {
                        mod.key = mod.key as Identifier;

                        if (PASSIVE) {
                            console.warn(`${mod.key.name} is an object property, but passive mode is enabled. Please use a string literal instead.`);
                        }
                        else {
                            yield `${block}${MODS_CONNECTOR}${mod.key.name}`;
                        }
                    }
                }
            }

            if (block && typeof mods === 'string') {
                yield `${block}${MODS_CONNECTOR}${mods}`;
            }
        }

        return EMPTY;
    }
    else {
        for (const elem of constructElem(bemProps)) {
            if (Array.isArray(mods)) {
                for (const mod of mods) {
                    if (!elem) {
                        continue;
                    }

                    if (mod && typeof mod === 'string') {
                        yield `${elem}${MODS_CONNECTOR}${mod}`;
                    }

                    if (types.isObjectProperty(mod)) {
                        mod.key = mod.key as Identifier;

                        if (PASSIVE) {
                            console.warn(`${mod.key.name} is an object property, but passive mode is enabled. Please use a string literal instead.`);
                        }
                        else {
                            yield `${elem}${MODS_CONNECTOR}${mod.key.name}`;
                        }
                    }
                }
            }

            if (elem && typeof mods === 'string') {
                yield `${elem}${MODS_CONNECTOR}${mods}`;
            }
        }
    }

    return EMPTY;
}

export const construct = (bemProps: BEMProps) => {
    let _block = EMPTY;
    let _elem = EMPTY;
    let _mods = EMPTY;
    let _conditionalExpressions: ConditionalExpression[] = [];

    for (const blockItem of constructBlock(bemProps)) {
        const SPACE = _block ? WHITESPACE : EMPTY;
        _block = `${_block}${SPACE}${blockItem}`;
    }

    for (const elemItem of constructElem(bemProps)) {
        const SPACE = _elem ? WHITESPACE : EMPTY;
        _elem = `${_elem}${SPACE}${elemItem}`;
    }

    if (Array.isArray(bemProps.mods)) {
        const modsIterator = constructMods(bemProps);

        for (const mod of bemProps.mods) {
            if (types.isObjectProperty(mod)) {
                const conditionalExpression = getConditionalExpression(mod, modsIterator);

                if (!conditionalExpression) {
                    continue;
                }

                _conditionalExpressions.push(conditionalExpression);
            }
        }
    }

    for (const modsItem of constructMods(bemProps)) {
        const SPACE = _mods ? WHITESPACE : EMPTY;
        _mods = `${_mods}${SPACE}${modsItem}`;
    }

    const SPACE_AFTER_BLOCK = _block && (_elem || _mods)
        ? WHITESPACE
        : EMPTY;
    const SPACE_AFTER_ELEM = _elem && (_mods || _conditionalExpressions.length)
        ? WHITESPACE
        : EMPTY;
    const CLASS_NAME = _conditionalExpressions.length
        ? `${_block}${SPACE_AFTER_BLOCK}${_elem}${SPACE_AFTER_ELEM}`
        : `${_block}${SPACE_AFTER_BLOCK}${_elem}${SPACE_AFTER_ELEM}${_mods}`;

    // console.log(CLASS_NAME.replace(/\s/g, '[SPACE]'));

    if (!PASSIVE && _conditionalExpressions.length) {
        return (
            types.jsxAttribute(
                types.jsxIdentifier(BEMPropTypes.CLASSNAME),
                types.jsxExpressionContainer(
                    types.templateLiteral(
                        [
                            types.templateElement({ raw: CLASS_NAME }, false),
                            ..._conditionalExpressions.map(() => types.templateElement({ raw: '' }, false))
                        ],
                        _conditionalExpressions
                    )
                )
            )
        );
    }

    return (
        types.jsxAttribute(
            types.jsxIdentifier(BEMPropTypes.CLASSNAME),
            types.stringLiteral(CLASS_NAME)
        )
    );
}

const getConditionalExpression = (mod: ObjectProperty, modsIterator: any) => {
    if (!mod) {
        return;
    }

    const modValue = modsIterator.next().value;

    if (modValue) {
        return types.conditionalExpression(
            // Pass in an array with a single ObjectProperty value
            types.objectExpression([mod]),
            types.stringLiteral(modValue),
            types.stringLiteral(EMPTY)
        );
    }
}

export default construct;
