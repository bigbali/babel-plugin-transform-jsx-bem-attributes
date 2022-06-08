import { types } from '@babel/core';
import { ConditionalExpression, Identifier, ObjectProperty, Expression } from '@babel/types';
import { ELEM_CONNECTOR, MODS_CONNECTOR, PASSIVE } from '../constants';
import { BEMProps, BEMPropTypes } from '../types';

// TODO??? convert from StringLiteral EVERYWHERE to string before adding to bemprops

const WHITESPACE = ' ';
const EMPTY = '';

// It's used quite a lot going forward, so let's make it simpler
const isArray = Array.isArray;

export function* constructBlock({ block, blockIsTopLevel }: BEMProps) {
    if (!block || !blockIsTopLevel) { // Don't need 'block' if it's inherited
        yield EMPTY;
    }

    if (isArray(block)) {
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
    const { block, elem } = bemProps;

    if (!block?.length || !elem?.length) { // Abort if we have an empty array / string
        return EMPTY;
    }

    for (const _block of constructBlock(bemProps)) {
        if (!_block) {
            continue;
        }

        if (isArray(elem)) {
            for (const { value: _elem } of elem) {
                if (!_elem) {
                    continue;
                }

                yield `${_block}${ELEM_CONNECTOR}${_elem}`;
            }
        }

        if (typeof elem === 'string' && elem) {
            yield `${_block}${ELEM_CONNECTOR}${elem}`;
        }
    }
};

// TODO Refactor
export function* constructMods(bemProps: BEMProps) {
    const { elem, mods } = bemProps;

    if (!mods || (!elem?.length && !mods?.length)) {
        return EMPTY;
    }

    // const x = !elem && !elem?.length ? constructelem : constructblock;

    // If 'block' is top level and we don't have 'elem', apply 'mods' to 'block'
    if (!elem && !elem?.length) {
        for (const block of constructBlock(bemProps)) {
            if (isArray(mods)) {
                if (!block) {
                    continue;
                }

                for (const mod of mods) {
                    if (types.isStringLiteral(mod) && block) {
                        yield `${block}${MODS_CONNECTOR}${mod.value}`;
                    }

                    if (types.isObjectProperty(mod)) {
                        const { key, value } = mod as { key: Identifier, value: Expression };

                        // When the right hand side of the object property is a boolean and is false,
                        // there is no point in yielding it
                        if (types.isBooleanLiteral(value) && !value.value) {
                            continue;
                        }

                        if (PASSIVE) {
                            console.warn(`${key.name} is an object property, but passive mode is enabled. Please use a string literal instead.`);
                        }
                        else {
                            yield `${block}${MODS_CONNECTOR}${key.name}`;
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
            if (isArray(mods)) {
                for (const mod of mods) {
                    if (!elem) {
                        continue;
                    }

                    if (mod && typeof mod === 'string') {
                        yield `${elem}${MODS_CONNECTOR}${mod}`;
                    }

                    if (types.isObjectProperty(mod)) {
                        const { key, value } = mod as { key: Identifier, value: Expression };

                        // When the right hand side of the object property is a boolean and is false,
                        // there is no point in yielding it
                        if (types.isBooleanLiteral(value) && !value.value) {
                            continue;
                        }

                        if (PASSIVE) {
                            console.warn(`${key.name} is an object property, but passive mode is enabled. Please use a string literal instead.`);
                        }
                        else {
                            yield `${elem}${MODS_CONNECTOR}${key.name}`;
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

    if (isArray(className)) {
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

    for (const mod of constructMods(bemProps)) {
        const SPACE = _mods ? WHITESPACE : EMPTY;
        _mods = `${_mods}${SPACE}${mod}`;
    }

    if (isArray(bemProps.mods)) {
        const modsIterator = constructMods(bemProps);

        for (const mod of bemProps.mods) {
            if (types.isObjectProperty(mod)) {
                const { value } = mod;

                // When the right hand side of the object property is a boolean, it can only be always true or always false
                // so there is no point in constructing a conditional expression
                if (types.isBooleanLiteral(value)) {
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
