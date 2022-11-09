import 'react';

declare module 'react' {
    interface HTMLAttributes<T> extends JSX.IntrinsicAttributes {
        block?: string,
        elem?: string,
        mods?: string | Record<string, any> | ((prefix: string) => string)
    }
}
