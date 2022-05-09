# A plugin for Babel that allows converting props into 'className'
## Subject to change without notice.

## How to use:

    <div className="className" block="block" elem="element" mods={{ fullProperty: isRetarded === true }} />
    <div className="className" block="block" elem="element" mods={{ isRetarded }} />
    <div className="className" block="block" elem="element" mods="hello" />

                                ↓↓↓

    <div className={`block block-element${{fullProperty: isRetarded === true} ? "block-element_fullProperty" : ""}`} />
    <div className={`block block-element${{isRetarded} ? "block-element_isRetarded" : ""}`} />
    <div className="block-element_hello" /></>;

You probably shouldn't use this. Yet. :)