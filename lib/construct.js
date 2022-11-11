"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SPACE = exports.EMPTY_STRING = void 0;
const core_1 = require("@babel/core");
const index_1 = require("./index");
const constants_1 = require("./constants");
exports.EMPTY_STRING = '';
exports.SPACE = ' ';
const buildValue = (block, elem, mods, element, isBlockInherited) => {
    const prefix = (() => {
        if (block && elem)
            return elem;
        if (block && !elem)
            return block;
    })();
    if (!prefix || !block)
        return null;
    if (core_1.types.isStringLiteral(mods) && mods.value) {
        return `${exports.SPACE}${prefix}${constants_1.MODS_CONNECTOR}${mods.value}`;
    }
    // if in options we have opted to keep block when it's top level and has elem, add it
    const templatePrefix = (!isBlockInherited && elem && index_1.OPTIONS.block.preserve)
        ? `${block}${exports.SPACE}${prefix}`
        : prefix;
    const template = core_1.types.templateLiteral([
        core_1.types.templateElement({ raw: templatePrefix || 'IF_YOU_SEE_THIS_THERE_IS_A_BIG_ERROR' }, false)
    ], []);
    if (core_1.types.isObjectExpression(mods)) {
        mods.properties.forEach((property) => {
            if (core_1.types.isSpreadElement(property))
                return;
            if (core_1.types.isObjectProperty(property)) {
                const key = (() => {
                    if (core_1.types.isIdentifier(property.key)) {
                        return property.key.name;
                    }
                    if (core_1.types.isStringLiteral(property.key)) {
                        return property.key.value;
                    }
                })();
                // If there's no key, it's pointless to continue
                if (!key)
                    return;
                // If we know that the value will always be false, then yet again no point to continue
                if (core_1.types.isBooleanLiteral(property.value) && property.value.value === false)
                    return;
                if (core_1.types.isRestElement(property.value))
                    return;
                template.expressions.push(core_1.types.conditionalExpression(property.value, core_1.types.stringLiteral(`${exports.SPACE}${prefix}${constants_1.MODS_CONNECTOR}${key}`), core_1.types.stringLiteral(exports.EMPTY_STRING)));
                template.quasis.push(core_1.types.templateElement({ raw: exports.EMPTY_STRING }));
            }
        });
    }
    if (core_1.types.isCallExpression(mods)) {
        template.expressions.push(mods);
        template.quasis.push(core_1.types.templateElement({ raw: exports.EMPTY_STRING }));
    }
    if (core_1.types.isFunctionExpression(mods) || core_1.types.isArrowFunctionExpression(mods)) {
        template.expressions.push(core_1.types.callExpression(mods, [
            core_1.types.stringLiteral(`${exports.SPACE}${prefix}${constants_1.MODS_CONNECTOR}`)
        ]));
        template.quasis.push(core_1.types.templateElement({ raw: exports.EMPTY_STRING }));
    }
    if (core_1.types.isIdentifier(mods)) {
        const binding = element.scope.getBinding(mods.name);
        if (!binding)
            return null;
        const node = binding.path.node;
        // If 'mods' is a function declaration with var/let/const, call it with prefix argument
        if (core_1.types.isVariableDeclarator(node)) {
            if (core_1.types.isFunctionExpression(node.init) || core_1.types.isArrowFunctionExpression(node.init)) {
                template.expressions.push(core_1.types.callExpression(mods, [
                    core_1.types.stringLiteral(`${exports.SPACE}${prefix}${constants_1.MODS_CONNECTOR}`)
                ]));
                template.quasis.push(core_1.types.templateElement({ raw: exports.EMPTY_STRING }));
            }
        }
        // If 'mods' is a function declaration, call it with prefix argument
        if (core_1.types.isFunctionDeclaration(node)) {
            template.expressions.push(core_1.types.callExpression(mods, [
                core_1.types.stringLiteral(`${exports.SPACE}${prefix}${constants_1.MODS_CONNECTOR}`)
            ]));
            template.quasis.push(core_1.types.templateElement({ raw: exports.EMPTY_STRING }));
        }
        // TODO handle case object
    }
    if (template.expressions.length === 0)
        return null;
    return template;
};
const constructClassNameAttribute = (BEM_PROPS, ELEMENT, IS_BLOCK_INHERITED) => {
    const { block, elem, mods, className } = BEM_PROPS;
    if (!block)
        return null;
    const BLOCK = block.value || null;
    const ELEM = elem && BLOCK
        ? `${BLOCK}${constants_1.ELEM_CONNECTOR}${elem.value}`
        : null;
    const MODS = buildValue(BLOCK, ELEM, mods, ELEMENT, IS_BLOCK_INHERITED);
    let final = exports.EMPTY_STRING;
    if (!IS_BLOCK_INHERITED) {
        // if we have both block and elem, refer to options to decide whether or not to keep block
        if ((BLOCK && ELEM && index_1.OPTIONS.block.preserve)
            || (BLOCK && !ELEM)) { // if we only have block, we keep it anyway
            final += BLOCK;
        }
        // when there is no block, we don't need space before elem
        ELEM && (final += `${index_1.OPTIONS.block.preserve ? exports.SPACE : exports.EMPTY_STRING}${ELEM}`);
    }
    else {
        ELEM && (final += ELEM);
    }
    if (typeof MODS === 'string') {
        final += MODS;
    }
    const attributeValue = (() => {
        if (typeof MODS !== 'string' && core_1.types.isTemplateLiteral(MODS)) {
            if (className) {
                if (core_1.types.isStringLiteral(className)) {
                    MODS.quasis[MODS.quasis.length - 1] = core_1.types.templateElement({ raw: `${exports.SPACE}${className.value}` }, true);
                }
                else {
                    MODS.expressions.push(className === null || className === void 0 ? void 0 : className.expression);
                    MODS.quasis.push(core_1.types.templateElement({ raw: exports.EMPTY_STRING }, true));
                }
            }
            return core_1.types.jsxExpressionContainer(MODS);
        }
        if (typeof final === 'string') {
            if (className) {
                if (core_1.types.isStringLiteral(className)) {
                    final += `${exports.SPACE}${className.value}`;
                }
                else {
                    return core_1.types.jsxExpressionContainer(core_1.types.templateLiteral([
                        core_1.types.templateElement({ raw: exports.EMPTY_STRING }, false),
                        core_1.types.templateElement({ raw: exports.EMPTY_STRING }, true),
                    ], [
                        // when we added className, we made sure it's not an empty expression
                        className.expression
                    ]));
                }
            }
            return core_1.types.stringLiteral(final);
        }
    })();
    if (!attributeValue)
        return null;
    return core_1.types.jsxAttribute(core_1.types.jsxIdentifier('className'), attributeValue);
};
exports.default = constructClassNameAttribute;
