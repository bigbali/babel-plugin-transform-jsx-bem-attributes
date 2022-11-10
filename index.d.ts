import 'react';

declare module 'react' {
    interface HTMLAttributes<T> {
        block?: string,
        elem?: string,
        mods?: string | Record<string, any> | ((prefix: string) => string)
    }
}

declare global { // the goal of this is to allow using our attributes on react-router-dom's components
    namespace JSX {
        interface IntrinsicAttributes {
            block?: string,
            elem?: string,
            mods?: string | Record<string, any> | ((prefix: string) => string)
        }
    }
}
