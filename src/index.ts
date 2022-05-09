import * as Babel from '@babel/core';
import {
    JSXAttribute,
    ObjectProperty,
    ObjectExpression
} from '@babel/types';

import convertObjectPropertiesToConditionalExpressions from './utils/convertObjectPropertiesToConditionalExpressions';

// TODO: fix disregarded 'className'
// TODO: add support for passive mods (replaces template literal with static string)
// TODO: add support for more config
// TODO: remove need for repeating 'block' in order to use 'elem' if already defined on parent element
// TODO: refactor
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
                let className = '';
                let bemProps: IBEMProps = {
                    block: '',
                    elem: '',
                    mods: []
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

                    if (name === 'mods') {
                        if (types.isJSXExpressionContainer(valueNode)) {
                            // TODO what the duck is this
                            bemProps.mods = (valueNode.expression as ObjectExpression).properties as ObjectProperty[];
                        }

                        if (types.isStringLiteral(valueNode)) {
                            bemProps.mods = valueNode.value;
                        }
                    }

                    // Remove all BEM attributes. If the 'className' attribute exists,
                    // it will be replaced by our custom one.
                    attribute.remove();
                });

                if (bemProps.block) {
                    className = `${className ? `${className} ` : ''}${bemProps.block}`;

                    if (bemProps.elem) {
                        className = `${className} ${bemProps.block}-${bemProps.elem}`

                        if (typeof bemProps.mods === 'string') {
                            className = `${bemProps.block}-${bemProps.elem}_${bemProps.mods}`;
                        }
                    }
                }

                if (className) { // Create the 'className' attribute
                    let classNameProp;

                    if (typeof bemProps.mods === 'object' && !isPassiveMode) {
                        const conditionalExpressions = convertObjectPropertiesToConditionalExpressions(
                            bemProps.mods,
                            `${bemProps.block}${bemProps.elem ? `-${bemProps.elem}` : ''}`
                        );

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
                    }
                    else {
                        classNameProp = types.jsxAttribute(
                            types.jsxIdentifier('className'),
                            types.stringLiteral(className)
                        );
                    }

                    // We can't push directly onto the NodePath[] attributes we worked with earlier
                    opening.node.attributes.push(classNameProp);
                }
            }
        }
    };
};
