import { transformSync } from '@babel/core';
import { readFileSync, readdirSync } from 'fs';
import path, {
    parse as parsePath,
    resolve
} from 'path';
import {
    generateFile,
    CONFIG,
} from './utils.js';

// const TEST_MAP = {
//     blockinheritance: testBlockInheritance,
//     customconnectors: testCustomConnectors
// };

const THROW = [
    'elem',
    'elem-mods',
    'mods'
];

describe('Transpilation process happens as expected', () => {
    const testsDirectory = path.resolve(__dirname, 'tests');
    const attributesDirectory = path.resolve(testsDirectory, 'attributes');
    const featuresDirectory = path.resolve(testsDirectory, 'features');

    const attributeTests = readdirSync(attributesDirectory);
    // const featureTests = readdirSync(featuresDirectory);

    attributeTests.forEach((attributePath) => {
        testAttribute(attributesDirectory, attributePath);
    });

    // featureTests.forEach((featurePath) => {
    //     testFeature(featuresDirectory, featurePath);
    // });
});

function testAttribute(attributesDirectory: string, attributePath: string) {
    const attributeDirectory = resolve(attributesDirectory, attributePath);
    const { name: nameOfTest } = parsePath(attributePath);

    const input = readFileSync(
        resolve(attributeDirectory, 'in.jsx'),
        'utf-8'
    );

    if (THROW.includes(nameOfTest)) {
        it(`Throws error: ${nameOfTest}`, () => {
            expect(() => transformSync(input, CONFIG)).toThrowError();
        });

        return;
    }

    const expected = readFileSync(
        resolve(attributeDirectory, 'expected.jsx'),
        'utf-8'
    );
    const { code: output } = transformSync(input, CONFIG)!;
    output && generateFile(attributeDirectory, 'out.jsx', output);

    it(`Output matches expected: ${nameOfTest}`, () => {
        expect(output).not.toBe(null);
        expect(output?.trim()).toEqual(expected.trim());
    });
}

// function testFeature(featuresDirectory, featurePath) {
//     const dirName = parsePath(featurePath).name;
//     const key = dirName.replace('-', '');

//     TEST_MAP[key](featuresDirectory, featurePath);
// }

// function testBlockInheritance(featuresDirectory, featurePath) {
//     it('Throws error upon attempt to rely on block inheritance while it is disabled', () => {
//         process.env.BEM_JSX_DISABLE_BLOCK_INHERITANCE = 'true';

//         const input = readFileSync(
//             resolve(featuresDirectory, featurePath, 'in-no-inheritance-should-throw.jsx'),
//             'utf-8'
//         );

//         expect(() => { transformSync(input, CONFIG); }).toThrow();
//     });

//     it('Does not throw and transpiles correctly when block inheritance is disabled and is used properly', () => {
//         process.env.BEM_JSX_DISABLE_BLOCK_INHERITANCE = 'true';

//         const {
//             actualClassName,
//             expectedClassName,
//             output
//         } = getClassNames(
//             resolve(featuresDirectory, featurePath),
//             'in-no-inheritance.jsx',
//             'expected-no-inheritance.jsx'
//         );

//         generateFile(resolve(featuresDirectory, featurePath), 'out-no-inheritance.jsx', output);
//         expect(actualClassName).toEqual(expectedClassName);
//     });


//     it('Does not throw and transpiles correctly when block inheritance is enabled', () => {
//         process.env.BEM_JSX_DISABLE_BLOCK_INHERITANCE = '';

//         const {
//             actualClassName,
//             expectedClassName,
//             output
//         } = getClassNames(
//             resolve(featuresDirectory, featurePath),
//             'in-no-inheritance-should-throw.jsx',
//             'expected-inheritance.jsx'
//         );

//         generateFile(resolve(featuresDirectory, featurePath), 'out-inheritance.jsx', output);
//         expect(actualClassName).toEqual(expectedClassName);
//     });
// }

// function testCustomConnectors(featuresDirectory, featurePath) {
//     const connectors = [
//         { elem: '___', mods: '|/=' },
//         { elem: '999', mods: '678' },
//         { elem: '', mods: '' },
//         {
//             elem: 'LONGSTRINGOFJIBBERISH, ABSOLUTE TOTAL JIBBERISH',
//             mods: 'LONGSTRINGOFJUBBERFISH, ABSOLUTE TOTAL JUBBERFISH'
//         }
//     ];

//     connectors.forEach((c) => {
//         it(`Correctly uses \'connectors\' when they are specified: ${JSON.stringify(c)}`, () => {
//             process.env.BEM_JSX_ELEM_CONNECTOR = c.elem;
//             process.env.BEM_JSX_MODS_CONNECTOR = c.mods;

//             const input = readFileSync(
//                 resolve(featuresDirectory, featurePath, 'in.jsx'),
//                 'utf-8'
//             );
//             const expected = readFileSync(
//                 resolve(featuresDirectory, featurePath, 'expected.jsx'),
//                 'utf-8'
//             );

//             const { code: outputCode } = transformSync(input, CONFIG);
//             const expectedCode = expected.replace(/\[ELEM\]/g, c.elem).replace(/\[MODS\]/g, c.mods);

//             const outputAst = parseSync(outputCode, CONFIG);
//             const expectedAst = parseSync(expectedCode, CONFIG);

//             const actualClassName = getClassName(outputAst);
//             const expectedClassName = getClassName(expectedAst);

//             expect(actualClassName).toEqual(expectedClassName);
//         });
//     });
// }
