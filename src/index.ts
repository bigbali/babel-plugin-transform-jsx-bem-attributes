import {
    NodePath,
    PluginObj as Plugin,
    types
} from '@babel/core';
import {
    Attribute,
    BEMProps,
    BEMPropTypes,
    Block,
} from './types';
import {
    BEM_PROP_TYPES
} from './constants';
import { removeAttrPaths } from './util';
import constructClassNameAttribute, { EMPTY_STRING } from './construct';

const SKIP_FILE = '@bem-skip-file';
const SKIP_ELEMENT = '@bem-skip-element';

const isBlock = (attrName: string): attrName is BEMPropTypes.BLOCK => {
    return attrName === BEMPropTypes.BLOCK;
};

const isMods = (attrName: string): attrName is BEMPropTypes.MODS => {
    return attrName === BEMPropTypes.MODS;
};

const isClassName = (attrName: string): attrName is BEMPropTypes.CLASSNAME => {
    return attrName === BEMPropTypes.CLASSNAME;
};

const isJSXAttribute = (attrPath: NodePath<types.JSXAttribute | types.JSXSpreadAttribute>):
    attrPath is NodePath<types.JSXAttribute> => {
    return types.isJSXAttribute(attrPath.node);
};

export type NPJSXAttribute = NodePath<types.JSXAttribute>;
export type SupportedTypes =
    types.ArrayExpression
    | types.CallExpression
    | types.ObjectExpression
    | types.StringLiteral
    | types.TemplateLiteral
    | types.Identifier;

export type ModsArrayAbsoluteMaxLength = 1 | 2 | 3;

type Options = {
    plugin: {
        enable: boolean,
        error: 'throw' | 'warn'
    },
    block: {
        preserve: boolean
    }
};

const DEFAULT_OPTIONS: Options = {
    plugin: {
        enable: true,
        error: 'throw'
    },
    block: {
        preserve: true
    }
};

export const OPTIONS = DEFAULT_OPTIONS;

const hasPlugin = (opts: object): opts is { plugin: Options['plugin'] } => 'plugin' in opts;
const hasBlock = (opts: object): opts is { block: Options['block'] } => 'block' in opts;

export default function transformJSXBEMAttributes(): Plugin {
    return {
        name: 'transform-jsx-bem-attributes',
        pre(this) {
            if (hasPlugin(this.opts)) {
                OPTIONS.plugin = {
                    ...OPTIONS.plugin,
                    ...this.opts.plugin
                };
            }
            if (hasBlock(this.opts)) {
                OPTIONS.block = {
                    ...OPTIONS.block,
                    ...this.opts.block
                };
            }
        },
        visitor: {
            JSXElement(element, { file }) {
                if (file?.ast?.comments?.some((comment) => comment.value.includes(SKIP_FILE))) return;             // skip file
                if (element.node.leadingComments?.some((comment) => comment.value.includes(SKIP_ELEMENT))) return; // skip element
                if (!OPTIONS.plugin.enable) return;

                traverseJSXElementTree(element, null);

                // Don't traverse child nodes, as we will do that manually
                element.skipKey('children');
            }
        }
    };
};

/**
 * Recursively traverses the JSXElement tree and constructs the 'className' attribute
 * @param element - The JSXElement to recursively traverse
 * @param block - Passed to the next iteration to allow block inheritance
 */
