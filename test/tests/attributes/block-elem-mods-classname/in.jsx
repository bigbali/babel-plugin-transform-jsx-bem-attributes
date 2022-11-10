<div block="BLOCK" elem="ELEM" mods="MODS" className="CLASSNAME" />;

<div block="BLOCK" mods="MODS" className="CLASSNAME">
    <div elem="ELEM" className="CLASSNAME" />
</div>;

<div block="BLOCK" className="CLASSNAME">
    <div elem="ELEM" mods="MODS" className="CLASSNAME" />
</div>;

const getMod = () => true;
<div block="BLOCK" mods={{ MOD1: true, MOD2: false, MOD3: typeof getMod === "function", MOD4: getMod() }} className="CLASSNAME">
    <div elem="ELEM" />
</div>;

<div block="BLOCK" elem='ELEM' mods={{ MOD1: true, MOD2: false, MOD3: typeof getMod === "function", MOD4: getMod() }} className="CLASSNAME">
    <div elem="ELEM" />
</div>;

<div block="BLOCK" mods={{ MOD1: true, MOD2: false, MOD3: typeof getMod === "function", MOD4: getMod() }} className={true ? 'yes' : 'no'}>
    <div elem="ELEM" />
</div>;

<div block="BLOCK" mods={getMod()} className="CLASSNAME">
    <div elem="ELEM" className="CLASSNAME" />
</div>;

<div block="BLOCK" mods={getMod} className="CLASSNAME">
    <div elem="ELEM" />
</div>;

<div block="BLOCK">
    <div elem="ELEM" mods={getMod} className="CLASSNAME" />
</div>;

<div block="BLOCK" mods={() => { }} className="CLASSNAME">
    <div elem="ELEM" />
</div>;

<div block="BLOCK" mods={(prefix) => prefix + ':)'} className="CLASSNAME">
    <div elem="ELEM" />
</div>;
