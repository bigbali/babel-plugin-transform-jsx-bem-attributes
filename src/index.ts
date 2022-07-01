import type {
    NodePath,
    PluginObj as Plugin,
} from '@babel/core';
import type {
    JSXAttribute,
    JSXIdentifier,
    StringLiteral,
    SourceLocation
} from '@babel/types';
import * as types from '@babel/types';
import {
    Attribute,
    BEMProps,
    BEMPropTypes,
    Block,
    isArray,
    isObjectPropertyArray
} from './types';
import {
    BEM_PROP_TYPES,
    COMMA,
    DISABLE_BLOCK_INHERITANCE,
    EMPTY,
    WHITESPACE
} from './constants';
import construct from './construct';

export default function (): Plugin {
    return {
        name: 'transform-bem-props',
        visitor: {
            JSXElement(element) {
                traverseJSXElementTree(element, EMPTY);

                // Don't traverse child nodes, as we will do that manually
                element.skip()
            }
        }
    };
};

/**
 * Recursively traverses the JSXElement tree and constructs the 'className' attribute
 * @param element - The JSXElement to recursively traverse
 * @param block - Passed to the next iteration to allow block inheritance
 */
const traverseJSXElementTree = (element: NodePath<babel.types.JSXElement>, block: Block) => {
    const {
        node: {
            openingElement: {
                attributes,
                loc,
                name: htmlTagName
            }
        }
    } = element;

    let attributeIndexesToRemove: number[] = [];
    let hasFoundBlock = false;

    let bemProps: BEMProps = {
        block,
        elem: EMPTY,
        mods: EMPTY,
        className: EMPTY
    };

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

            if (value) {
                bemProps[name] = value;

                if (name === BEMPropTypes.BLOCK) {
                    hasFoundBlock = true;
                }
            }
        }

        // attribute={/* this is a JSX expression container */}
        if (types.isJSXExpressionContainer(valueNode)) {
            const { expression } = valueNode;

            if (types.isStringLiteral(expression)) {
                const { value } = expression;

                if (value) {
                    bemProps[name] = value;

                    if (name === BEMPropTypes.BLOCK) {
                        hasFoundBlock = true;
                    }
                }
            }

            if (types.isArrayExpression(expression)) {
                const { elements } = expression as { elements: StringLiteral[] };

                if (elements.length) {
                    bemProps[name] = elements;

                    if (name === BEMPropTypes.BLOCK) {
                        hasFoundBlock = true;
                    }
                }
            }

            if (types.isObjectExpression(expression) && name === BEMPropTypes.MODS) {
                const { properties } = expression;

                if (isObjectPropertyArray(properties)) {
                    bemProps.mods = properties;
                }
            }
        }

        attributeIndexesToRemove.push(index);
    });

    // If there was no new 'block' defined on the element, but 'elem' or 'mods' were
    if (!hasFoundBlock && (bemProps.elem || bemProps.mods)
        && DISABLE_BLOCK_INHERITANCE()) {
        handleUndefinedBlock(
            bemProps.block,
            htmlTagName as JSXIdentifier,
            loc as SourceLocation
        );
    }

    // Remove all attributes that were processed.
    // The reason for not removing it directly in the loop
    // is that it messes up the indexes of the attributes, leading to skipped elements.
    const attributePaths = element.get('openingElement.attributes') as NodePath<JSXAttribute>[];
    attributeIndexesToRemove.forEach(attributeIndex => {
        attributePaths[attributeIndex].remove();
    })

    const classNameAttribute = construct(bemProps) as babel.types.JSXAttribute;

    if (classNameAttribute) {
        const { value } = classNameAttribute;

        if ((types.isStringLiteral(value) && value.value)
            || types.isJSXExpressionContainer(value)) {
            attributes.push(classNameAttribute);
        }
    }

    element.get('children').forEach(childElement => {
        if (!types.isJSXElement(childElement)) {
            return;
        }

        traverseJSXElementTree(childElement as NodePath<babel.types.JSXElement>, bemProps.block);
    });
};

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

    const inheritedBlock = isArray(block)
        ? block.reduce(reducer, EMPTY)
        : block;
    const inheritedMessage = inheritedBlock
        ? `Inherited [${inheritedBlock}], but block inheritance is disabled.`
        : 'Did not inherit from parent.';

    const message = `Block is not defined on <${name}> at line ${line}, column ${column}. ${inheritedMessage}`;

    throw Error(message);
}
