import * as Babel from '@babel/core';
import {
    JSXAttribute,
    ObjectProperty,
    ObjectExpression,
} from '@babel/types';

import convertObjectPropertiesToConditionalExpressions from './utils/convertObjectPropertiesToConditionalExpressions';
import convertObjectPropertiesToString from './utils/convertObjectPropertiesToString';

// TODO: actual tests
// TODO: remove need for repeating 'block' in order to use 'elem' if already defined on parent element
// TODO: refactor
interface IBEMProps {
    block: string;
    elem?: string;
    mods?: ObjectProperty[] | string;
};

enum BEMPropTypes {
    BLOCK = 'block',
    ELEM = 'elem',
    MODS = 'mods',
    CLASSNAME = 'className'
}

const bemPropTypes: string[] = [
    BEMPropTypes.BLOCK,
    BEMPropTypes.ELEM,
    BEMPropTypes.MODS,
    BEMPropTypes.CLASSNAME
];

// process.env.REACT_BEM_MODE_PASSIVE = 'true';

// Node.js environment variables
export const IS_PASSIVE = process.env.REACT_BEM_MODE_PASSIVE;
export const ELEM_CONNECTOR = process.env.REACT_BEM_ELEM_CONNECTOR || '-';
export const MODS_CONNECTOR = process.env.REACT_BEM_MODS_CONNECTOR || '_';

export default function ({ types }: typeof Babel): Babel.PluginObj {
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

                        if (name === BEMPropTypes.CLASSNAME) {
                            className = valueNode.value;
                        }
                    }

                    // When we have mods={`${conditional ? 'this' : 'that'}`}
                    if (types.isJSXExpressionContainer(valueNode) && name === BEMPropTypes.MODS) {
                        bemProps.mods = (valueNode.expression as ObjectExpression).properties as ObjectProperty[];
                    }

                    // Remove all BEM attributes. If the 'className' attribute exists,
                    // it will be replaced by our custom one.
                    attribute.remove();
                });

                if (bemProps.block) {
                    className = `${className ? `${className} ` : ''}${bemProps.block}`;

                    if (bemProps.elem) {
                        className = `${className} ${bemProps.block}${ELEM_CONNECTOR}${bemProps.elem}`

                        if (typeof bemProps.mods === 'string') {
                            className = `${className} ${bemProps.block}${ELEM_CONNECTOR}${bemProps.elem}${MODS_CONNECTOR}${bemProps.mods}`;
                        }
                    }
                }

                if (!className) { // It is possible that we don't have any props to construct 'className' from
                    return;
                }

                let classNameProp;

                // We don't need to do anything if 'mods' is already in string format,
                // so we just convert it if it's an object
                if (IS_PASSIVE && typeof bemProps.mods === 'object') {
                    const modsString = convertObjectPropertiesToString(
                        bemProps.mods,
                        `${bemProps.block}${bemProps.elem ? `${ELEM_CONNECTOR}${bemProps.elem}` : ''}`
                    );

                    if (modsString) {
                        className = `${className} ${modsString}`;
                    }
                }

                if (IS_PASSIVE || typeof bemProps.mods === 'string') {
                    classNameProp = types.jsxAttribute(
                        types.jsxIdentifier(BEMPropTypes.CLASSNAME),
                        types.stringLiteral(className)
                    );
                }
                else if (typeof bemProps.mods === 'object' && bemProps.mods.length && !IS_PASSIVE) {
                    const conditionalExpressions = convertObjectPropertiesToConditionalExpressions(
                        bemProps.mods,
                        `${bemProps.block}${bemProps.elem ? `${ELEM_CONNECTOR}${bemProps.elem}` : ''}`
                    );

                    // Construct a template literal with conditional expressions
                    classNameProp = types.jsxAttribute(
                        types.jsxIdentifier(BEMPropTypes.CLASSNAME),
                        types.jsxExpressionContainer(
                            types.templateLiteral(
                                [
                                    types.templateElement({ raw: `${className} ` }, false),
                                    ...conditionalExpressions.map(() => types.templateElement({ raw: '' }, false))
                                ],
                                conditionalExpressions
                            )
                        )
                    );
                }

                if (classNameProp) {
                    // We can't push directly onto the NodePath[] attributes we worked with earlier
                    opening.node.attributes.push(classNameProp);
                }
            }
        }
    };
};
