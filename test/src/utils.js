import { types, transformSync, transformFile, parseSync } from '@babel/core';
import { readFileSync, writeFile } from 'fs';
import { resolve } from 'path';

export const CONFIG = {
    plugins: [
        '@babel/plugin-syntax-jsx',
        require.resolve('../../dist/index.js')
    ]
};

const THIS_FILE_IS_GENERATED_AUTOMATICALLY = `\
/*
    This file is generated automatically.
    All your edits will be lost upon regeneration.
*/\n\n`;

export const getDetails = (node) => {
    if (!node || !types.isVariableDeclarator(node)) {
        return;
    }

    const init = node.init;
    if (!types.isArrowFunctionExpression(init) && !types.isFunctionExpression(init)) {
        return;
    }

    const statements = init.body.body;
    for (const statement of statements) {
        if (types.isReturnStatement(statement)) {
            return (
                statement.argument.children.reduce((array, child) => {
                    if (types.isJSXElement(child)) {
                        for (const attribute of child.openingElement.attributes) {
                            if (attribute.name.name === 'className') {
                                if (types.isStringLiteral(attribute.value)) {
                                    array.push(attribute.value.value);
                                }
                                else if (types.isJSXExpressionContainer(attribute.value)) {
                                    // normalizeTemplateLiteral(attribute.value.expression);
                                    // array.push(attribute.value.expression);
                                }
                            }
                        }
                    }

                    return array;
                }, [])
            );
        }
    }
}

export const getClassName = (ast) => {
    // Get first element of the array, which is an object, then get its 'declarations' property. No, it's not magic. Okay, maybe a little :)
    const [{ declarations } = {}] = ast.program.body;

    if (!declarations) {
        console.error('No declarations found in at least one fixture. Please check your \'in.jsx\' and \'expected.jsx\' files.');
        return;
    }

    return declarations.map(getDetails);
}

export const getClassNames = (directory, inputArg, expectedArg) => {
    const { input, expected } = getInputAndExpected(directory, inputArg, expectedArg);

    const { code: output } = transformSync(input, CONFIG);

    const outputAst = parseSync(output, CONFIG);
    const expectedAst = parseSync(expected, CONFIG);

    const actualClassName = getClassName(outputAst);
    const expectedClassName = getClassName(expectedAst);

    return { actualClassName, expectedClassName, input, output };
}

export const generateFile = (directory, fileName, content) => {
    writeFile(
        resolve(directory, fileName),
        `${THIS_FILE_IS_GENERATED_AUTOMATICALLY}${content}`,
        'utf-8',
        () => { } // no-op
    );
}

export const getInputAndExpected = (directory, inputArg, expectedArg) => {
    const input = readFileSync(
        resolve(directory, inputArg),
        'utf-8'
    );
    const expected = readFileSync(
        resolve(directory, expectedArg),
        'utf-8'
    );

    return { input, expected };
}
