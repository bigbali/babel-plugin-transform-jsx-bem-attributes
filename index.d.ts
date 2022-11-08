import 'react';
import 'react-router-dom';

declare module 'react' {
    interface HTMLAttributes<T> {
        block?: string,
        elem?: string,
        mods?: string | object | unknown[]
    }
}

declare global {
    namespace JSX {
        interface IntrinsicAttributes {
            block?: string,
            elem?: string,
            mods?: string | object | unknown[]
        }
    }
}