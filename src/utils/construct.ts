import { types } from '@babel/core';
import { Identifier } from '@babel/types';
import { BEMProps, BEMPropTypes, ELEM_CONNECTOR, MODS_CONNECTOR, PASSIVE } from '..';

// TODO: if block is inherited but there is no elem, omit block
// TODO convert from StringLiteral to string before adding to bemprops

const WHITESPACE = ' ';
const EMPTY = '';

const isValidBlock = () => {

}

export function* constructBlock({ block, blockIsTopLevel }: BEMProps) {
    if (!block || !blockIsTopLevel) { // Don't need block if it's inherited
        yield EMPTY;
    }

    if (Array.isArray(block)) {
        for (const { value } of block) {
            yield value;
        }
    }

    if (typeof block === 'string') {
        yield block;
    }
};

export function* constructElem({ block, elem }: BEMProps) {
    if (!block?.length || !elem?.length) { // Abort if we have an empty array
        return EMPTY;
    }

    if (Array.isArray(block)) {
        for (const { value: blockValue } of block) {
            if (Array.isArray(elem)) {
                for (const { value: elemValue } of elem) {
                    yield `${blockValue}${ELEM_CONNECTOR}${elemValue}`;
                }
            }

            if (typeof elem === 'string') {
                yield `${blockValue}${ELEM_CONNECTOR}${elem}`;
            }
        }
    }

    if (typeof block === 'string' && Array.isArray(elem)) {
        for (const { value: elemValue } of elem) {

            yield `${block}${ELEM_CONNECTOR}${elemValue}`;
        }
    }

    if (typeof block === 'string' && typeof elem === 'string') {
        yield `${block}${ELEM_CONNECTOR}${elem}`;
    }
};

export function* constructMods(bemProps: BEMProps) {
    const { elem, mods } = bemProps;

    if (!mods) {
        return EMPTY;
    }

    // If 'block' is top level and we don't have 'elem', apply 'mods' to 'block'
    if (!elem && !elem?.length) {
        for (const block of constructBlock(bemProps)) {
            if (Array.isArray(mods)) {
                for (const mod of mods) {
                    console.log(mod)
                    // if (typeof mod === 'string') {
                    //     yield `${block}${MODS_CONNECTOR}${mod}`;
                    // }

                    if (types.isStringLiteral(mod)) {
                        yield `${block}${MODS_CONNECTOR}${mod.value}`;
                    }

                    if (types.isObjectProperty(mod)) {
                        mod.key = mod.key as Identifier;

                        if (PASSIVE) {
                            console.warn(`${mod.key.name} is an object property, but passive mode is enabled. Please use a string literal instead.`);
                        }
                        else {
                            yield `${block}${MODS_CONNECTOR}${mod.key.name}`;
                        }
                    }
                }
            }

            if (typeof mods === 'string') {
                yield `${block}${MODS_CONNECTOR}${mods}`;
            }
        }

        return;
    }

    for (const elem of constructElem(bemProps)) {
        if (Array.isArray(mods)) {
            for (const mod of mods) {
                if (typeof mod === 'string') {
                    yield `${elem}${MODS_CONNECTOR}${mod}`;
                }

                if (types.isObjectProperty(mod)) {
                    mod.key = mod.key as Identifier;

                    if (PASSIVE) {
                        console.warn(`${mod.key.name} is an object property, but passive mode is enabled. Please use a string literal instead.`);
                    }
                    else {
                        yield `${elem}${MODS_CONNECTOR}${mod.key.name}`;
                    }
                }
            }
        }

        if (typeof mods === 'string') {
            yield `${elem}${MODS_CONNECTOR}${mods}`;
        }
    }
}

