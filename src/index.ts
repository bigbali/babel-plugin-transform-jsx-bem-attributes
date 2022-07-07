import {
    NodePath,
    PluginObj as Plugin,
    types
} from '@babel/core';
// import type {
//     JSXAttribute,
//     JSXIdentifier,
//     StringLiteral,
//     SourceLocation,
//     ObjectProperty,
//     ObjectMethod,
//     JSXElement
// } from '@babel/types';
// import * as types from '@babel/types';
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
const traverseJSXElementTree = (element: NodePath<types.JSXElement>, block: Block) => {
    const openingElement = element.get('openingElement');
    const attributePaths = openingElement.get('attributes');

    const BEM_PROPS: BEMProps = {
        block,
        elem: null,
        mods: null,
        className: null
    };

    let hasFoundBlock = false;

    const assignValue = <T>(attrName: keyof BEMProps, attrValue: T, attrKey?: keyof T) => {
        const value = attrKey ? attrValue[attrKey] : attrValue;

        if ((isArray(value) && value.length) || value) { // @ts-ignore
            BEM_PROPS[attrName] = value;

            if (attrName === BEMPropTypes.BLOCK) {
                hasFoundBlock = true;
            }
        }
    };

    attributePaths.forEach((attributePath, index) => {
        const { node } = attributePath;

        if (types.isJSXSpreadAttribute(node)) {
            throw attributePath.buildCodeFrameError('Spread attributes are not supported.');
        }

        const {
            value: attrValue,
            name: {
                name: attrName
            }
        } = node as Attribute;

        if (!BEM_PROP_TYPES.includes(attrName)) {
            return;
        }

        if (types.isStringLiteral(attrValue)) {
            assignValue(attrName, attrValue, 'value');
        }

        if (types.isJSXExpressionContainer(attrValue)) {
            const { expression } = attrValue;

            if (types.isStringLiteral(expression)) {
                assignValue(attrName, expression, 'value');
            } else if (types.isArrayExpression(expression)) {
                assignValue(attrName, expression, 'elements');
            } else if (types.isCallExpression(expression)) {
                assignValue(attrName, expression);
            } else if (types.isTemplateLiteral(expression)) {
                assignValue(attrName, expression);
            } else {
                throw attributePath.buildCodeFrameError('This attribute value is unsupported.');
            }

            if (attrName === BEMPropTypes.MODS) {
                if (types.isObjectExpression(expression)) {
                    assignValue(attrName, expression, 'properties');
                }
            }
        }

        // attributeIndexesToRemove.push(index);
    });

    // If there was no new 'block' defined on the element, but 'elem' or 'mods' were
    // if (!hasFoundBlock && (bemProps.elem || bemProps.mods)
    //     && DISABLE_BLOCK_INHERITANCE()) {
    //     handleUndefinedBlock(
    //         bemProps.block,
    //         htmlTagName as JSXIdentifier,
    //         loc as SourceLocation
    //     );
    // }

    // Remove all attributes that were processed.
    // The reason for not removing it directly in the loop
    // is that it messes up the indexes of the attributes, leading to skipped elements.
    // const attributePaths = element.get('openingElement.attributes') as NodePath<JSXAttribute>[];
    // if ((bemProps.block && hasFoundBlock) || bemProps.elem || bemProps.mods) {
    //     attributeIndexesToRemove.forEach(attributeIndex => {
    //         attributePaths[attributeIndex].remove();
    //     });
    // }

    // When block inheritance is disabled, we will need to have defined on every line a new block,
    // therefore hasFoundBlock would be always true. So, to correctly check if block is top level,
    // compare the newly assigned block to the one from the previous iteration.
    // (if they match => they are the same, which means we have in fact *not* found a new block)
    // If you are trying to understand what is happening below, please forgive me :|
    // const isBlockTopLevelEvaluation = typeof bemProps.block === 'string'
    //     ? (hasFoundBlock && bemProps.block !== block)
    //     : isArray(bemProps.block) && isArray(block) // When both are arrays, compare them
    //         ? hasFoundBlock && JSON.stringify(bemProps.block) === JSON.stringify(block)
    //         : ( // When they have differing types, we know block is top level
    //             isArray(bemProps.block) && typeof block === 'string'
    //             || isArray(block) && typeof bemProps.block === 'string'
    //         );

    // const isBlockTopLevel = DISABLE_BLOCK_INHERITANCE()
    //     ? isBlockTopLevelEvaluation || (!block && hasFoundBlock)
    //     : hasFoundBlock;
    // const classNameAttribute = construct(bemProps, isBlockTopLevel) as babel.types.JSXAttribute;

    // if (classNameAttribute) {
    //     const { value } = classNameAttribute;

    //     if ((types.isStringLiteral(value) && value.value)
    //         || types.isJSXExpressionContainer(value)) {
    //         attributes.push(classNameAttribute);
    //     }
    // }

    // @ts-ignore
    attributePaths.push(BEM_PROPS);
    console.log(BEM_PROPS);

    element.get('children').forEach(childElement => { // Here happens the recursive traversal
        if (types.isJSXElement(childElement.node)) {
            traverseJSXElementTree(childElement as NodePath<types.JSXElement>, BEM_PROPS.block);
        }
    });
};

// const handleUndefinedBlock = (block: Block, htmlTagName: JSXIdentifier, location: SourceLocation) => {
//     const { name } = htmlTagName;
//     const {
//         start: {
//             line,
//             column
//         } = {
//             line: 'unknown',
//             column: 'unknown'
//         },
//     } = location || {};

//     const reducer = (acc: string, value: StringLiteral) => {
//         const SEPARATOR = (acc && value.value)
//             ? `${COMMA}${WHITESPACE}`
//             : EMPTY;

//         return `${acc}${SEPARATOR}${value.value}`;
//     };

//     const inheritedBlock = isArray(block)
//         ? block.reduce(reducer, EMPTY)
//         : block;
//     const inheritedMessage = inheritedBlock
//         ? `Inherited [${inheritedBlock}], but block inheritance is disabled.`
//         : 'Did not inherit from parent.';

//     const message = `Block is not defined on <${name}> at line ${line}, column ${column}. ${inheritedMessage}`;

//     throw Error(message);
// };
