const babel = require('@babel/core');
const fs = require('fs');
const path = require('path');

const CONFIG = {
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

const getDetails = (node) => {
    if (!node || !node.type === 'VariableDeclarator') {
        return;
    }

    const init = node.init;

    if (!init.type === 'ArrowFunctionExpression' && !init.type === 'FunctionExpression') {
        return;
    }

    for (const statement of init.body.body) {
        if (statement.type === 'ReturnStatement') {
            return (
                statement.argument.children.reduce((array, child) => {
                    if (child.type === 'JSXElement') {
                        for (const attribute of child.openingElement.attributes) {
                            if (attribute.name.name === 'className') {
                                array.push(attribute.value.value)
                            }
                        }
                    }

                    return array;
                }, [])
            );
        }
    }
}

const getClassName = (ast) => {
    const [{ declarations } = {}] = ast.program.body;

    if (!declarations) {
        console.error('No declarations found in one of the fixtures. Please check your \'in.jsx\' and \'expected.jsx\' files.');

        return;
    }

    return declarations.map(getDetails);
}

describe('Transpilation process happens as expected without static mode enabled', () => {
    const fixturesDirectory = path.resolve(__dirname, 'fixtures');
    const fixtures = fs.readdirSync(fixturesDirectory);

    fixtures.forEach((fixturePath) => {
        const fixtureDirectory = path.resolve(fixturesDirectory, fixturePath);

        const input = fs.readFileSync(
            path.resolve(fixtureDirectory, 'in.jsx'),
            'utf-8'
        );
        const expected = fs.readFileSync(
            path.resolve(fixtureDirectory, 'expected.jsx'),
            'utf-8'
        );
        const output = babel.transformSync(input, CONFIG).code;

        const outputAst = babel.parseSync(output, CONFIG);
        const expectedAst = babel.parseSync(expected, CONFIG);

        const actualClassName = getClassName(outputAst);
        const expectedClassName = getClassName(expectedAst);

        // Generate expected output file
        fs.writeFile(
            path.resolve(fixtureDirectory, 'out.jsx'),
            `${THIS_FILE_IS_GENERATED_AUTOMATICALLY}${output}`,
            'utf-8',
            () => { }
        );

        const fileName = path.parse(fixturePath).name;

        it(fileName, () => {
            expect(actualClassName).toEqual(expectedClassName);
        });
    })
});


