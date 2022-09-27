import { NodePath, types } from '@babel/core';
import { SupportedTypes } from 'src';
import {
    BEMProps,
    Block,
    Elem
} from './types';
import { filter, purifyTemplate } from './util';

export const EMPTY_STRING = '';
export const SPACE = ' ';



const evalString = (expression: types.Expression) => types.logicalExpression(
    '&&',
    types.binaryExpression(
        '===',
        types.unaryExpression(
            'typeof',
            expression
        ),
        types.stringLiteral('string')
    ),
    expression
);

const evalObject = (expression: types.Expression) => types.logicalExpression(
    '&&',
    types.binaryExpression(
        '===',
        types.unaryExpression(
            'typeof',
            expression
        ),
        types.stringLiteral('string')
    ),
    expression
);

const buildTemplate = ( // build a template literal
    expression: types.Expression,
    elements: types.Expression[],
    index: number,
) => {
    if (types.isTemplateLiteral(expression)) {
        return expression;
    }

    // // TODO ONLY SUPPORT STR AND OBJ!
    // if (types.isIdentifier(expression)) {
    //     const predicates = elements.reduce((previous: types.LogicalExpression[], current: types.Expression, sindex) => {
    //         if (index <= sindex) {
    //             return previous;
    //         }

    //         if (types.isIdentifier(current)) {
    //             if (index !== sindex) {
    //                 previous.push(
    //                     types.logicalExpression(
    //                         '||',
    //                         evalString(expression),
    //                         evalObject(expression)
    //                     )
    //                 );
    //             }
    //         }

    //         return previous;
    //     }, [] as types.LogicalExpression[]);

    //     const predicate = predicates.reduce((previous: types.LogicalExpression | null, current) => {
    //         if (!previous) {
    //             return current;
    //         }

    //         return types.logicalExpression(
    //             '||',
    //             previous,
    //             current
    //         );
    //     }, null);

    //     // console.log(predicates);


    //     // const predicate = types.logicalExpression(
    //     //     '||',
    //     //     evalString(expression),
    //     //     evalObject(expression)
    //     // );

    //     // const isOneOfConsequentTruthy = predicate
    //     //     ? types.conditionalExpression(
    //     //         predicate,
    //     //         types.stringLiteral(SPACE),
    //     //         types.stringLiteral(EMPTY_STRING)
    //     //     ) : null;

    //     const expressions: types.Expression[] = [
    //         expression
    //     ];
    //     // const quasis: types.TemplateElement[] = [
    //     //     types.templateElement({ raw: prefix ? prefix.value : EMPTY_STRING }),
    //     //     types.templateElement({ raw: EMPTY_STRING })
    //     // ];

    //     const quasis = [
    //         types.templateElement({ raw: EMPTY_STRING }),
    //         ...expressions.map(() => types.templateElement({ raw: EMPTY_STRING }))
    //     ];

    //     // isOneOfConsequentTruthy && expressions.push(isOneOfConsequentTruthy);
    //     // isOneOfConsequentTruthy && quasis.push(types.templateElement({ raw: EMPTY_STRING }));


    //     return types.templateLiteral(
    //         quasis,
    //         expressions
    //         // predicates
    //     );
    // }

    return null;
};

// type x = types.StringLiteral | types.TemplateLiteral;
export const reduceBlock = (blocks: SupportedTypes[]): types.StringLiteral | types.TemplateLiteral | null => {
    const block = blocks.reduce((previous: SupportedTypes | null, current, index) => {
        if (!previous) { // If first element is string, return it, otherwise build a template
            if (types.isStringLiteral(current)) {
                return current;
            }

            return buildTemplate(current, blocks, index);
        }

        if (types.isStringLiteral(previous)) {
            if (types.isStringLiteral(current)) { // If previous was string and current is also, combine them
                const SPACE_BETWEEN_STRINGS = previous.value && current.value
                    ? SPACE
                    : EMPTY_STRING;

                return types.stringLiteral(`${previous.value}${SPACE_BETWEEN_STRINGS}${current.value}`);
            }

            return buildTemplate(current, blocks, index);
        }

        return previous;
    }, null);

    // @ts-ignore
    return block;
};

