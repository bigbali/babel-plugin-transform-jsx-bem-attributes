<div className="BLOCK BLOCK-ELEM BLOCK-ELEM_MODS" />;

<div className="BLOCK BLOCK_MODS">
    <div className="BLOCK-ELEM" />
</div>;

<div className="BLOCK">
    <div className="BLOCK-ELEM BLOCK-ELEM_MODS" />
</div>;

const getMod = () => true;
function getMod2() {return true;};
<div className={`BLOCK${true ? " BLOCK_MOD1" : ""}${typeof getMod === "function" ? " BLOCK_MOD3" : ""}${getMod() ? " BLOCK_MOD4" : ""}`}>
    <div className="BLOCK-ELEM" />
</div>;

<div className="BLOCK">
    <div className={`BLOCK-ELEM${true ? " BLOCK-ELEM_MOD1" : ""}${typeof getMod === "function" ? " BLOCK-ELEM_MOD3" : ""}${getMod() ? " BLOCK-ELEM_MOD4" : ""}`} />
</div>;

<div className={`BLOCK${getMod()}`}>
    <div className="BLOCK-ELEM" />
</div>;

<div className="BLOCK">
    <div className={`BLOCK-ELEM${getMod()}`} />
</div>;

<div className={`BLOCK${getMod(" BLOCK_")}`}>
    <div className="BLOCK-ELEM" />
</div>;

<div className="BLOCK">
    <div className={`BLOCK-ELEM${getMod(" BLOCK-ELEM_")}`} />
</div>;

<div className="BLOCK">
    <div className={`BLOCK-ELEM${getMod2(" BLOCK-ELEM_")}`} />
</div>;

<div className={`BLOCK${(() => {})(" BLOCK_")}`}>
    <div className="BLOCK-ELEM" />
</div>;

<div className="BLOCK">
    <div className={`BLOCK-ELEM${(() => {})(" BLOCK-ELEM_")}`} />
</div>;

<div className={`BLOCK${((prefix) => prefix + ':)')(" BLOCK_")}`}>
    <div className="BLOCK-ELEM" />
</div>;

<div className="BLOCK">
    <div className={`BLOCK-ELEM${((prefix) => prefix + ':)')(" BLOCK-ELEM_")}`} />
</div>;