# A plugin for Babel that allows converting 'block', 'elem' and 'mods' props into proper 'className'

## TypeScript support
If you will be using this plugin with TypeScript, you'll need a `<name>.d.ts` file, in which you will have declared at the top of the file:
    
    /// <reference types="babel-plugin-transform-jsx-bem-attributes" />

The file name does not matter, as long as the compiler knows about it.
If it does not, try this in your `tsconfig.json`:

    "include": [
        ...,
        "<name>.d.ts"
    ]

Without this, you'll need to add the types manually, or TypeScript will complain!
## What this plugin does:
It converts 'block', 'elem' and 'mods' attributes into 'className', which allows for dynamic classes using template literals and conditional expressions. If the values provided are static, it will simply output strings.

## How to use:
`type T = string | template literal | object expression | function call expression | (if enabled) a variable identifier`
- `block: T | T[]` → this will be the base used to construct the class
- `elem:  T | T[]` → appended to block; requires `block` to be defined
- `mods:  T | T[]` → if `elem` is defined, it will be appended to that, otherwise to `block`
- `className: T | T[]` → will be appended to the end of the constructed class; will be processed regardless of the other
attributes being defined, which changes the default behaviour
## Configuration:

You can provide these environment variables (case insensitive):
- `allowStringLiteral` → set this to `false` if you wish to disallow use of `strings` as values
- `allowTemplateLiteral` → set this to `false` if you wish to disallow use of `template literals` as values
- `allowArrayExpression` → set this to `false` if you wish to disallow use of `array elements` as values
- `allowObjectExpression` → set this to `false` if you wish to disallow use of `objects` as values
- `allowIdentifier` → set this to `true` if you wish to use variables as values
- `allowFalsyValue` → set this to `true` if you wish to use empty string or empty arrays as values
- `arrayMaxLength` → set this to any number you wish. This controls the maximal length of the array provided as value to an attribute. The default is `3`.

You can set these in your `.babelrc`, like this:

    {
        "plugins": [
            [
                "transform-jsx-bem-attributes",
                {
                    "allowStringLiteral": false,
                    "allowIdentifier": true
                }
            ]
        ]
    }

## What sense could this possibly make?

Sometimes, you just need to build complex classes. This plugin aims to ease that. \
The main vision is using it with the BEM methodology.

Example JSX: \ `todo`
### Note:

While it is absolutely possible to construct totally, obnoxiously complicated classes using arrays, I strongly discourage doing so. It will increase complexity drastically, at the detriment of file size and performance.
#### If you notice any errors or have any suggestions, feel free to reach out.


