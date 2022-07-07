# A plugin for Babel that allows converting 'block', 'elem' and 'mods' props into proper 'className'

# Note: this documentation needs to be updated!

## TypeScript
If you are going to be using this plugin with TypeScript, you'll need a `<filename>.d.ts` file, in which you will have declared at the top of the file:
    
    /// <reference types="babel-plugin-transform-jsx-bem-attributes" />

The file name does not matter, as long as the compiler knows about it.
If it does not, try this in your `tsconfig.json`:

    "include": [
        ...,
        "<path-to-your-declaration-file>"
    ]

Without this, you'll need to add the types manually, or TypeScript will complain!
## What this plugin does:
It converts 'block', 'elem' and 'mods' attributes into 'className', which allows for dynamic classes using template literals and conditional expressions.

## How to use:
- block: string | string[] → this will be the base used to construct the class
- elem:  string | string[] → appended to block; requires block to be defined
- mods:  string | string[] | object → if is an object, template literals will be created using the properties; requires block to be defined
- className: string | string[] → will be appended to the previously constructed class
## Configuration:

You can provide these environment variables:
- BEM_JSX_DISABLE_BLOCK_INHERITANCE → set this to any truthy string to disable passing 'block' down from parent to child (in this case, you will have to define 'block' on each JSX element)
- BEM_JSX_ELEM_CONNECTOR → use this to connect 'elem' to 'block'. Default: '-'.
- BEM_JSX_MODS_CONNECTOR → use this to connect 'mods' to 'elem'. Default: '_'.

You can set these in your Webpack config, like this:

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                BEM_JSX_DISABLE_BLOCK_INHERITANCE: 'true',
                BEM_JSX_ELEM_CONNECTOR: '§',
                BEM_JSX_MODS_CONNECTOR: '~'
            }
        })
    ]

## What sense could this possibly make?

It makes it very easy to build classes using the BEM methodology.
Consider this:
JSX: \
&nbsp;&nbsp;&nbsp;&nbsp;Input:

    <div block="Block">
        <div elem="Elem" mods={ isBlue: shouldColorBeBlue === true } />;
    </div>

&nbsp;&nbsp;&nbsp;&nbsp;Output:

    <div className="Block">
        <div className={`Block Block-Elem ${ shouldColorBeBlue === true ? "Block-Elem_isBlue" : "" }`} />;
    </div>

SASS:

    .Block {
        height: 640px;
        background-color: yellow;

        &-Elem {
            padding: 48px;
            background-color: red;

            &_isBlue {
                background-color: blue;
            }
        }
    }

### Note:

You can easily do the following, but it's probably not a good idea:

    <div block={["Block0", "Block1", "Block2"]} elem={["Elem0", "Elem1", "Elem2"]} />
&nbsp;&nbsp;↓

    <div className="Block0 Block1 Block2 Block0-Elem0 Block0-Elem1 Block0-Elem2 Block1-Elem0 Block1-Elem1 Block1-Elem2 Block2-Elem0 Block2-Elem1 Block2-Elem2" />

#### If you notice any errors or have any suggestions, feel free to reach out.


