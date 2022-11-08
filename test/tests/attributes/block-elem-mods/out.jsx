/*
    This file is generated automatically.
*/

<div className="BLOCK BLOCK-ELEM BLOCK-ELEM_MODS" />;

<div className="BLOCK BLOCK_MODS">
    <div className="BLOCK-ELEM" />
</div>;

<div>
    <div block='BLOCK'>
        <div elem='ELEM' />
    </div>
</div>;

<div className="BLOCK">
    <div className="BLOCK-ELEM BLOCK-ELEM_MODS" />
</div>;

const getMod = () => true;
<div className={`BLOCK${true ? " BLOCK_MOD1" : ""}${typeof getMod === 'function' ? " BLOCK_MOD3" : ""}${getMod() ? " BLOCK_MOD4" : ""}`}>
    <div className="BLOCK-ELEM" />
</div>;

<div className="BLOCK">
    <div className={`BLOCK-ELEM${true ? " BLOCK-ELEM_MOD1" : ""}${typeof getMod === 'function' ? " BLOCK-ELEM_MOD3" : ""}${getMod() ? " BLOCK-ELEM_MOD4" : ""}`} />
</div>;