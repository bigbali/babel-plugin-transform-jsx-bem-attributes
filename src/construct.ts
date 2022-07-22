import { NodePath, types } from '@babel/core';
import { getHeapSpaceStatistics } from 'v8';
import {
    BEMProps,
    BEMPropTypes,
    Block,
    isArray
} from './types';

const EMPTY_STRING = '';
const SPACE = ' ';

const getArray = (value: types.Expression | null) => {
    if (types.isStringLiteral(value) || types.isTemplateLiteral(value)) {
        return [value];
    }

    if (types.isArrayExpression(value)) {
        return value.elements.map(element => {
            if (types.isExpression(value)) {
                if (element) {
                    if (types.isStringLiteral(element) && element.value) {
                        return element;
                    }

                    if (!types.isSpreadElement(element)) {
                        return types.templateLiteral(
                            [
                                types.templateElement({ raw: '' }, false),
                                types.templateElement({ raw: '' }, true)
                            ],
                            [
                                element
                            ]
                        );
                    }
                }

                return null;
            }

            return null;
        });
    }

    if (types.isExpression(value)) {
        return [
            types.templateLiteral(
                [
                    types.templateElement({ raw: '' }, false),
                    types.templateElement({ raw: '' }, true)
                ],
                [
                    value
                ]
            )
        ];
    }

    return [null];
};

export function* getBlockArray({ block }: BEMProps) {
    yield* getArray(block);
};

export function* getElemArray({ elem }: BEMProps) {
    yield* getArray(elem);
};

export function* getModsArray({ mods }: BEMProps) {
    yield* getArray(mods);
};

export function* getClassNameArray({ className }: BEMProps) {
    yield* getArray(className);
};

export const reduceBlock = (blocks: Block[], isInherited: boolean) => {
    if (isInherited) {
        return EMPTY_STRING;
    }

    blocks.reduce((previous, current) => {
        // if (types.isStringLiteral(current)) {
        //     const SPACE_AFTER_BLOCK = previous && current
        //         ? SPACE
        //         : EMPTY_STRING;

        //     return `${previous}${SPACE_AFTER_BLOCK}${current.value}`;
        // }

        if (current === null) {
            return previous;
        }

        return types.templateLiteral(
            [
                types.templateElement({ raw: '' }, false),
                types.templateElement({ raw: '' }, true)
            ],
            [
                current
            ]);

        return previous;
    }, null);

    // return types.templateLiteral(
    //     [
    //         types.templateElement({ raw: '' }, false),
    //         types.templateElement({ raw: '' }, true)
    //     ],
    //     [
    //         block
    //     ]);
};


export default function constructClassNameAttribute(
    BEM_PROPS: BEMProps,
    isBlockInherited: boolean,
    element: NodePath<types.JSXElement>
) {
    const ARRAY_CLASS_NAME = [...getClassNameArray(BEM_PROPS)];
    const ARRAY_BLOCK = [...getBlockArray(BEM_PROPS)];

    // const BLOCK = reduceBlock(ARRAY_BLOCK, isBlockInherited);

    const x = [...ARRAY_BLOCK, ...ARRAY_CLASS_NAME];

    // return ARRAY_BLOCK;
    return types.templateLiteral(
        [
            // types.templateElement({ raw: '' }),
            ...x.map(() => types.templateElement({ raw: '' }))
        ],
        // [
        //     types.templateElement({ raw: '' }, false),
        //     types.templateElement({ raw: '' }, true)
        // ],
        // @ts-ignore
        [
            ...ARRAY_BLOCK.filter(block => { if (block) { return true; } }),
            ...ARRAY_CLASS_NAME.filter(block => { if (block) { return true; } })
        ]
    );

    // const BLOCK = ARRAY_BLOCK.reduce((previous, current) => {
    //     if (types.isStringLiteral(current)) {
    //         const SPACE_AFTER_BLOCK = previous && current
    //         ? SPACE
    //         : EMPTY_STRING;

    //         return `${previous}${SPACE_AFTER_BLOCK}${current}`;
    //     }
    //     if (types.isTemplateLiteral(element)) {

    //     }


    //     return previous;
    // }, EMPTY_STRING);

    // return [...CLASS_NAME].filter((x) => {
    //     return (x !== null);
    // });

};
