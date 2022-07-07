import * as types from '@babel/types';
import {
    ConditionalExpression,
    Identifier,
    ObjectProperty,
    Expression
} from '@babel/types';
import {
    WHITESPACE,
    EMPTY,
    ELEM_CONNECTOR,
    MODS_CONNECTOR
} from './constants';
import {
    BEMProps,
    BEMPropTypes,
    isArray
} from './types';

export function* constructBlock({ block }: BEMProps, shouldSkip?: boolean) {
    if (shouldSkip) {
        return;
    }

    if (!block.length || shouldSkip) {
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

    if (block.length === 0 || !elem || elem.length === 0) {
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

                yield `${_block}${ELEM_CONNECTOR()}${_elem}`;
            }
        }

        if (typeof elem === 'string' && elem) {
            yield `${_block}${ELEM_CONNECTOR()}${elem}`;
        }
    }
};

export function* constructMods(bemProps: BEMProps, isBlockTopLevel: boolean) {
    const { elem, mods } = bemProps;

    if (!isBlockTopLevel && !elem?.length) {
        return EMPTY;
    }

    // If mods is empty string or
    if (!mods || (!elem?.length && !(mods?.length || Object.keys(mods).length))) {
        return EMPTY;
    }

    // If we have 'elem', use that, otherwise use 'block'
    const modsPrefixIterator = elem?.length
        ? constructElem(bemProps)
        : constructBlock(bemProps);

    const prefixes: string[] = [];

    for (const prefix of modsPrefixIterator) {
        prefixes.push(prefix);
    }

    if (isArray(mods)) {
        for (const mod of mods) {
            if (types.isStringLiteral(mod) && mod.value) {
                yield prefixes.reduce((acc, prefix) => {
                    const SPACE_AFTER_ACC = acc && prefix
                        ? WHITESPACE
                        : EMPTY;

                    return prefix
                        ? `${acc}${SPACE_AFTER_ACC}${prefix}${MODS_CONNECTOR()}${mod.value}`
                        : EMPTY;
                }, EMPTY);
            }

            if (types.isObjectProperty(mod)) {
                const { key, value } = mod;
                const modName = types.isIdentifier(key)
                    ? key.name
                    : types.isStringLiteral(key)
                        ? key.value
                        : EMPTY;

                // When the right hand side of the object property is a boolean and is false,
                // omit it altogether
                if (types.isBooleanLiteral(value) && !value.value) {
                    continue;
                }

                yield prefixes.reduce((acc, prefix) => {
                    const SPACE_AFTER_ACC: string = acc && prefix
                        ? WHITESPACE
                        : EMPTY;

                    return prefix
                        ? `${acc}${SPACE_AFTER_ACC}${prefix}${MODS_CONNECTOR()}${modName}`
                        : EMPTY;
                }, EMPTY);
            }
        }
    }

    if (prefixes.length && typeof mods === 'string') {
        yield prefixes.reduce((acc, prefix) => {
            const SPACE_AFTER_ACC = acc && prefix
                ? WHITESPACE
                : EMPTY;

            return prefix
                ? `${acc}${SPACE_AFTER_ACC}${prefix}${MODS_CONNECTOR()}${mods}`
                : EMPTY;

        }, EMPTY);
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
};

export const construct = (bemProps: BEMProps, isBlockTopLevel: boolean) => {
    const _className = constructClassName(bemProps);
    const _conditionalExpressions: ConditionalExpression[] = [];
    let _block = EMPTY;
    let _elem = EMPTY;
    let _mods = EMPTY;

    if (isBlockTopLevel) { // If block is inherited, we don't want it in the className by itself
        for (const block of constructBlock(bemProps, !isBlockTopLevel)) {
            const SPACE = _block ? WHITESPACE : EMPTY;
            _block = `${_block}${SPACE}${block}`;
        }
    }

    for (const elem of constructElem(bemProps)) {
        const SPACE = _elem ? WHITESPACE : EMPTY;
        _elem = `${_elem}${SPACE}${elem}`;
    }

    for (const mod of constructMods(bemProps, isBlockTopLevel)) {
        const SPACE = _mods ? WHITESPACE : EMPTY;
        _mods = `${_mods}${SPACE}${mod}`;
    }

    if (isArray(bemProps.mods)) {
        const modsIterator = constructMods(bemProps, isBlockTopLevel);

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

    // If we have conditional expresssions, construct template literals using them
    if (_conditionalExpressions.length) {
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

    // By default, we'll use a simple string literal
    return (
        types.jsxAttribute(
            types.jsxIdentifier(BEMPropTypes.CLASSNAME),
            types.stringLiteral(CLASS_NAME)
        )
    );
};

const getConditionalExpression = (mod: ObjectProperty, modsIterator: Generator<string, string, string>) => {
    if (!mod) {
        return;
    }

    const modValue = modsIterator.next().value;

    if (!modValue) {
        return;
    }

    return types.conditionalExpression(
        mod.value as Exclude<types.Expression, types.RestElement>,
        types.stringLiteral(modValue),
        types.stringLiteral(EMPTY)
    );
};

export default construct;
