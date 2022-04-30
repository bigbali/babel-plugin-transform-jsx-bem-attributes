import * as Babel from '@babel/core';

const bemPropTypes = [
    'block',
    'elem',
    'mods'
];

export default function (babel: typeof Babel): Babel.PluginObj {
    const { types } = babel;

    return {
        name: 'transform-bem-props',
        visitor: {
            JSXElement(element) {
                const opening = element.get('openingElement');
                const attributes = opening.get('attributes');
                // const opening = element.node.openingElement;
                // const attributes = opening.node.attributes;

                let className = "";

                let bemProps = {
                    block: "",
                    elem: "",
                    mods: {}
                };

                for (const attribute of attributes) {
                    // @ts-ignore
                    const name = attribute.node.name.name;
                    // @ts-ignore
                    const valueNode = attribute.node.value;

                    if (name === "className") {
                        className = valueNode.value;
                        // @ts-ignore
                        attribute.remove();
                    }

                    // @ts-ignore
                    if (types.isJSXAttribute(attribute)) {
                        if (bemPropTypes.includes(name)) {
                            // @ts-ignore
                            bemProps[name] = valueNode.value;
                            // @ts-ignore
                            attribute.remove();
                        }
                    }
                }

                if (bemProps.block) {
                    className = `${className} ${bemProps.block}`;

                    if (bemProps.elem) {
                        className = `${className} ${bemProps.block}-${bemProps.elem}`
                    }
                }

                if (className) { // Create the className attribute
                    const classNameProp = types.jsxAttribute(
                        types.jsxIdentifier('className'),
                        types.stringLiteral(className)
                    );

                    // We can't push onto the attributes we got earlier,
                    // so we do this.
                    opening.node.attributes.push(classNameProp);
                }
            }
        }
    };
};