const reduceElem = (blocks: Block[], elems: Elem[]) => {
    // if (types.isStringLiteral(current)) {
    //     const SPACE_AFTER_BLOCK = previous && current
    //         ? SPACE
    //         : EMPTY_STRING;

    //     return `${previous}${SPACE_AFTER_BLOCK}${current.value}`;
    // }
    // return elems.reduce((array, elem) => {
    //     const value
    //     blocks.forEach((block) => {
    //         array.push(`${}`)
    //     })
    // }, []);

    // if (blocks)
};


export default function constructClassNameAttribute(
    BEM_PROPS: BEMProps,
    isBlockInherited: boolean,
    element: NodePath<types.JSXElement>
) {

    const { block } = BEM_PROPS;
    const _BLOCK_ARRAY = filter(block, element);
    const _BLOCK = isBlockInherited || !_BLOCK_ARRAY ? null : reduceBlock(_BLOCK_ARRAY);


    // IMPLEMENTATION IDEA
    /*
        str __BLOCK__
        str __ELEM__
        str __MOD__
        str __CLASS__

        for block of blocks
            if block is not valid
                pass

            if block is valid
                __BLOCK__ += `${block}${?SPACE}`

                for elem of elems
                    if elem is not valid
                        pass

                    if elem is valid
                        __elem__ `${block}-${elem}`
                        __ELEM__ += `${__elem__}${?SPACE}`

                        for mod of mods
                            if mod is not valid
                                pass
                            if mod is valid
                                __mod__ = `${__elem__}_${mod}`
                                __MOD__ += `${__mod__}${?SPACE}`

            if __ELEM__ is empty
                for mod of mods
                    if mod is not valid
                        pass
                    if mod is valid
                        __mod__ = `${__elem__}_${mod}`
                        __MOD__ += `${__mod__}${?SPACE}`

    */

    return _BLOCK;
};

// const block = blocks.reduce((previous: types, current: x, index): x => {
//     if (types.isTemplateLiteral(previous)) {
//         if (types.isStringLiteral(current)) {
//             const SPACE_AFTER_PREVIOUS = previous.expressions.length > 0 && index > 0
//                 ? SPACE
//                 : EMPTY_STRING;

//             const secondQuasi = previous.quasis[1].value;
//             secondQuasi.raw = `${secondQuasi.raw}${SPACE_AFTER_PREVIOUS}${current.value}`;
//         }

//         if (types.isTemplateLiteral(current)) {
//             previous.quasis.push(types.templateElement({ raw: EMPTY_STRING }));
//             previous.expressions.push(current);

//             const functionCalls = blocks.reduce((prev, cur, i) => {
//                 if (i > index) {
//                     if (types.isTemplateLiteral(cur)) { // recursion?
//                         cur.expressions.forEach((expr) => {
//                             if (types.isCallExpression(expr)) {
//                                 prev.push(expr);
//                             }
//                             if (types.isTemplateLiteral(expr)) {
//                                 expr.expressions.forEach((sexpr) => {
//                                     if (types.isCallExpression(sexpr)) {
//                                         prev.push(sexpr);
//                                     }
//                                 });
//                             }
//                         });

//                     }
//                 }
//                 return prev;
//             }, [] as types.CallExpression[]);

//             if (functionCalls.length > 0) {
//                 const xxx = types.callExpression(
//                     types.memberExpression(
//                         types.arrayExpression(functionCalls),
//                         types.identifier('some'),
//                         false,
//                         false
//                     ),
//                     [
//                         types.arrowFunctionExpression(
//                             [types.identifier('f')],
//                             types.unaryExpression(
//                                 '!',
//                                 types.unaryExpression(
//                                     '!',
//                                     types.callExpression(
//                                         types.identifier('f'),
//                                         []
//                                     )
//                                 )
//                             )
//                         )
//                     ]
//                 );

