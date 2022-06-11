const BlockMods = () => {
    const isTrue = true;
    const isFalse = false;

    return (
        <>
            <div block="Block" mods="Mods" />
            <div block="Block" mods={"Mods"} />
            <div block="Block" mods={["Mods0", "Mods1", "Mods2"]} />
            <div block="Block" mods={{ mods0: true, mods1: true }} />
            <div block="Block" mods={{ mods0: true, mods1: false }} />
            <div block="Block" mods={{ mods0: false, mods1: false }} />
            <div block="Block" mods={{ isTrue, isTrue: isTrue }} />
            <div block="Block" mods={{ isFalse, isFalse: isFalse }} />
            <div block="Block" mods={{ trueExpression: true === true, falseExpression: true === false }} />

            <div block={"Block"} mods="Mods" />
            <div block={"Block"} mods={"Mods"} />
            <div block={"Block"} mods={["Mods0", "Mods1", "Mods2"]} />
            <div block={"Block"} mods={{ mods0: true, mods1: true }} />
            <div block={"Block"} mods={{ mods0: true, mods1: false }} />
            <div block={"Block"} mods={{ mods0: false, mods1: false }} />
            <div block={"Block"} mods={{ isTrue, isTrue: isTrue }} />
            <div block={"Block"} mods={{ isFalse, isFalse: isFalse }} />

            <div block={["Block0", "Block1", "Block2"]} mods="Mods" />
            <div block={["Block0", "Block1", "Block2"]} mods={"Mods"} />
            <div block={["Block0", "Block1", "Block2"]} mods={["Mods0", "Mods1", "Mods2"]} />
            <div block={["Block0", "Block1", "Block2"]} mods={{ mods0: true, mods1: true }} />
            <div block={["Block0", "Block1", "Block2"]} mods={{ mods0: true, mods1: false }} />
            <div block={["Block0", "Block1", "Block2"]} mods={{ mods0: false, mods1: false }} />
            <div block={["Block0", "Block1", "Block2"]} mods={{ isTrue, isTrue: isTrue }} />
            <div block={["Block0", "Block1", "Block2"]} mods={{ isFalse, isFalse: isFalse }} />

            <div block="Block" mods="" />
            <div block="Block" mods={""} />
            <div block="Block" mods={["", "", ""]} />

            <div block={"Block"} mods="" />
            <div block={"Block"} mods={""} />
            <div block={"Block"} mods={["", "", ""]} />

            <div block={["Block0", "Block1", "Block2"]} mods="" />
            <div block={["Block0", "Block1", "Block2"]} mods={""} />
            <div block={["Block0", "Block1", "Block2"]} mods={["", "", ""]} />

            <div block="" mods="Mods" />
            <div block="" mods={"Mods"} />
            <div block="" mods={["Mods0", "Mods1", "Mods2"]} />

            <div block={""} mods="Mods" />
            <div block={""} mods={"Mods"} />
            <div block={""} mods={["Mods0", "Mods1", "Mods2"]} />

            <div block={["", "", ""]} mods="Mods" />
            <div block={["", "", ""]} mods={"Mods"} />
            <div block={["", "", ""]} mods={["Mods0", "Mods1", "Mods2"]} />
        </>
    );
}