import { TransformOptions } from '@babel/core';
export declare const CONFIG: TransformOptions;
export declare const parseClassNames: (attributeDirectory: string) => string[][];
export declare const getDetails: (node: any) => any;
export declare const getClassName: (ast: {
    program: {
        body: [
            ({
                declarations: any;
            } | undefined)?
        ];
    };
}) => any;
export declare const generateFile: (directory: string, fileName: string, content: string) => void;
