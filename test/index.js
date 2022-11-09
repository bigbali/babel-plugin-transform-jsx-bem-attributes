"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@babel/core");
const fs_1 = require("fs");
const path_1 = __importStar(require("path"));
const utils_js_1 = require("./utils.js");
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
    const testsDirectory = path_1.default.resolve(__dirname, 'tests');
    const attributesDirectory = path_1.default.resolve(testsDirectory, 'attributes');
    const featuresDirectory = path_1.default.resolve(testsDirectory, 'features');
    const attributeTests = (0, fs_1.readdirSync)(attributesDirectory);
    // const featureTests = readdirSync(featuresDirectory);
    attributeTests.forEach((attributePath) => {
        testAttribute(attributesDirectory, attributePath);
    });
    // featureTests.forEach((featurePath) => {
    //     testFeature(featuresDirectory, featurePath);
    // });
});
function testAttribute(attributesDirectory, attributePath) {
    const attributeDirectory = (0, path_1.resolve)(attributesDirectory, attributePath);
    const { name: nameOfTest } = (0, path_1.parse)(attributePath);
    const input = (0, fs_1.readFileSync)((0, path_1.resolve)(attributeDirectory, 'in.jsx'), 'utf-8');
    if (THROW.includes(nameOfTest)) {
        it(`Throws error: ${nameOfTest}`, () => {
            expect(() => (0, core_1.transformSync)(input, utils_js_1.CONFIG)).toThrowError();
        });
        return;
    }
    const expected = (0, fs_1.readFileSync)((0, path_1.resolve)(attributeDirectory, 'expected.jsx'), 'utf-8');
    const { code: output } = (0, core_1.transformSync)(input, utils_js_1.CONFIG);
    output && (0, utils_js_1.generateFile)(attributeDirectory, 'out.jsx', output);
    it(`Output matches expected: ${nameOfTest}`, () => {
        expect(output).not.toBe(null);
        expect(output === null || output === void 0 ? void 0 : output.trim()).toEqual(expected.trim());
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
