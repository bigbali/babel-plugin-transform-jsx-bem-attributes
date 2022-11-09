import { types, transformSync, parseSync, parse, TransformOptions } from '@babel/core';
import { readFileSync, writeFile } from 'fs';
import { resolve } from 'path';

export const CONFIG: TransformOptions = {
    plugins: [
        '@babel/plugin-syntax-jsx',
        require.resolve('../lib/index.js')
    ],
    code: true,
    ast: true,
    generatorOpts: {
        retainFunctionParens: true,
        retainLines: true,
        compact: false,
    }
};

const THIS_FILE_IS_GENERATED_AUTOMATICALLY = `\
/*
    This file is generated automatically.
*/\n\n`;

export const parseClassNames = (attributeDirectory: string): string[][] => {

    const actualClassNames: string[] = [];
    const expectedClassNames: string[] = [];
    return [actualClassNames, expectedClassNames];
}

export const getDetails = (node: any) => {
    if (!node || !types.isVariableDeclarator(node)) {
        return;
    }

    const init = node.init;
    if (!types.isArrowFunctionExpression(init) && !types.isFunctionExpression(init)) {
        return;
    }

    // @ts-ignore
    const statements = init.body.body;
    for (const statement of statements) {
        if (types.isReturnStatement(statement)) {
            return (
                // @ts-ignore
                statement.argument.children.reduce((array, child) => {
                    if (types.isJSXElement(child)) {
                        for (const attribute of child.openingElement.attributes) {
                            // @ts-ignore
                            if (attribute.name.name === 'className') {
                                // @ts-ignore
                                if (types.isStringLiteral(attribute.value)) {
                                    // @ts-ignore
                                    array.push(attribute.value.value);
                                }
                                // @ts-ignore
                                else if (types.isJSXExpressionContainer(attribute.value)) {
                                    // TODO: find best way to compare objects :)
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

export const getClassName = (ast: { program: { body: [({ declarations: any; } | undefined)?]; }; }) => {
    // Get first element of the array, which is an object, then get its 'declarations' property. No, it's not magic. Okay, maybe a little :)
    // @ts-ignore
    const [{ declarations } = {}] = ast.program.body;

    if (!declarations) {
        console.error('No declarations found in at least one fixture. Please check your \'in.jsx\' and \'expected.jsx\' files.');
        return;
    }

    return declarations.map(getDetails);
}

// export const getClassNames = (directory, inputArg, expectedArg) => {
//     const { input, expected } = getInputAndExpected(directory, inputArg, expectedArg);

//     const { code: output } = transformSync(input, CONFIG);

//     const outputAst = parse(output, CONFIG);
//     const expectedAst = parse(expected, CONFIG);

//     const actualClassName = getClassName(outputAst);
//     const expectedClassName = getClassName(expectedAst);

//     return { actualClassName, expectedClassName, input, output };
// }

export const generateFile = (directory: string, fileName: string, content: string) => {
    writeFile(
        resolve(directory, fileName),
        `${THIS_FILE_IS_GENERATED_AUTOMATICALLY}${content}`,
        'utf-8',
        () => { } // no-op
    );
}

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