//                 current.expressions.push(
//                     types.templateLiteral(
//                         [
//                             types.templateElement({ raw: EMPTY_STRING }, false),
//                             types.templateElement({ raw: EMPTY_STRING }, true)
//                         ],
//                         [
//                             types.conditionalExpression(
//                                 types.callExpression(xxx, []),
//                                 types.stringLiteral(SPACE),
//                                 types.stringLiteral(EMPTY_STRING)

//                             )
//                         ]
//                     )
//                 );

//                 current.quasis.push(types.templateElement({ raw: EMPTY_STRING }));
//             }
//         }
//     }

//     if (types.isStringLiteral(previous)) {
//         const SPACE_AFTER_PREVIOUS = previous.value
//             ? SPACE
//             : EMPTY_STRING;

//         if (types.isStringLiteral(current) && current.value) {
//             previous.value = `${previous.value}${SPACE_AFTER_PREVIOUS}${current.value}`;
//         }

//         if (types.isTemplateLiteral(current)) {
//             if (previous.value.length > 0) { // If we already have something on the left hand side, put a space between
//                 current.quasis[0].value.raw = SPACE;
//             }

//             const functionCalls = blocks.reduce((prev, cur, i) => {
//                 if (i > index) {
//                     if (types.isTemplateLiteral(cur)) {
//                         cur.expressions.forEach((expr) => {
//                             if (types.isCallExpression(expr)) {
//                                 prev.push(expr);
//                             }
//                             if (types.isTemplateLiteral(expr)) {
//                                 expr.expressions.forEach((sexpr) => {
//                                     if (types.isCallExpression(sexpr)) {
//                                         prev.push(sexpr);
//                                     }
//                                 });
//                             }
//                         });
//                     }
//                 }
//                 return prev;
//             }, [] as types.CallExpression[]);

//             if (functionCalls.length > 0) {
//                 const xxx = types.callExpression(
//                     types.memberExpression(
//                         types.arrayExpression(functionCalls),
//                         types.identifier('some'),
//                         false,
//                         false
//                     ),
//                     [
//                         types.arrowFunctionExpression(
//                             [types.identifier('f')],
//                             types.unaryExpression(
//                                 '!',
//                                 types.unaryExpression(
//                                     '!',
//                                     types.callExpression(
//                                         types.identifier('f'),
//                                         []
//                                     )
//                                 )
//                             )
//                         )
//                     ]
//                 );

//                 current.expressions.push(
//                     types.templateLiteral(
//                         [
//                             types.templateElement({ raw: EMPTY_STRING }, false),
//                             types.templateElement({ raw: EMPTY_STRING }, true)
//                         ],
//                         [
//                             types.conditionalExpression(
//                                 types.callExpression(xxx, []),
//                                 types.stringLiteral(SPACE),
//                                 types.stringLiteral(EMPTY_STRING)

//                             )
//                         ]
//                     )
//                 );

//                 current.quasis.push(types.templateElement({ raw: EMPTY_STRING }));
//             }

//             return types.templateLiteral( // Convert to template literal
//                 blocks.length === 1 ? current.quasis : [
//                     types.templateElement({ raw: previous.value }, false),
//                     types.templateElement({ raw: EMPTY_STRING }, true)
//                 ],
//                 [
//                     ...blocks.length > 1 ? [current] : current.expressions
//                 ]
//             );
//         }
//     }

//     return previous;
// }, types.stringLiteral(EMPTY_STRING));

// if (
//     types.isStringLiteral(block) && !block.value
//     || (types.isTemplateLiteral(block) && block.expressions.length === 0
//         && block.quasis.every((quasi) => !quasi.value.raw))
// ) {
//     return null;
// }

// return block;
