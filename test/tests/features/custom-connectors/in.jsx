const CustomConnectors = () => {
    const isTrue = true;

    return (
        <>
            <div block="Block" elem="Elem" />
            <div block="Block" elem={"Elem"} />
            <div block="Block" elem={["Elem0", "Elem1", "Elem2"]} />

            <div block={["Block0", "Block1", "Block2"]} elem="Elem" />
            <div block={["Block0", "Block1", "Block2"]} elem={"Elem"} />
            <div block={["Block0", "Block1", "Block2"]} elem={["Elem0", "Elem1", "Elem2"]} />

            <div block="Block" elem="Elem" mods="Mods" />
            <div block="Block" elem="Elem" mods={"Mods"} />
            <div block="Block" elem="Elem" mods={["Mods0", "Mods1", "Mods2"]} />
            <div block="Block" elem="Elem" mods={{ mods0: true, mods1: true }} />
            <div block="Block" elem="Elem" mods={{ mods0: true, mods1: false }} />
            <div block="Block" elem="Elem" mods={{ mods0: false, mods1: false }} />
            <div block="Block" elem="Elem" mods={{ isTrue, isTrue: isTrue }} />
            <div block="Block" elem="Elem" mods={{ trueExpression: true === true, falseExpression: true === false }} />

            <div block="Block" mods="Mods" />
            <div block="Block" mods={"Mods"} />
            <div block="Block" mods={["Mods0", "Mods1", "Mods2"]} />
            <div block="Block" mods={{ mods0: true, mods1: true }} />
            <div block="Block" mods={{ mods0: true, mods1: false }} />
            <div block="Block" mods={{ mods0: false, mods1: false }} />
            <div block="Block" mods={{ isTrue, isTrue: isTrue }} />
            <div block="Block" mods={{ trueExpression: true === true, falseExpression: true === false }} />

            <div block="Block" elem="Elem" mods="" />
            <div block="Block" elem={"Elem"} mods="" />
            <div block="Block" elem={["Elem0", "Elem1", "Elem2"]} mods="" />
        </>
    );
}