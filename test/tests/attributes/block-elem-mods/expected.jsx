<div className="BLOCK BLOCK-ELEM BLOCK-ELEM_MODS" />;

<div className="BLOCK BLOCK_MODS">
    <div className="BLOCK-ELEM" />
</div>;

<div className="BLOCK">
    <div className="BLOCK-ELEM BLOCK-ELEM_MODS" />
</div>;

const getMod = () => true;
<div className={`BLOCK${`${true ? "BLOCK-MOD1" : ""}`}`}>
    <div elem="ELEM" />
</div>;

<div block="BLOCK">
    <div elem="ELEM" mods={{ MOD1: true, MOD2: false, MOD3: typeof getMod === 'function', MOD4: getMod() }} />
</div>;
