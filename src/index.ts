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

// import convertObjectPropertiesToConditionalExpressions from './utils/convertObjectPropertiesToConditionalExpressions';
import convertObjectPropertiesToString from './utils/convertObjectPropertiesToString';

type Block = string | StringLiteral[];
type Elem = string | StringLiteral[];
type Mods = string | StringLiteral[] | ObjectProperty[];
type ClassName = string | StringLiteral[];

export interface BEMProps {
    block: Block;
    elem?: Elem;
    mods?: Mods;
    className?: ClassName;
    blockIsTopLevel: boolean;
};

interface Attribute {
    value: StringLiteral | JSXExpressionContainer,
    name: {
        name: `${BEMPropTypes}` & keyof BEMProps
    };
}

export enum BEMPropTypes {
    BLOCK = 'block',
    ELEM = 'elem',
    MODS = 'mods',
    CLASSNAME = 'className'
}

const BEM_PROP_TYPES: string[] = [
    BEMPropTypes.BLOCK,
    BEMPropTypes.ELEM,
    BEMPropTypes.MODS,
    BEMPropTypes.CLASSNAME
];

const constructMods = ({ block, elem, mods }: BEMProps) => {
    // if (mods?.length && types.isObjectExpression(mods[0] as object)) {
    //     return convertObjectPropertiesToString(
    //         mods as ObjectProperty[],
    //         `${block}${elem ? `${ELEM_CONNECTOR}${elem}` : ''}`
    //     );
    // }
    // // console.log(elem, mods)
    // return `${block}${ELEM_CONNECTOR}${elem}${MODS_CONNECTOR}${mods}`;

};

const constructClassName = ({ className }: BEMProps) => {
    // console.log(className)
    // return className || '';
};

const transformationMap = {
    [BEMPropTypes.BLOCK]: constructBlock,
    [BEMPropTypes.ELEM]: constructElem,
    [BEMPropTypes.MODS]: constructMods,
    [BEMPropTypes.CLASSNAME]: constructClassName,
}


// process.env.REACT_BEM_MODE_PASSIVE = 'true';

// Node.js environment variables
export const PASSIVE = process.env.REACT_BEM_MODE_PASSIVE;
export const DISABLE_BLOCK_INHERITANCE = process.env.REACT_BEM_DISABLE_BLOCK_INHERITANCE;
export const ELEM_CONNECTOR = process.env.REACT_BEM_ELEM_CONNECTOR || '-';
export const MODS_CONNECTOR = process.env.REACT_BEM_MODS_CONNECTOR || '_';

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

        // if (isActive) {
        //     const conditionalExpressions = convertObjectPropertiesToConditionalExpressions(bemProps);

        //     // Construct a template literal with conditional expressions
        //     classNameProp = types.jsxAttribute(
        //         types.jsxIdentifier(BEMPropTypes.CLASSNAME),
        //         types.jsxExpressionContainer(
        //             types.templateLiteral(
        //                 [
        //                     types.templateElement({ raw: `${className} ` }, false),
        //                     ...conditionalExpressions.map(() => types.templateElement({ raw: '' }, false))
        //                 ],
        //                 conditionalExpressions
        //             )
        //         )
        //     );
        // }
        // else {
        //     classNameProp = types.jsxAttribute(
        //         types.jsxIdentifier(BEMPropTypes.CLASSNAME),
        //         types.stringLiteral(className)
        //     );
        // }

        // log(element);
        // console.log(bemProps.blockIsTopLevel);

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
    if (classNameAttribute) {
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

