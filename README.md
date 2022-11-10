# A plugin for Babel that allows converting 'block', 'elem' and 'mods' props into proper 'className'
## TypeScript support
If you will be using this plugin with TypeScript, you'll need a `<name>.d.ts` file, in which you will have declared at the top of the file:
```typescript
    /// <reference types="babel-plugin-transform-jsx-bem-attributes" />
```

The file name does not matter, as long as the compiler knows about it.
If it does not, try this in your `tsconfig.json`:

```json
    "include": [
        ...,
        "<name>.d.ts"
    ]
```

Without this, you'll need to add the types manually, or TypeScript will complain!
## What this plugin does:
It converts `block`, `elem` and `mods` attributes into `className`, which allows for dynamic classes using template literals and conditional expressions. If the values provided are static, it will simply output strings.

## How to use:
- `block: string` → this will be the base used to construct the class
- `elem:  string` → appended to block; requires `block` to be defined
- `mods:  string | (prefix: string) => string | object` → if `elem` is defined, it will be appended to that, otherwise to `block`
- `className` → will be appended to the end of the constructed class
## Configuration:

You can set these options:

    plugin: {
        enable: boolean, default: true → enable the plugin
        error: "throw" | "warn", default: "throw" → throw errors, instead of printing in the console
    }

    block: {
        preserve: boolean, default: true → when we have top level 'block' and 'elem', keep 'block' (otherwise keep 'elem' only)
    }

You can set these in your `.babelrc`, like this:
```json
{
    "plugins": [
        [
            "transform-jsx-bem-attributes",
            {
                "plugin": {
                    "enable": false
                }
            }
        ]
    ]
}
```

## What sense could this possibly make?
It helps me write my classes. Maybe it will help you as well :)

Example JSX: \ `todo`
```javascript
IN:
    <div block="BLOCK" elem="ELEM" mods="MODS" className="CLASSNAME" />;
OUT:
    <div className="BLOCK BLOCK-ELEM BLOCK-ELEM_MODS CLASSNAME" />;

IN:
    <div block="BLOCK" mods="MODS" className="CLASSNAME">
        <div elem="ELEM" />
    </div>;

OUT:
    <div className="BLOCK BLOCK_MODS CLASSNAME">
        <div className="BLOCK-ELEM" />
    </div>;

IN:
    <div block="BLOCK" mods={{ MOD1: true, MOD2: false, MOD3: typeof getMod === "function", MOD4: getMod() }} className="CLASSNAME">
        <div elem="ELEM" />
    </div>;

OUT:
    <div className={`BLOCK${true ? " BLOCK_MOD1" : ""}${typeof getMod === "function" ? " BLOCK_MOD3" : ""}${getMod() ? " BLOCK_MOD4" : ""} CLASSNAME`}>
        <div className="BLOCK-ELEM" />
    </div>;

IN:
    <div block="BLOCK" mods={getMod}>
        <div elem="ELEM" />
    </div>;

OUT:
    <div className={`BLOCK${getMod(" BLOCK_")} CLASSNAME`}>
        <div className="BLOCK-ELEM" />
    </div>;
```


### Note:
#### If you notice any errors or have any suggestions, please reach out.