const traverseJSXElementTree = (element: NodePath<types.JSXElement>, block: Block) => {
    const openingElement = element.get('openingElement');
    const attrPaths = openingElement.get('attributes');
    const isBlockInherited = { value: true };
    let isClassNameOnly = true;

    const BEM_PROPS: BEMProps = {
        block,
        elem: null,
        mods: null,
        className: null
    };

    const attrPathsToRemove: NodePath<types.JSXAttribute>[] = [];
    attrPaths.forEach(attrPath => {
        if (!isJSXAttribute(attrPath)) {
            return; // There's not much we can do with spread attributes, so let's skip them
        }

        const { node } = attrPath;
        const {
            value: attrValue,
            name: {
                name: attrName
            }
        } = node as Attribute;

        if (!BEM_PROP_TYPES.includes(attrName)) {
            return;
        }

        if (isClassNameOnly && attrName !== BEMPropTypes.CLASSNAME) {
            isClassNameOnly = false;
        }

        if (types.isStringLiteral(attrValue)) {
            assignString(BEM_PROPS, attrPath, attrName, attrValue, isBlockInherited);
        }

        if (types.isJSXExpressionContainer(attrValue)) {
            const { expression } = attrValue;

            if (types.isStringLiteral(expression) && expression.value) {
                assignString(BEM_PROPS, attrPath, attrName, expression, isBlockInherited);
            }

            if (isMods(attrName) && (
                types.isFunctionExpression(expression)
                || types.isArrowFunctionExpression(expression)
                || types.isCallExpression(expression)
                || types.isObjectExpression(expression)
                || types.isTemplateLiteral(expression)
                || types.isIdentifier(expression)
            )) {
                BEM_PROPS.mods = expression;
            }

            if (isClassName(attrName) && !types.isJSXEmptyExpression(expression)) { // className allows any value
                BEM_PROPS.className = attrValue;
            }
        }

        attrPathsToRemove.push(attrPath as NPJSXAttribute);
    });

    removeAttrPaths(attrPathsToRemove);

    if (!BEM_PROPS.block) {
        BEM_PROPS.elem && throwError(element, 'An \'elem\' attribute is provided, but \'block\' missing.');
        BEM_PROPS.mods && throwError(element, 'A \'mods\' attribute is provided, but \'block\' missing.');
    }

    classNameCheck: if (isClassNameOnly) {
        // INVESTIGATE:
        // without this label-break thing, we can find that SVG paths have 'className=true' on them (wtf?)
        // additionally, without this, top level element in JSX expressions {true && [<div>]<span />[</div>]}
        // don't have block, but it's children apparently receive it properly
        if (!BEM_PROPS.className) break classNameCheck;

        element.node.openingElement.attributes.push(
            types.jsxAttribute(types.jsxIdentifier('className'), BEM_PROPS.className)
        );
    }
    else {
        const classNameAttribute = constructClassNameAttribute(BEM_PROPS, element, isBlockInherited.value);
        classNameAttribute?.value && element.node.openingElement.attributes.push(classNameAttribute);
    }

    element.get('children').forEach(childElement => { // Here happens the recursive traversal
        if (types.isJSXElement(childElement.node)) {
            traverseJSXElementTree(childElement as NodePath<types.JSXElement>, BEM_PROPS.block);
        }
    });
};

const assignString = (
    BEM_PROPS: BEMProps,
    attrPath: NodePath<types.JSXAttribute>,
    attrName: BEMPropTypes,
    expression: types.StringLiteral,
    isBlockInherited: { value: boolean }
) => {
    if (expression.value === EMPTY_STRING) {
        const { start } = attrPath.node.loc || {};
        error(
            attrPath,
            `Empty string is not a valid value at ${attrName}, line ${start?.line || 'unknown'}, column ${start?.column || 'unknown'}.`
        );
    }
    if (isBlock(attrName)) {
        BEM_PROPS.block = expression;
        isBlockInherited.value = false;
        return;
    }

    BEM_PROPS[attrName] = expression;
};

export const errorMessage = (attr: BEMPropTypes, type: string, detailedType?: string) => {
    const aOrAn = (detailedType || type).at(0)?.match(/[aeiou]/) ? 'an' : 'a';

    return (
        `${aOrAn}${detailedType || type} value was passed in for the '${attr}' attribute,
        but it is explicitly disabled. See '<PLUGIN OPTIONS>.${attr === 'mods' ? 'mod' : attr}.${type}'.`
    );
};

/**
 * If error mode is 'throw', throw an error when one is found, otherwise warn in the console.
 */
export const error = (attrPath: NodePath<types.JSXAttribute>, message: string) => {
    if (OPTIONS.plugin.error === 'throw') {
        throwError(attrPath, message);
        return;
    }

    console.warn(message);
};

/**
 * A wrapper around the 'throw' keyword to allow use in logical expressions.
 */
const throwError = (attrPath: NodePath<types.JSXAttribute | types.JSXElement>, error: string) => {
    throw attrPath.buildCodeFrameError(error);
};
