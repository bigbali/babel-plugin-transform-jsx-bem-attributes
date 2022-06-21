import {
    NodePath,
    PluginObj as Plugin,
} from '@babel/core';
import * as babel from '@babel/core';
import {
    JSXAttribute,
    JSXElement,
    JSXIdentifier,
    StringLiteral,
    SourceLocation
} from '@babel/types';
import {
    Attribute,
    BEMProps,
    BEMProps2,
    BEMPropTypes,
    Block,
    isArray,
    isObjectPropertyArray
} from './types';
import {
    BEM_PROP_TYPES,
    COMMA,
    EMPTY,
    WHITESPACE
} from './constants';
import construct from './utils/construct';
import * as types from '@babel/types';

export default function (Babel: typeof babel): Plugin {
    const block = { value: EMPTY };

    return {
        name: 'transform-bem-props',
        visitor: {
            JSXElement(element, state) {
                traverseJSXElementTree(element, { value: EMPTY }, { value: EMPTY });

                // Don't traverse child nodes, as we will do that manually
                element.skip()
            }
        }
    };
};

/**
 * Recursively traverses the JSXElement tree and constructs the 'className' attribute
 * @param element - The JSXElement to recursively traverse
 * @param block - The block name inherited from the parent element, which is passed down to the children
 *                until another 'block' attribute is found
 */
const traverseJSXElementTree = (element: NodePath<JSXElement>, block: Block, prev: Block) => {
    const {
        node: {
            openingElement: {
                attributes,
                loc,
                name: htmlTagName
            }
        }
    } = element;

    const attributePaths = element.get('openingElement.attributes') as NodePath<JSXAttribute>[];
    let attributeIndexesToRemove: number[] = [];
    let isBlockUndefined = false;

    let bemProps: BEMProps = {
        block,
        blockIsTopLevel: prev !== block,
        elem: '',
        mods: '',
        className: ''
    };

    if (bemProps.block && !bemProps.blockIsTopLevel && process.env.BEM_JSX_DISABLE_BLOCK_INHERITANCE) {
        handleUndefinedBlock(
            bemProps.block,
            htmlTagName as JSXIdentifier,
            loc as SourceLocation,
        );

        isBlockUndefined = true;
    }

    attributes.forEach((attribute, index) => {
        const {
            value: valueNode,
            name: {
                name
            }
        } = attribute as Attribute;

        if (!BEM_PROP_TYPES.includes(name)) {
            return;
        }

        if (types.isStringLiteral(valueNode)) {
            const { value } = valueNode;

            // If we found a new 'block', we will pass it down to the next iteration
            if (name === BEMPropTypes.BLOCK && value) {
                bemProps.block = { value };
                bemProps.blockIsTopLevel = true;
            }
            // TODO: check for elem and mods also + refactor
            else { // TODO: Investigate
                // If inheritance is disabled, but we have an 'elem' or 'mods' attribute which relies on the 'block' to get the prefix,
                // we will skip all BEM attributes except 'className'
                if (isBlockUndefined && name === BEMPropTypes.CLASSNAME) {
                    bemProps.className = value;
                }
                if (!isBlockUndefined) {
                    if (name === BEMPropTypes.BLOCK) {
                        bemProps.block = { value };
                    }
                    else {
                        bemProps[name] = value;
                    }
                }
            }
        }

        // attribute={/* this is a JSX expression container */}
        if (types.isJSXExpressionContainer(valueNode)) {
            const { expression } = valueNode;

            if (types.isStringLiteral(expression)) {
                const { value } = expression;

                if (name === BEMPropTypes.BLOCK && value) {
                    bemProps.block = { value };
                    bemProps.blockIsTopLevel = true;
                }
                else {
                    if (isBlockUndefined && name === BEMPropTypes.CLASSNAME) {
                        bemProps.className = value;
                    }
                    if (!isBlockUndefined) {
                        if (name === BEMPropTypes.BLOCK) {
                            bemProps.block = { value };
                        }
                        else {
                            bemProps[name] = value;
                        }
                    }
                }
            }

            if (types.isArrayExpression(expression)) {
                const { elements } = expression as { elements: StringLiteral[] };

                if (isBlockUndefined && name === BEMPropTypes.CLASSNAME) {
                    bemProps.className = elements;
                }
                if (!isBlockUndefined) {
                    if (name === BEMPropTypes.BLOCK) {
                        bemProps.block = { value: elements };
                    }
                    else {
                        bemProps[name] = elements;
                    }
                }

                if (name === BEMPropTypes.BLOCK && elements.length) {
                    bemProps.blockIsTopLevel = true;
                }
            }

            if (types.isObjectExpression(expression) && name === BEMPropTypes.MODS) {
                const { properties } = expression;

                if (isObjectPropertyArray(properties) && !isBlockUndefined) {
                    bemProps.mods = properties;
                }
            }
        }

        attributeIndexesToRemove.push(index);
    });

    // Remove all attributes that were processed.
    // The reason for not removing it directly in the loop
    // is that it messes up the index of the attributes, leading to skipped elements.
    attributeIndexesToRemove.forEach(attributeIndex => {
        attributePaths[attributeIndex].remove();
    })

    if (bemProps.block.value) { // TODO

        // @ts-ignore
        bemProps.block = bemProps.block.value;
    }
    const classNameAttribute = construct(bemProps as unknown as BEMProps2);

    // Check if the attribute is empty, and add it only if it is not
    if (classNameAttribute) {
        const { value } = classNameAttribute;

        if ((types.isStringLiteral(value) && value.value)
            || types.isJSXExpressionContainer(value)) {
            attributes.push(classNameAttribute);
        }
    }

    element.get('children').forEach(childElement => {
        if (!types.isJSXElement(childElement) && !types.isJSXFragment(childElement)) {
            return;
        }

        traverseJSXElementTree(childElement as NodePath<JSXElement>, bemProps.block, block);
    });
};

const log = (element: NodePath<JSXElement>) => {
    if (!element.node.openingElement.attributes.length) {
        // @ts-ignore
        console.log(`${element.node.openingElement.name.name} has no attributes`)
    }

    console.log(
        // @ts-ignore
        `${element.node.openingElement.name.name} has attributes:${element.node.openingElement.attributes.map( // @ts-ignore
            attribute => ` ${(attribute as JSXAttribute).name.name} is ${(attribute as JSXAttribute).value!.type}${(attribute as JSXAttribute).value!.type === 'JSXExpressionContainer' ? ` → ${(attribute as JSXAttribute).value!.expression.type}` : ''}`)}`
    )
}

const handleUndefinedBlock = (block: Block, htmlTagName: JSXIdentifier, location: SourceLocation) => {
    const { name } = htmlTagName;
    const {
        start: {
            line,
            column
        } = {
            line: 'unknown',
            column: 'unknown'
        },
    } = location || {};

    const reducer = (acc: string, value: StringLiteral) => {
        const SEPARATOR = (acc && value.value)
            ? `${COMMA}${WHITESPACE}`
            : EMPTY;

        return `${acc}${SEPARATOR}${value.value}`;
    }

    const blockString = isArray(block.value) ? block.value.reduce(reducer, EMPTY) : block.value;
    const message = `Block is not defined on <${name}> at line ${line}, column ${column}. Inherited [${blockString}], but block inheritance is disabled.`;

    throw Error(message);
}
