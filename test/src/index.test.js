const babel = require('@babel/core');
const fs = require('fs');
const path = require('path');

const CONFIG = {
    plugins: [
        '@babel/plugin-syntax-jsx',
        require.resolve('../../dist/index.js')
    ]
};

// const getDetails = (node,) => {
//     if (!node || !node.type === 'VariableDeclarator') {
//         return;
//     }

//     const init = node.init;

//     if (!init.type === 'ArrowFunctionExpression' && !init.type === 'FunctionExpression') {
//         return;
//     }

//     for (const statement of init.body.body) {
//         if (!statement.type === 'ReturnStatement') {
//             continue;
//         }

//         let classNames = []

//         statement.argument.children.forEach((child) => {
//             if (child.type === 'JSXElement') {
//                 for (const attribute of child.openingElement.attributes) {
//                     if (attribute.name.name === 'className') {
//                         classNames.push({
//                             element: child.openingElement.name.name,
//                             // line: attribute.loc.start.line,
//                             name: attribute.name.name,
//                             value: attribute.value.value
//                         });
//                     }
//                 }
//             }
//         });

//         return classNames;
//     }
// }

const getDetails = (node) => {
    if (!node) {
        return;
    }

    if (node.type === 'VariableDeclarator') {
        const init = node.init;

        if (init.type === 'ArrowFunctionExpression' || init.type === 'FunctionExpression') {
            for (const statement of init.body.body) {
                if (statement.type === 'ReturnStatement') {
                    let classNames = []

                    statement.argument.children.forEach((child) => {
                        if (child.type === 'JSXElement') {
                            for (const attribute of child.openingElement.attributes) {
                                if (attribute.name.name === 'className') {
                                    classNames.push(attribute.value.value)
                                }
                            }
                        }
                    });

                    return classNames;
                }
            }
        }
    }

}


describe('Transpilation process happens as expected', () => {
    const fixturesDirectory = path.resolve(__dirname, 'fixtures');
    const fixtures = fs.readdirSync(fixturesDirectory);

    fixtures.forEach((_fixturePath) => {
        const fixturePath = path.resolve(fixturesDirectory, _fixturePath);

        const input = fs.readFileSync(path.resolve(fixturePath, 'in.jsx'), 'utf-8');
        const expected = fs.readFileSync(path.resolve(fixturePath, 'expected.jsx'), 'utf-8');
        const output = babel.transformSync(input, CONFIG).code;

        const fileName = path.parse(_fixturePath).name;

        const outputAst = babel.parseSync(output, CONFIG);
        const expectedAst = babel.parseSync(expected, CONFIG);

        fs.writeFile(path.resolve(fixturePath, 'out.jsx'), output, 'utf-8', () => { });

        let actualClassName, expectedClassName;

        // Get 'className' attributes from input file and expected file
        for (const singleNode of outputAst.program.body) {
            actualClassName = singleNode.declarations.map(getDetails)
        }

        for (const singleNode of expectedAst.program.body) {
            expectedClassName = singleNode.declarations.map(getDetails)
        }

        it(fileName, () => {
            expect(actualClassName).toEqual(expectedClassName);
        })
    })
});

