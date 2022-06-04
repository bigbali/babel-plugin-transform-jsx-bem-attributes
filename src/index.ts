// import * as Babel from '@babel/core';
import { NodePath, PluginObj as Plugin } from '@babel/core';

import { visitors } from '@babel/traverse';
import {
    JSXAttribute,
    ObjectProperty,
    ObjectExpression,
    StringLiteral,
    JSXElement,
    ReturnStatement,
    JSXFragment,
    ArrayExpression,
    JSXExpressionContainer
} from '@babel/types';

import * as types from '@babel/types';

import construct, { constructBlock, constructElem } from './utils/construct';

import { Attribute, BEMProps, BEMPropTypes, Block } from './types';
import { BEM_PROP_TYPES, PASSIVE } from './constants';


// process.env.REACT_BEM_MODE_PASSIVE = 'true';


export default function (): Plugin {
    return {
        name: 'transform-bem-props',
        visitor: {
            JSXElement(element) {
                traverseJSXElementTree(element, '');

                // Don't traverse child nodes, as we will do that manually
                element.skip()
            }
        }
    };
};

/**
 * Recursively traverses the JSXElement tree and constructs the 'className' attribute
 * @param element - The JSXElement to recursively traverse
 * @param inheritedBlock - The block name inherited from the parent element, which is passed down to the children
 *                         until another 'block' attribute is found
 */
const traverseJSXElementTree = (element: NodePath<JSXElement>, inheritedBlock: Block) => {
    const {
        node: {
            openingElement: {
                attributes
            }
        }
    } = element;

    const attributePaths = element.get('openingElement.attributes') as NodePath<JSXAttribute>[];
    let attributeIndexesToRemove: number[] = [];

    let bemProps: BEMProps = {
        block: inheritedBlock,
        blockIsTopLevel: false,
        elem: '',
        mods: '',
        className: ''
    };

    let isActive = false;

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
                bemProps.block = value;
                bemProps.blockIsTopLevel = true;
            }
            else {
                bemProps[name] = value;
            }
        }

        if (types.isJSXExpressionContainer(valueNode)) {
            const { expression } = valueNode;

            // Example: block={ 'string-value' }
            if (types.isStringLiteral(expression)) {
                const { value } = expression;

                if (name === BEMPropTypes.BLOCK && value) {
                    bemProps.block = value;
                    bemProps.blockIsTopLevel = true;
                }
                else {
                    bemProps[name] = value;
                }
            }

            if (types.isArrayExpression(expression)) {
                const { elements } = expression;

                // @ts-ignore
                bemProps[name] = elements;

                if (name === BEMPropTypes.BLOCK && elements.length) {
                    bemProps.blockIsTopLevel = true;
                }
            }

            if (types.isObjectExpression(expression) && name === BEMPropTypes.MODS) {
                const { properties } = expression;

                // @ts-ignore
                bemProps.mods = properties;

                // If 'mods' is an object and passive mode is enabled
                if (!PASSIVE) {
                    isActive = true;
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

    const classNameAttribute = construct(bemProps);

    // @ts-ignore
    if (classNameAttribute && classNameAttribute.value.value) {
        attributes.push(classNameAttribute);
    }

    // console.log(`[${constructBlock(bemProps)}] [${constructElem(bemProps)}]`)

    // const x = constructElem(bemProps);

    // for (const y of x) {
    //     console.log(y);
    // }
    // constructBlock(bemProps); constructElem(bemProps);

    // console.log(bemProps.mods)


    // if (!bemProps.block) {
    //     throw Error('No block found');
    // }

    // test thing
    // if (inheritedBlock) {
    //     attributes.push(
    //         types.jsxAttribute(
    //             types.jsxIdentifier('FAKE_CLASSNAME'),
    //             // @ts-ignore
    //             types.stringLiteral(className)
    //         )
    //     );
    // }

    element.get('children').forEach(childElement => {
        if (!types.isJSXElement(childElement) && !types.isJSXFragment(childElement)) {
            return;
        }

        traverseJSXElementTree(childElement as NodePath<JSXElement>, bemProps.block);
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