export const construct = (bemProps: BEMProps) => {
    let _block = EMPTY;
    let _elem = EMPTY;
    let _mods = EMPTY;

    for (const blockItem of constructBlock(bemProps)) {
        const SPACE = _block ? WHITESPACE : EMPTY;
        _block = `${_block}${SPACE}${blockItem}`;
    }

    for (const elemItem of constructElem(bemProps)) {
        const SPACE = _elem ? WHITESPACE : EMPTY;
        _elem = `${_elem}${SPACE}${elemItem}`;
    }

    // TODO: during construction of mods decide if string or jsxexpression

    for (const modsItem of constructMods(bemProps)) {
        const SPACE = _mods ? WHITESPACE : EMPTY;
        _mods = `${_mods}${SPACE}${modsItem}`;
    }

    // if (!PASSIVE) {
    //     return;
    // }

    const SPACE_AFTER_BLOCK = _block && (_elem || _mods)
        ? WHITESPACE
        : EMPTY;
    const SPACE_AFTER_ELEM = _elem && _mods
        ? WHITESPACE
        : EMPTY;

    return (
        types.jsxAttribute(
            types.jsxIdentifier(BEMPropTypes.CLASSNAME),
            types.stringLiteral(`${_block}${SPACE_AFTER_BLOCK}${_elem}${SPACE_AFTER_ELEM}${_mods}`)
        )
    );

    // if (isActive) {
    //     const conditionalExpressions = convertObjectPropertiesToConditionalExpressions(bemProps);

    //     // Construct a template literal with conditional expressions
    //     classNameProp = types.jsxAttribute(
    //         types.jsxIdentifier(BEMPropTypes.CLASSNAME),
    //         types.jsxExpressionContainer(
    //             types.templateLiteral(
    //                 [
    //                     types.templateElement({ raw: `${className} ` }, false),
    //                     ...conditionalExpressions.map(() => types.templateElement({ raw: '' }, false))
    //                 ],
    //                 conditionalExpressions
    //             )
    //         )
    //     );
    // }
    // else {
    //     classNameProp = types.jsxAttribute(
    //         types.jsxIdentifier(BEMPropTypes.CLASSNAME),
    //         types.stringLiteral(className)
    //     );
    // }

    // console.log('block:', _block)
    // console.log('elem:', _elem)
    // console.log('mods:', _mods)

    // return `${_block}\n${_elem}\n${_mods}`;
}

export default construct;

// return `${ constructedElem }${ SPACE }${ constructedBlockElem } `;

// export const constructBlock = ({ block, blockIsTopLevel }: BEMProps) => {
//     if (Array.isArray(block)) {
//         return (
//             block.reduce((constructedBlock, currentBlock, index) => {
//                 const SPACE = (index > 0) && currentBlock.value
//                     ? WHITESPACE
//                     : EMPTY;

//                 return `${constructedBlock}${SPACE}${currentBlock.value}`;
//             }, EMPTY)
//         );
//     }

//     return blockIsTopLevel ? block : EMPTY;
// };


// export const constructElem = ({ block, elem }: BEMProps) => {
//     if (!block?.length || !elem?.length) { // Abort if we have an empty array
//         return EMPTY;
//     }

//     if (Array.isArray(block)) {
//         return (
//             block.reduce((constructedBlock, currentBlock, blockIndex) => {
//                 // Whitespace between block iterations (Block0-Elem0 Block0-Elem1 { BLOCK_SPACE } Block1-Elem0 Block1-Elem1)
//                 const BLOCK_SPACE = (blockIndex > 0) && currentBlock.value
//                     ? WHITESPACE
//                     : EMPTY;

//                 if (Array.isArray(elem)) {
//                     return (
//                         `${constructedBlock}${BLOCK_SPACE}${elem.reduce((constructedElem, currentElem, elemIndex) => {
//                             // Whitespace between elem iterations (Block0-Elem0 { ELEM_SPACE } Block0-Elem1 Block1-Elem0 { ELEM_SPACE } Block1-Elem1)
//                             const ELEM_SPACE = (elemIndex > 0) && currentElem.value
//                                 ? WHITESPACE
//                                 : EMPTY;

//                             return `${constructedElem}${ELEM_SPACE}${currentBlock.value}${ELEM_CONNECTOR}${currentElem.value}`;
//                         }, EMPTY)}`
//                     );
//                 }

//                 // If 'block' is an array, but 'elem' is not, we need to add 'elem' to each 'block'
//                 return `${constructedBlock}${BLOCK_SPACE}${currentBlock.value}${ELEM_CONNECTOR}${elem}`;
//             }, EMPTY)
//         );
//     }