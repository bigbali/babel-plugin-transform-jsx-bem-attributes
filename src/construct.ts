import { NodePath, types } from '@babel/core';
import { getHeapSpaceStatistics } from 'v8';
import { EMPTY } from './constants';
import {
    BEMProps,
    BEMPropTypes,
    Block,
    Elem,
    isArray
} from './types';

const EMPTY_STRING = '';
const SPACE = ' ';

// attr out => str lit | template lit
// attr in => str, expression, (str | expression)[]

const getTemplateLiteral = (value: types.Expression) => types.templateLiteral(
    [
        types.templateElement({ raw: '' }, false),
        types.templateElement({ raw: '' }, true)
    ],
    [
        value
    ]
);

const getArray = (value: types.Expression | null) => {
    if (value === null) {
        return null;
    }

    const array: (types.StringLiteral | types.TemplateLiteral)[] = [];

    if (types.isStringLiteral(value) || types.isTemplateLiteral(value)) {
        array.push(value);
    } else if (types.isArrayExpression(value)) {
        value.elements.forEach(element => {
            if (types.isExpression(value)) {
                if (element === null || types.isSpreadElement(element)) return;

                if (types.isStringLiteral(element)) {
                    if (element.value) {
                        array.push(element);
                    }

                    return;
                }

                array.push(getTemplateLiteral(element));
            }
        });
    } else if (types.isExpression(value)) {
        array.push(getTemplateLiteral(value));
    }

    return array.length > 0 ? array : null;
};

// export function* getBlockArray({ block }: BEMProps) {
//     yield* getArray(block);
// };

// export function* getElemArray({ elem }: BEMProps) {
//     yield* getArray(elem);
// };

// export function* getModsArray({ mods }: BEMProps) {
//     yield* getArray(mods);
// };

// export function* getClassNameArray({ className }: BEMProps) {
//     yield* getArray(className);
// };

