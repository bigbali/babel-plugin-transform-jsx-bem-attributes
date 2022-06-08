import { types } from '@babel/core';
import { ConditionalExpression, Identifier, ObjectProperty } from '@babel/types';
import { ELEM_CONNECTOR, MODS_CONNECTOR, PASSIVE } from '../constants';
import { BEMProps, BEMPropTypes } from '../types';

// TODO??? convert from StringLiteral EVERYWHERE to string before adding to bemprops

const WHITESPACE = ' ';
const EMPTY = '';

export function* constructBlock({ block, blockIsTopLevel }: BEMProps) {
    if (!block || !blockIsTopLevel) { // Don't need block if it's inherited
        yield EMPTY;
    }

    if (Array.isArray(block)) {
        for (const { value } of block) {
            if (!value || typeof value !== 'string') {
                continue;
            }

            yield value;
        }
    }

    if (typeof block === 'string') {
        yield block;
    }
};

export function* constructElem(bemProps: BEMProps) {
    const { block, elem, mods } = bemProps;

    if (!block?.length || !elem?.length) { // Abort if we have an empty array
        return EMPTY;
    }

    for (const _block of constructBlock(bemProps)) {
        if (!_block) {
            continue;
        }

        if (Array.isArray(elem)) {
            for (const { value: elemValue } of elem) {
                if (!elemValue) {
                    continue;
                }

                yield `${_block}${ELEM_CONNECTOR}${elemValue}`;
            }
        }

        if (typeof elem === 'string' && elem) {
            yield `${_block}${ELEM_CONNECTOR}${elem}`;
        }
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

export const constructClassName = (bemProps: BEMProps) => {
    const { className } = bemProps;

    if (!className) {
        return EMPTY;
    }

    if (Array.isArray(className)) {
        return className.reduce((constructedClassName, currentClassName) => {
            const SPACE_AFTER_CLASSNAME = constructedClassName
                ? WHITESPACE
                : EMPTY;

            return `${constructedClassName}${SPACE_AFTER_CLASSNAME}${currentClassName.value}`;
        }, EMPTY);
    }

    if (typeof className === 'object') {
        return EMPTY;
    }

    return className;
}

export const construct = (bemProps: BEMProps) => {
    let _block = EMPTY;
    let _elem = EMPTY;
    let _mods = EMPTY;
    let _className = constructClassName(bemProps);
    let _conditionalExpressions: ConditionalExpression[] = [];

    for (const block of constructBlock(bemProps)) {
        const SPACE = _block ? WHITESPACE : EMPTY;
        _block = `${_block}${SPACE}${block}`;
    }

    for (const elem of constructElem(bemProps)) {
        const SPACE = _elem ? WHITESPACE : EMPTY;
        _elem = `${_elem}${SPACE}${elem}`;
    }

    for (const modsItem of constructMods(bemProps)) {
        const SPACE = _mods ? WHITESPACE : EMPTY;
        _mods = `${_mods}${SPACE}${modsItem}`;
    }

    if (Array.isArray(bemProps.mods)) {
        const modsIterator = constructMods(bemProps);

        for (const mod of bemProps.mods) {
            if (types.isObjectProperty(mod)) {
                const {
                    shorthand,
                    value
                } = mod;

                // When the right hand side of the object property is a boolean, evaluate it...
                if (types.isBooleanLiteral(value)) {
                    // ...and skip if it is false
                    if (!value.value) {
                        continue;
                    }

                    mod.key = mod.key as Identifier;
                    _mods = `${_mods}${WHITESPACE}${mod.key.name}`;

                    // Skip adding a conditional expression
                    continue;
                }

                const conditionalExpression = getConditionalExpression(mod, modsIterator);

                if (!conditionalExpression) {
                    continue;
                }

                _conditionalExpressions.push(conditionalExpression);
            }
        }
    }


    // if (Array.isArray(bemProps.mods)) {
    //     const modsIterator = constructMods(bemProps);

    //     for (const mod of bemProps.mods) {
    //         if (types.isObjectProperty(mod)) {
    //             const {
    //                 shorthand,
    //                 value
    //             } = mod;

    //             if (types.isBooleanLiteral(value)) {
    //                 if (!value.value) {
    //                     continue;
    //                 }

    //                 mod.key = mod.key as Identifier;
    //                 _mods = `${_mods}${WHITESPACE}${mod.key.name}`;

    //                 continue;
    //             }

    //             const conditionalExpression = getConditionalExpression(mod, modsIterator);

    //             if (!conditionalExpression) {
    //                 continue;
    //             }

    //             _conditionalExpressions.push(conditionalExpression);
    //         }
    //     }
    // }

    // for (const modsItem of constructMods(bemProps)) {
    //     const SPACE = _mods ? WHITESPACE : EMPTY;
    //     _mods = `${_mods}${SPACE}${modsItem}`;
    // }

    const SPACE_AFTER_BLOCK = _block && (_elem || _mods || _className)
        ? WHITESPACE
        : EMPTY;
    const SPACE_AFTER_ELEM = _elem && (_mods || _conditionalExpressions.length)
        ? WHITESPACE
        : EMPTY;
    const SPACE_AFTER_MODS = _mods && _className
        ? WHITESPACE
        : EMPTY;
    const SPACE_AFTER_CLASSNAME = _className
        ? WHITESPACE
        : EMPTY;

    const CLASS_NAME = _conditionalExpressions.length
        ? `${_block}${SPACE_AFTER_BLOCK}${_elem}${SPACE_AFTER_ELEM}${_className}${SPACE_AFTER_CLASSNAME}`
        : `${_block}${SPACE_AFTER_BLOCK}${_elem}${SPACE_AFTER_ELEM}${_mods}${SPACE_AFTER_MODS}${_className}`;

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

    if (!modValue) {
        return;
    }

    // const { 
    //     shorthand,
    //     value
    // } = mod;

    // if (types.isBooleanLiteral(value)) {
    //     const { value: booleanValue } = value;
    // }

    // objectModifier: true => convert to str, no conditional cuz its always true
    // objectModifier: false => ignore because it's always false
    // objectModifier: someVariable => evaluate based only on someVariable
    // objectModifier => shorthand, evaluate based on objectModifier

    if (!mod.shorthand) {

    }

    return types.conditionalExpression(
        // Pass in an array with a single ObjectProperty value
        // types.objectExpression([mod]),
        mod.value as Exclude<types.Expression, types.RestElement>,
        types.stringLiteral(modValue),
        types.stringLiteral(EMPTY)
    );
}

export default construct;
