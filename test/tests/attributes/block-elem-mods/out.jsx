/*
    This file is generated automatically.
*/

<div className="BLOCK BLOCK-ELEM BLOCK-ELEM_MODS" />;

<div className="BLOCK BLOCK_MODS">
    <div className="BLOCK-ELEM" />
</div>;

<div className="BLOCK">
    <div className="BLOCK-ELEM BLOCK-ELEM_MODS" />
</div>;

const getMod = () => true;
function getMod2() {return true;};
<div className={`TEMPLATE_PREFIX${true ? " BLOCK_MOD1" : ""}QUASI${typeof getMod === "function" ? " BLOCK_MOD3" : ""}QUASI${getMod() ? " BLOCK_MOD4" : ""}QUASI`}>
    <div className="BLOCK-ELEM" />
</div>;

<div className="BLOCK">
    <div className={`TEMPLATE_PREFIX${true ? " BLOCK-ELEM_MOD1" : ""}QUASI${typeof getMod === "function" ? " BLOCK-ELEM_MOD3" : ""}QUASI${getMod() ? " BLOCK-ELEM_MOD4" : ""}QUASI`} />
</div>;

<div className={`TEMPLATE_PREFIX${getMod()}`}>
    <div className="BLOCK-ELEM" />
</div>;

<div className="BLOCK">
    <div className={`TEMPLATE_PREFIX${getMod()}`} />
</div>;

<div className={`TEMPLATE_PREFIX${getMod(" BLOCK_")}`}>
    <div className="BLOCK-ELEM" />
</div>;

<div className="BLOCK">
    <div className={`TEMPLATE_PREFIX${getMod(" BLOCK-ELEM_")}`} />
</div>;

<div className="BLOCK">
    <div className={`TEMPLATE_PREFIX${getMod2(" BLOCK-ELEM_")}`} />
</div>;

<div className={`TEMPLATE_PREFIX${(() => {})(" BLOCK_")}`}>
    <div className="BLOCK-ELEM" />
</div>;

<div className="BLOCK">
    <div className={`TEMPLATE_PREFIX${(() => {})(" BLOCK-ELEM_")}`} />
</div>;

<div className={`TEMPLATE_PREFIX${((prefix) => prefix + ':)')(" BLOCK_")}`}>
    <div className="BLOCK-ELEM" />
</div>;

<div className="BLOCK">
    <div className={`TEMPLATE_PREFIX${((prefix) => prefix + ':)')(" BLOCK-ELEM_")}`} />
</div>;