type x = types.StringLiteral | types.TemplateLiteral;
export const reduceBlock = (
    blocks: (types.StringLiteral | types.TemplateLiteral)[]
): types.StringLiteral | types.TemplateLiteral => {
    const block = blocks.reduce((previous: x, current: x, index): x => {
        if (types.isTemplateLiteral(previous)) {
            if (types.isStringLiteral(current)) {
                const SPACE_AFTER_PREVIOUS = previous.expressions.length > 0 && index > 0
                    ? SPACE
                    : EMPTY_STRING;

                const secondQuasi = previous.quasis[1].value;
                secondQuasi.raw = `${secondQuasi.raw}${SPACE_AFTER_PREVIOUS}${current.value}`;
            }

            if (types.isTemplateLiteral(current)) {
                previous.quasis.push(types.templateElement({ raw: EMPTY_STRING }));
                previous.expressions.push(current);

                const functionCalls = blocks.reduce((prev, cur, i) => {
                    if (i > index) {
                        if (types.isTemplateLiteral(cur)) {
                            cur.expressions.forEach((expr) => {
                                if (types.isCallExpression(expr)) {
                                    prev.push(expr);
                                }
                            });
                        }
                    }
                    return prev;
                }, [] as types.CallExpression[]);

                if (functionCalls.length > 0) {
                    const xxx = types.callExpression(
                        types.memberExpression(
                            types.arrayExpression(functionCalls),
                            types.identifier('some'),
                            false,
                            false
                        ),
                        [
                            types.arrowFunctionExpression(
                                [types.identifier('f')],
                                types.unaryExpression(
                                    '!',
                                    types.unaryExpression(
                                        '!',
                                        types.callExpression(
                                            types.identifier('f'),
                                            []
                                        )
                                    )
                                )
                            )
                        ]
                    );

                    current.expressions.push(
                        types.templateLiteral(
                            [
                                types.templateElement({ raw: EMPTY_STRING }, false),
                                types.templateElement({ raw: EMPTY_STRING }, true)
                            ],
                            [
                                types.conditionalExpression(
                                    types.callExpression(xxx, []),
                                    types.stringLiteral(SPACE),
                                    types.stringLiteral(EMPTY_STRING)

                                )
                            ]
                        )
                    );

                    current.quasis.push(types.templateElement({ raw: EMPTY_STRING }));
                }
            }
        }

        if (types.isStringLiteral(previous)) {
            const SPACE_AFTER_PREVIOUS = previous.value
                ? SPACE
                : EMPTY_STRING;

            if (types.isStringLiteral(current)) {
                previous.value = `${previous.value}${SPACE_AFTER_PREVIOUS}${current.value}`;
            }

            if (types.isTemplateLiteral(current)) {
                if (previous.value.length > 0) { // If we already have something on the left hand side, put a space between
                    current.quasis[0].value.raw = SPACE;
                }

                const functionCalls = blocks.reduce((prev, cur, i) => {
                    if (i > index) {
                        if (types.isTemplateLiteral(cur)) {
                            cur.expressions.forEach((expr) => {
                                if (types.isCallExpression(expr)) {
                                    prev.push(expr);
                                }
                            });
                        }
                    }
                    return prev;
                }, [] as types.CallExpression[]);

                if (functionCalls.length > 0) {
                    const xxx = types.callExpression(
                        types.memberExpression(
                            types.arrayExpression(functionCalls),
                            types.identifier('some'),
                            false,
                            false
                        ),
                        [
                            types.arrowFunctionExpression(
                                [types.identifier('f')],
                                types.unaryExpression(
                                    '!',
                                    types.unaryExpression(
                                        '!',
                                        types.callExpression(
                                            types.identifier('f'),
                                            []
                                        )
                                    )
                                )
                            )
                        ]
                    );

                    current.expressions.push(
                        types.templateLiteral(
                            [
                                types.templateElement({ raw: EMPTY_STRING }, false),
                                types.templateElement({ raw: EMPTY_STRING }, true)
                            ],
                            [
                                types.conditionalExpression(
                                    types.callExpression(xxx, []),
                                    types.stringLiteral(SPACE),
                                    types.stringLiteral(EMPTY_STRING)

                                )
                            ]
                        )
                    );

                    current.quasis.push(types.templateElement({ raw: EMPTY_STRING }));
                }

                return types.templateLiteral( // Convert to template literal
                    blocks.length === 1 ? current.quasis : [
                        types.templateElement({ raw: previous.value }, false),
                        types.templateElement({ raw: EMPTY_STRING }, true)
                    ],
                    [
                        ...blocks.length > 1 ? [current] : current.expressions
                    ]
                );
            }
        }

        return previous;
    }, types.stringLiteral(EMPTY_STRING));

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
    // const ARRAY_CLASS_NAME = [...getClassNameArray(BEM_PROPS)];
    // const ARRAY_BLOCK = [...getBlockArray(BEM_PROPS)];
    // const ARRAY_ELEM = [...getElemArray(BEM_PROPS)];

    // const BLOCK = reduceBlock(ARRAY_BLOCK, isBlockInherited) || [];

    // // const ELEM = reduceElem(ARRAY_BLOCK, ARRAY_ELEM);

    // const x = [...BLOCK, ...ARRAY_CLASS_NAME].filter(element => element !== null);

    // // return ARRAY_BLOCK;
    // return types.templateLiteral(
    //     [
    //         types.templateElement({ raw: '' }),
    //         ...x.map(() => types.templateElement({ raw: '' }))
    //     ],
    //     // [
    //     //     types.templateElement({ raw: '' }, false),
    //     //     types.templateElement({ raw: '' }, true)
    //     // ],
    //     // @ts-ignore
    //     x
    // );

    const { block } = BEM_PROPS;
    const _BLOCK_ARRAY = getArray(block);
    const _BLOCK = isBlockInherited || !_BLOCK_ARRAY ? null : reduceBlock(_BLOCK_ARRAY);
    // console.log(_BLOCK_ARRAY);

    return _BLOCK;
};
