import path from 'path';
import { readdirSync } from 'fs';
import { testAttribute, testFeature } from '.';


describe('Transpilation process happens as expected', () => {
    const testsDirectory = path.resolve(__dirname, 'tests');
    const attributesDirectory = path.resolve(testsDirectory, 'attributes');
    const featuresDirectory = path.resolve(testsDirectory, 'features');

    const attributeTests = readdirSync(attributesDirectory);
    const featureTests = readdirSync(featuresDirectory);

    attributeTests.forEach((attributePath) => {
        testAttribute(attributesDirectory, attributePath);
    });

    featureTests.forEach((featurePath) => {
        testFeature(featuresDirectory, featurePath);
    });
});


