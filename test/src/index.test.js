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
        const expected = fs.readFileSync(
            path.resolve(fixtureDirectory, 'expected.jsx'),
            'utf-8'
        );
        const output = babel.transformSync(input, CONFIG).code;

        const outputAst = babel.parseSync(output, CONFIG);
        const expectedAst = babel.parseSync(expected, CONFIG);

        const actualClassName = getClassNames(outputAst);
        const expectedClassName = getClassNames(expectedAst);

        fs.writeFile( // Generate expected output file
            path.resolve(fixtureDirectory, 'out.jsx'),
            `${THIS_FILE_IS_GENERATED_AUTOMATICALLY}${output}`,
            'utf-8',
            () => { }
        );

        if (dirName.includes('inheritance')) {
            // set process.env...?
            process.env.REACT_BEM_DISABLE_BLOCK_INHERITANCE = "true";
            const outputWithoutInheritance = babel.transformSync(input, CONFIG).code;

            fs.writeFile( // Generate expected output file
                path.resolve(fixtureDirectory, 'out-no-inheritance.jsx'),
                `${THIS_FILE_IS_GENERATED_AUTOMATICALLY}${outputWithoutInheritance}`,
                'utf-8',
                () => { }
            );

            process.env.REACT_BEM_DISABLE_BLOCK_INHERITANCE = "";
            const outputWithInheritance = babel.transformSync(input, CONFIG).code;

            fs.writeFile( // Generate expected output file
                path.resolve(fixtureDirectory, 'out-inheritance.jsx'),
                `${THIS_FILE_IS_GENERATED_AUTOMATICALLY}${outputWithInheritance}`,
                'utf-8',
                () => { }
            );
        }

        it(dirName, () => {
            expect(actualClassName).toEqual(expectedClassName);
        });
    })
});


