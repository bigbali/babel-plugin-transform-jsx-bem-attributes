const babel = require('@babel/core');
const types = require('@babel/types');
const path = require('path');
const fs = require('fs');

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

const getClassNames = (ast) => {
    // Get first element of the array, which is an object, then get its 'declarations' property. No, it's not magic. Okay, maybe a little :)
    const [{ declarations } = {}] = ast.program.body;

    if (!declarations) {
        console.error('No declarations found in at least one fixture. Please check your \'in.jsx\' and \'expected.jsx\' files.');
        return;
    }

    return declarations.map(getDetails);
}

const generateFile = (directory, fileName, content) => {
    fs.writeFile(
        path.resolve(directory, fileName),
        `${THIS_FILE_IS_GENERATED_AUTOMATICALLY}${content}`,
        'utf-8',
        () => { } // no-op
    );
}

const testTransform = (output, expected, name) => {
    const outputAst = babel.parseSync(output, CONFIG);
    const expectedAst = babel.parseSync(expected, CONFIG);

    const actualClassName = getClassNames(outputAst);
    const expectedClassName = getClassNames(expectedAst);

    it(name, () => {
        expect(actualClassName).toEqual(expectedClassName);
    });
}

const testInheritance = (fixtureDirectory, input) => {
    process.env.BEM_JSX_FAIL_SILENTLY = "true";

    process.env.REACT_BEM_DISABLE_BLOCK_INHERITANCE = "true";
    const outputWithoutInheritance = babel.transformSync(input, CONFIG).code;
    const expectedWithoutInheritance = fs.readFileSync(
        path.resolve(fixtureDirectory, 'expected-no-inheritance.jsx'),
        'utf-8'
    );

    process.env.REACT_BEM_DISABLE_BLOCK_INHERITANCE = "";
    const outputWithInheritance = babel.transformSync(input, CONFIG).code;
    const expectedWithInheritance = fs.readFileSync(
        path.resolve(fixtureDirectory, 'expected-inheritance.jsx'),
        'utf-8'
    );

    testTransform(outputWithoutInheritance, expectedWithoutInheritance, 'Block inheritance disabled → fail silently');
    generateFile(fixtureDirectory, 'out-no-inheritance.jsx', outputWithoutInheritance);

    // process.env.BEM_JSX_FAIL_SILENTLY = "";

    testTransform(outputWithInheritance, expectedWithInheritance, 'Block inheritance enabled');
    generateFile(fixtureDirectory, 'out-inheritance.jsx', outputWithInheritance);
}

describe('Transpilation process happens as expected', () => {
    const fixturesDirectory = path.resolve(__dirname, 'fixtures');
    const fixtures = fs.readdirSync(fixturesDirectory);

    fixtures.forEach((fixturePath) => {
        const fixtureDirectory = path.resolve(fixturesDirectory, fixturePath);
        const dirName = path.parse(fixturePath).name;

        const input = fs.readFileSync(
            path.resolve(fixtureDirectory, 'in.jsx'),
            'utf-8'
        );

        if (dirName.includes('inheritance')) {
            testInheritance(fixtureDirectory, input);
            return;
        }

        const expected = fs.readFileSync(
            path.resolve(fixtureDirectory, 'expected.jsx'),
            'utf-8'
        );
        const output = babel.transformSync(input, CONFIG).code;

        const outputAst = babel.parseSync(output, CONFIG);
        const expectedAst = babel.parseSync(expected, CONFIG);

        const actualClassName = getClassNames(outputAst);
        const expectedClassName = getClassNames(expectedAst);

        generateFile(fixtureDirectory, 'out.jsx', output);

        it(dirName, () => {
            expect(actualClassName).toEqual(expectedClassName);
        });
    })
});


