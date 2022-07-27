import type {
    NodePath,
    PluginObj as Plugin,
} from '@babel/core';
import type {
    JSXAttribute,
    JSXIdentifier,
    StringLiteral,
    SourceLocation,
    ObjectProperty,
    ObjectMethod
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

    const attributeIndexesToRemove: number[] = [];
    const bemProps: BEMProps = {
        block,
        elem: EMPTY,
        mods: EMPTY,
        className: EMPTY
    };

    let hasFoundValidBlock = false;

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

                if (name === BEMPropTypes.BLOCK && value) {
                    hasFoundValidBlock = true;
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

                    if (name === BEMPropTypes.BLOCK && value) {
                        hasFoundValidBlock = true;
                    }
                }
            }

            if (types.isArrayExpression(expression)) {
                const { elements } = expression as { elements: StringLiteral[] };

                if (elements.length) {
                    bemProps[name] = elements;

                    if (name === BEMPropTypes.BLOCK && elements.length) {
                        hasFoundValidBlock = true;
                    }
                }
            }

            if (types.isObjectExpression(expression) && name === BEMPropTypes.MODS) {
                const { properties } = expression;

                bemProps.mods = properties as (ObjectProperty | ObjectMethod)[];
            }
        }

        attributeIndexesToRemove.push(index);
    });

    // If there was no new 'block' defined on the element, but 'elem' or 'mods' were
    if (!hasFoundValidBlock && (bemProps.elem || bemProps.mods)
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
    });
    // if ((bemProps.block && hasFoundValidBlock) || bemProps.elem || bemProps.mods) {
    // }

    // When block inheritance is disabled, we will need to have defined on every line a new block,
    // therefore hasFoundValidBlock would be always true. So, to correctly check if block is top level,
    // compare the newly assigned block to the one from the previous iteration.
    // (if they match => they are the same, which means we have in fact *not* found a new block)
    // If you are trying to understand what is happening below, please forgive me :|
    const isBlockTopLevelEvaluation = typeof bemProps.block === 'string'
        ? (hasFoundValidBlock && bemProps.block !== block)
        : isArray(bemProps.block) && isArray(block) // When both are arrays, compare them
            ? hasFoundValidBlock && JSON.stringify(bemProps.block) === JSON.stringify(block)
            : ( // When they have differing types, we know block is top level
                isArray(bemProps.block) && typeof block === 'string'
                || isArray(block) && typeof bemProps.block === 'string'
            );

    const isBlockTopLevel = DISABLE_BLOCK_INHERITANCE()
        ? isBlockTopLevelEvaluation || (!block && hasFoundValidBlock)
        : hasFoundValidBlock;
    const classNameAttribute = construct(bemProps, isBlockTopLevel) as babel.types.JSXAttribute;

    if (classNameAttribute) {
        const { value } = classNameAttribute;

        if ((types.isStringLiteral(value) && value.value)
            || types.isJSXExpressionContainer(value)) {
            attributes.push(classNameAttribute);
        }
    }

    element.get('children').forEach(childElement => { // Here happens the recursive traversal
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
    };

    const inheritedBlock = isArray(block)
        ? block.reduce(reducer, EMPTY)
        : block;
    const inheritedMessage = inheritedBlock
        ? `Inherited [${inheritedBlock}], but block inheritance is disabled.`
        : 'Did not inherit from parent.';

    const message = `Block is not defined on <${name}> at line ${line}, column ${column}. ${inheritedMessage}`;

    throw Error(message);
};
