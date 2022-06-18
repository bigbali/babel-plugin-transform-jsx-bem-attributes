import { transformSync, parseSync } from '@babel/core';
import { readFileSync } from 'fs';
import { parse, resolve } from 'path';
import { getClassNames, generateFile, getInAndExpected, CONFIG } from './utils';

const TEST_MAP = {
    blockinheritance: testBlockInheritance,
    customconnectors: testCustomConnectors
};

export const testAttribute = (attributesDirectory, attributePath) => {
    const attributeDirectory = resolve(attributesDirectory, attributePath);
    const { name: dirName } = parse(attributePath);

    const { actualClassName, expectedClassName, output } = getClassNames(attributeDirectory, 'in.jsx', 'expected.jsx');

    generateFile(attributeDirectory, 'out.jsx', output);

    it(`Output matches expected: ${dirName}`, () => {
        expect(actualClassName).toEqual(expectedClassName);
    });
}

export const testFeature = (featuresDirectory, featurePath) => {
    const dirName = parse(featurePath).name;
    const key = dirName.replace('-', '');

    TEST_MAP[key](featuresDirectory, featurePath);
}

function testBlockInheritance(featuresDirectory, featurePath) {
    process.env.BEM_JSX_DISABLE_BLOCK_INHERITANCE = 'true';

    it('Throws error upon attempt to rely on block inheritance while it is disabled', () => {
        const input = readFileSync(
            resolve(featuresDirectory, featurePath, 'in-no-inheritance-should-throw.jsx'),
            'utf-8'
        );

        expect(() => { transformSync(input, CONFIG) }).toThrow();
    });

    it('Does not throw and transpiles correctly when block inheritance is disabled and is used properly', () => {
        const { actualClassName, expectedClassName } = getClassNames(resolve(featuresDirectory, featurePath), 'in-no-inheritance.jsx', 'expected-no-inheritance.jsx');

        expect(actualClassName).toEqual(expectedClassName);
    });

    // const featureDirectory = resolve(featuresDirectory, featurePath);
    // const { name: dirName } = parse(featurePath);


}

function testCustomConnectors() {
}
