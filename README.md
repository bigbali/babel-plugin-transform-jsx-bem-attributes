# A plugin for Babel that allows converting props into 'className'
### Currently in experimental stage. Probably should not use it just yet.

## What this plugin does:
- it converts 'block', 'elem' and 'mods' attributes to 'className' which allows for dynamic classes using template literals and conditional expressions
- Well, yes, this is actually all it does.

## How to use:
- block: string → this will be the base used to construct the class
- elem:  string → appended to a duplicate of block, separated by a separator of your choosing
- mods:  string | object → if string, no template literal will be created, only a static string. However, if it's an object, every property will be added to a conditional expression and the property name will be used as modifier name
- className: string → the original 'className' will be appended with the above
### Examples:

    <div block="block" />
    <div block="block" elem="element" />
    <div block="block" elem="element" mods={{ modifier: true }} />
    <div className="beautiful-className" block="block" elem="element" mods={{ modifier: true }} />

<!-- Push inwards without triggering code formatting -->
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;↓ becomes ↓

&nbsp;

    <div className="block" />
    <div className="block block-element" />
    <div className={`block block-element ${modifier: true ? 'block-element_modifier' : ''}`} />
    <div className={`beautiful-className block block-element ${modifier: true ? 'block-element_modifier' : ''}`} />

### Configuration:

You can provide these environment variables:
- REACT_BEM_MODE_PASSIVE: set this to any thruthy value and no conditional expressions will be created, only static strings
- REACT_BEM_ELEM_CONNECTOR
- REACT_BEM_MODS_CONNECTOR

You can set these in your Webpack config, like this:

    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                REACT_BEM_MODE_PASSIVE: 'true',
                REACT_BEM_ELEM_CONNECTOR: '???',
                REACT_BEM_MODS_CONNECTOR: '|||'
            }
        })
    ]

### What sense does this possibly make?

It makes it very easy to use the BEM methodology.
In your styles you can do magic such as:

    .block {
        ...

        &-elem {
            display: none;
            ...

            &_isActive {
                display: block;
            }

            &_hasRandomProperty {
                background-color: red;
            }
        }
    }

You could argue that it makes the classes unnecessarily long, increasing the overall file size, and yes, that is the tradeoff.

#### If you notice any errors or have any suggestions, feel free to reach out.


