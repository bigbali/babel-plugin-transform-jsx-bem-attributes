"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateFile = exports.getClassName = exports.getDetails = exports.parseClassNames = exports.CONFIG = void 0;
const core_1 = require("@babel/core");
const fs_1 = require("fs");
const path_1 = require("path");
exports.CONFIG = {
    plugins: [
        '@babel/plugin-syntax-jsx',
        require.resolve('../lib/index.js')
    ],
    code: true,
    ast: true,
    generatorOpts: {
        retainFunctionParens: true,
        retainLines: true,
        compact: false
    }
};
const THIS_FILE_IS_GENERATED_AUTOMATICALLY = `\
/*
    This file is generated automatically.
    All your edits will be lost upon regeneration.
*/\n\n`;
const parseClassNames = (attributeDirectory) => {
    const actualClassNames = [];
    const expectedClassNames = [];
    return [actualClassNames, expectedClassNames];
};
exports.parseClassNames = parseClassNames;
const getDetails = (node) => {
    if (!node || !core_1.types.isVariableDeclarator(node)) {
        return;
    }
    const init = node.init;
    if (!core_1.types.isArrowFunctionExpression(init) && !core_1.types.isFunctionExpression(init)) {
        return;
    }
    // @ts-ignore
    const statements = init.body.body;
    for (const statement of statements) {
        if (core_1.types.isReturnStatement(statement)) {
            return (
            // @ts-ignore
            statement.argument.children.reduce((array, child) => {
                if (core_1.types.isJSXElement(child)) {
                    for (const attribute of child.openingElement.attributes) {
                        // @ts-ignore
                        if (attribute.name.name === 'className') {
                            // @ts-ignore
                            if (core_1.types.isStringLiteral(attribute.value)) {
                                // @ts-ignore
                                array.push(attribute.value.value);
                            }
                            // @ts-ignore
                            else if (core_1.types.isJSXExpressionContainer(attribute.value)) {
                                // TODO: find best way to compare objects :)
                                // normalizeTemplateLiteral(attribute.value.expression);
                                // array.push(attribute.value.expression);
                            }
                        }
                    }
                }
                return array;
            }, []));
        }
    }
};
exports.getDetails = getDetails;
const getClassName = (ast) => {
    // Get first element of the array, which is an object, then get its 'declarations' property. No, it's not magic. Okay, maybe a little :)
    // @ts-ignore
    const [{ declarations } = {}] = ast.program.body;
    if (!declarations) {
        console.error('No declarations found in at least one fixture. Please check your \'in.jsx\' and \'expected.jsx\' files.');
        return;
    }
    return declarations.map(exports.getDetails);
};
exports.getClassName = getClassName;
// export const getClassNames = (directory, inputArg, expectedArg) => {
//     const { input, expected } = getInputAndExpected(directory, inputArg, expectedArg);
//     const { code: output } = transformSync(input, CONFIG);
//     const outputAst = parse(output, CONFIG);
//     const expectedAst = parse(expected, CONFIG);
//     const actualClassName = getClassName(outputAst);
//     const expectedClassName = getClassName(expectedAst);
//     return { actualClassName, expectedClassName, input, output };
// }
const generateFile = (directory, fileName, content) => {
    (0, fs_1.writeFile)((0, path_1.resolve)(directory, fileName), `${THIS_FILE_IS_GENERATED_AUTOMATICALLY}${content}`, 'utf-8', () => { } // no-op
    );
};
exports.generateFile = generateFile;
// export const getInputAndExpected = (directory, inputArg, expectedArg) => {
//     const input = readFileSync(
//         resolve(directory, inputArg),
//         'utf-8'
//     );
//     const expected = readFileSync(
//         resolve(directory, expectedArg),
//         'utf-8'
//     );
//     return { input, expected };
// }
