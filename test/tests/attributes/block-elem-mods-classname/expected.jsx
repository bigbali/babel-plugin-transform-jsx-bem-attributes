<div className="BLOCK BLOCK-ELEM BLOCK-ELEM_MODS CLASSNAME" />;

<div className="BLOCK BLOCK_MODS CLASSNAME">
    <div className="BLOCK-ELEM CLASSNAME" />
</div>;

<div className="BLOCK CLASSNAME">
    <div className="BLOCK-ELEM BLOCK-ELEM_MODS CLASSNAME" />
</div>;

const getMod = () => true;
<div className={`BLOCK${true ? " BLOCK_MOD1" : ""}${typeof getMod === "function" ? " BLOCK_MOD3" : ""}${getMod() ? " BLOCK_MOD4" : ""} CLASSNAME`}>
    <div className="BLOCK-ELEM" />
</div>;

<div className={`BLOCK BLOCK-ELEM${true ? " BLOCK-ELEM_MOD1" : ""}${typeof getMod === "function" ? " BLOCK-ELEM_MOD3" : ""}${getMod() ? " BLOCK-ELEM_MOD4" : ""} CLASSNAME`}>
    <div className="BLOCK-ELEM" />
</div>;

<div className={`BLOCK${true ? " BLOCK_MOD1" : ""}${typeof getMod === "function" ? " BLOCK_MOD3" : ""}${getMod() ? " BLOCK_MOD4" : ""}${true ? 'yes' : 'no'}`}>
    <div className="BLOCK-ELEM" />
</div>;

<div className={`BLOCK${getMod()} CLASSNAME`}>
    <div className="BLOCK-ELEM CLASSNAME" />
</div>;

<div className={`BLOCK${getMod(" BLOCK_")} CLASSNAME`}>
    <div className="BLOCK-ELEM" />
</div>;

<div className="BLOCK">
    <div className={`BLOCK-ELEM${getMod(" BLOCK-ELEM_")} CLASSNAME`} />
</div>;

<div className={`BLOCK${(() => {})(" BLOCK_")} CLASSNAME`}>
    <div className="BLOCK-ELEM" />
</div>;

<div className={`BLOCK${((prefix) => prefix + ':)')(" BLOCK_")} CLASSNAME`}>
    <div className="BLOCK-ELEM" />
</div>;
