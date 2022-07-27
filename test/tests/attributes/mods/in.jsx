const object = { p1: true, p2: false };
const otherobject = { p1: "op1", p2: "op2" };
const func = () => true;

<div block="Block">
    <div mods="Mods" />
    <div elem="Elem" mods="Mods" />
    <div elem="Elem" mods={object} />
    <div elem="Elem" mods={{ m1: (() => typeof object === 'object')(), m2: (() => typeof object === 'object')() }} />
    <div elem="Elem" mods={{ p1: true, p2: true }} />
    <div elem="Elem" mods={{ p1: true, p2: false }} />
    <div elem="Elem" mods={{ p1: func() }} />
    <div elem="Elem" mods={{ p1: object !== func }} />
    <div elem="Elem" mods={{ [object.p1]: true }} /> {/* undefined */}
    <div elem="Elem" mods={{ [object.p1]: func() }} /> {/* undefined */}
    <div elem="Elem" mods={{ [otherobject.p1]: true }} />
    <div elem="Elem" mods={{ [otherobject.p1]: func() }} />
    <div elem="Elem" mods={{ ["cp1"]: true }} />
    <div elem="Elem" mods={{ ["cp1"]: func() }} />
    <div elem="Elem" mods={{ ...object }} />
    <p elem="Message" mods={{ hello: true !== false }}>
        {otherobject.p2}
    </p>
</div>
