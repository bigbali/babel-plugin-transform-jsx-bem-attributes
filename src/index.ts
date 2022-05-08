import * as Babel from '@babel/core';
import {
    JSXAttribute,
    ObjectProperty
} from '@babel/types';

import convertObjectPropertiesToConditionalExpressions from './utils/convertObjectPropertiesToConditionalExpressions';

// TODO: add support for string mods
// TODO: add support for passive mods
// TODO: add support for more config
interface IBEMProps {
    block: string;
    elem?: string;
    mods?: ObjectProperty[] | string;
};

const bemPropTypes = [
    'block',
    'elem',
    'mods',
    'className'
];


export default function (babel: typeof Babel): Babel.PluginObj {
    const { types } = babel;
    const isPassiveMode = process.env.REACT_BEM_MODE === 'passive';

    return {
        name: 'transform-bem-props',
        visitor: {
            JSXElement(element) {
                const opening = element.get('openingElement');
                const attributes = opening.get('attributes') as Babel.NodePath<JSXAttribute>[];
                let className = "";
                let bemProps: IBEMProps = {
                    block: "",
                    elem: "",
                    mods: [],
                };

                attributes.forEach(attribute => {
                    if (!types.isJSXAttribute(attribute)) {
                        return;
                    }

                    const name = attribute.node.name.name as string;
                    const valueNode = attribute.node.value;

                    if (!bemPropTypes.includes(name)) {
                        return;
                    }

                    if (types.isStringLiteral(valueNode)) {
                        bemProps[name as keyof IBEMProps] = valueNode.value;
                    }

                    if (types.isJSXExpressionContainer(valueNode) && name === 'mods') {
                        // @ts-ignore
                        bemProps.mods = valueNode.expression.properties;
                    }

                    attribute.remove();
                });



                if (bemProps.block) {
                    className = `${className} ${bemProps.block}`;

                    if (bemProps.elem) {
                        className = `${className} ${bemProps.block}-${bemProps.elem}`
                    }
                }

                if (className) { // Create the className attribute
                    let classNameProp;

                    if (typeof bemProps.mods === 'object' && !isPassiveMode) {
                        const conditionalExpressions = convertObjectPropertiesToConditionalExpressions(bemProps.mods);

                        classNameProp = types.jsxAttribute(
                            types.jsxIdentifier('className'),
                            types.jsxExpressionContainer(
                                types.templateLiteral(
                                    [
                                        types.templateElement({ raw: className }, false),
                                        ...conditionalExpressions.map(() => types.templateElement({ raw: '' }, false))
                                    ],
                                    conditionalExpressions
                                )
                            )
                        );
                    } else {
                        classNameProp = types.jsxAttribute(
                            types.jsxIdentifier('className'),
                            types.stringLiteral(className)
                        );
                    }

                    // We can't push onto the attributes we got earlier,
                    // so we do this.
                    opening.node.attributes.push(classNameProp);
                }
            }
        }
    };
};
