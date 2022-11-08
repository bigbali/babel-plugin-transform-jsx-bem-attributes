<div block="BLOCK" elem="ELEM" mods="MODS" />;

<div block="BLOCK" mods="MODS">
    <div elem="ELEM" />
</div>;

<div block="BLOCK">
    <div elem="ELEM" mods="MODS" />
</div>;

const getMod = () => true;
<div block="BLOCK" mods={{ MOD1: true, MOD2: false, MOD3: typeof getMod === 'function', MOD4: getMod() }}>
    <div elem="ELEM" />
</div>;

<div block="BLOCK">
    <div elem="ELEM" mods={{ MOD1: true, MOD2: false, MOD3: typeof getMod === 'function', MOD4: getMod() }} />
</div>;
