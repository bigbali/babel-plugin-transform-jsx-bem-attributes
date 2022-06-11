const BlockMods = () => {
    const isTrue = true;
    const isFalse = false;

    return (
        <>
            <div block="Block" elem="Elem" mods="Mods" />
            <div block="Block" elem="Elem" mods={"Mods"} />
            <div block="Block" elem="Elem" mods={["Mods0", "Mods1", "Mods2"]} />
            <div block="Block" elem="Elem" mods={{ mods0: true, mods1: true }} />
            <div block="Block" elem="Elem" mods={{ mods0: true, mods1: false }} />
            <div block="Block" elem="Elem" mods={{ mods0: false, mods1: false }} />
            <div block="Block" elem="Elem" mods={{ isTrue, isTrue: isTrue }} />
            <div block="Block" elem="Elem" mods={{ trueExpression: true === true, falseExpression: true === false }} />

            <div block="Block" elem={"Elem"} mods="Mods" />
            <div block="Block" elem={"Elem"} mods={"Mods"} />
            <div block="Block" elem={"Elem"} mods={["Mods0", "Mods1", "Mods2"]} />
            <div block="Block" elem={"Elem"} mods={{ mods0: true, mods1: true }} />
            <div block="Block" elem={"Elem"} mods={{ mods0: true, mods1: false }} />
            <div block="Block" elem={"Elem"} mods={{ mods0: false, mods1: false }} />
            <div block="Block" elem={"Elem"} mods={{ isTrue, isTrue: isTrue }} />
            <div block="Block" elem={"Elem"} mods={{ trueExpression: true === true, falseExpression: true === false }} />

            <div block="Block" elem={["Elem0", "Elem1", "Elem2"]} mods="Mods" />
            <div block="Block" elem={["Elem0", "Elem1", "Elem2"]} mods={"Mods"} />
            <div block="Block" elem={["Elem0", "Elem1", "Elem2"]} mods={["Mods0", "Mods1", "Mods2"]} />
            <div block="Block" elem={["Elem0", "Elem1", "Elem2"]} mods={{ mods0: true, mods1: true }} />
            <div block="Block" elem={["Elem0", "Elem1", "Elem2"]} mods={{ mods0: true, mods1: false }} />
            <div block="Block" elem={["Elem0", "Elem1", "Elem2"]} mods={{ mods0: false, mods1: false }} />
            <div block="Block" elem={["Elem0", "Elem1", "Elem2"]} mods={{ isTrue, isTrue: isTrue }} />
            <div block="Block" elem={["Elem0", "Elem1", "Elem2"]} mods={{ trueExpression: true === true, falseExpression: true === false }} />

            {/*  */}

            <div block={"Block"} elem="Elem" mods="Mods" />
            <div block={"Block"} elem="Elem" mods={"Mods"} />
            <div block={"Block"} elem="Elem" mods={["Mods0", "Mods1", "Mods2"]} />
            <div block={"Block"} elem="Elem" mods={{ mods0: true, mods1: true }} />
            <div block={"Block"} elem="Elem" mods={{ mods0: true, mods1: false }} />
            <div block={"Block"} elem="Elem" mods={{ mods0: false, mods1: false }} />
            <div block={"Block"} elem="Elem" mods={{ isTrue, isTrue: isTrue }} />
            <div block={"Block"} elem="Elem" mods={{ trueExpression: true === true, falseExpression: true === false }} />

            <div block={"Block"} elem={"Elem"} mods="Mods" />
            <div block={"Block"} elem={"Elem"} mods={"Mods"} />
            <div block={"Block"} elem={"Elem"} mods={["Mods0", "Mods1", "Mods2"]} />
            <div block={"Block"} elem={"Elem"} mods={{ mods0: true, mods1: true }} />
            <div block={"Block"} elem={"Elem"} mods={{ mods0: true, mods1: false }} />
            <div block={"Block"} elem={"Elem"} mods={{ mods0: false, mods1: false }} />
            <div block={"Block"} elem={"Elem"} mods={{ isTrue, isTrue: isTrue }} />
            <div block={"Block"} elem={"Elem"} mods={{ trueExpression: true === true, falseExpression: true === false }} />

            <div block={"Block"} elem={["Elem0", "Elem1", "Elem2"]} mods="Mods" />
            <div block={"Block"} elem={["Elem0", "Elem1", "Elem2"]} mods={"Mods"} />
            <div block={"Block"} elem={["Elem0", "Elem1", "Elem2"]} mods={["Mods0", "Mods1", "Mods2"]} />
            <div block={"Block"} elem={["Elem0", "Elem1", "Elem2"]} mods={{ mods0: true, mods1: true }} />
            <div block={"Block"} elem={["Elem0", "Elem1", "Elem2"]} mods={{ mods0: true, mods1: false }} />
            <div block={"Block"} elem={["Elem0", "Elem1", "Elem2"]} mods={{ mods0: false, mods1: false }} />
            <div block={"Block"} elem={["Elem0", "Elem1", "Elem2"]} mods={{ isTrue, isTrue: isTrue }} />
            <div block={"Block"} elem={["Elem0", "Elem1", "Elem2"]} mods={{ trueExpression: true === true, falseExpression: true === false }} />

            {/*  */}

            <div block={["Block0", "Block1", "Block2"]} elem="Elem" mods="Mods" />
            <div block={["Block0", "Block1", "Block2"]} elem="Elem" mods={"Mods"} />
            <div block={["Block0", "Block1", "Block2"]} elem="Elem" mods={["Mods0", "Mods1", "Mods2"]} />
            <div block={["Block0", "Block1", "Block2"]} elem="Elem" mods={{ mods0: true, mods1: true }} />
            <div block={["Block0", "Block1", "Block2"]} elem="Elem" mods={{ mods0: true, mods1: false }} />
            <div block={["Block0", "Block1", "Block2"]} elem="Elem" mods={{ mods0: false, mods1: false }} />
            <div block={["Block0", "Block1", "Block2"]} elem="Elem" mods={{ isTrue, isTrue: isTrue }} />
            <div block={["Block0", "Block1", "Block2"]} elem="Elem" mods={{ trueExpression: true === true, falseExpression: true === false }} />

            <div block={["Block0", "Block1", "Block2"]} elem={"Elem"} mods="Mods" />
            <div block={["Block0", "Block1", "Block2"]} elem={"Elem"} mods={"Mods"} />
            <div block={["Block0", "Block1", "Block2"]} elem={"Elem"} mods={["Mods0", "Mods1", "Mods2"]} />
            <div block={["Block0", "Block1", "Block2"]} elem={"Elem"} mods={{ mods0: true, mods1: true }} />
            <div block={["Block0", "Block1", "Block2"]} elem={"Elem"} mods={{ mods0: true, mods1: false }} />
            <div block={["Block0", "Block1", "Block2"]} elem={"Elem"} mods={{ mods0: false, mods1: false }} />
            <div block={["Block0", "Block1", "Block2"]} elem={"Elem"} mods={{ isTrue, isTrue: isTrue }} />
            <div block={["Block0", "Block1", "Block2"]} elem={"Elem"} mods={{ trueExpression: true === true, falseExpression: true === false }} />

            <div block={["Block0", "Block1", "Block2"]} elem={["Elem0", "Elem1", "Elem2"]} mods="Mods" />
            <div block={["Block0", "Block1", "Block2"]} elem={["Elem0", "Elem1", "Elem2"]} mods={"Mods"} />
            <div block={["Block0", "Block1", "Block2"]} elem={["Elem0", "Elem1", "Elem2"]} mods={["Mods0", "Mods1", "Mods2"]} />
            <div block={["Block0", "Block1", "Block2"]} elem={["Elem0", "Elem1", "Elem2"]} mods={{ mods0: true, mods1: true }} />
            <div block={["Block0", "Block1", "Block2"]} elem={["Elem0", "Elem1", "Elem2"]} mods={{ mods0: true, mods1: false }} />
            <div block={["Block0", "Block1", "Block2"]} elem={["Elem0", "Elem1", "Elem2"]} mods={{ mods0: false, mods1: false }} />
            <div block={["Block0", "Block1", "Block2"]} elem={["Elem0", "Elem1", "Elem2"]} mods={{ isTrue, isTrue: isTrue }} />
            <div block={["Block0", "Block1", "Block2"]} elem={["Elem0", "Elem1", "Elem2"]} mods={{ trueExpression: true === true, falseExpression: true === false }} />

            <div block="Block" elem="Elem" mods="" />
            <div block="Block" elem={"Elem"} mods="" />
            <div block="Block" elem={["Elem0", "Elem1", "Elem2"]} mods="" />

            <div block="Block" elem="Elem" mods={""} />
            <div block="Block" elem={"Elem"} mods={""} />
            <div block="Block" elem={["Elem0", "Elem1", "Elem2"]} mods={""} />

            <div block="Block" elem="Elem" mods={["", "", ""]} />

            <div block={"Block"} elem="Elem" mods="" />
            <div block={"Block"} elem="Elem" mods={""} />
            <div block={"Block"} elem="Elem" mods={["", "", ""]} />

            <div block={["Block0", "Block1", "Block2"]} elem="Elem" mods="" />
            <div block={["Block0", "Block1", "Block2"]} elem="Elem" mods={""} />
            <div block={["Block0", "Block1", "Block2"]} elem="Elem" mods={["", "", ""]} />

            <div block="" elem="Elem" mods="Mods" />
            <div block="" elem="Elem" mods={"Mods"} />
            <div block="" elem="Elem" mods={["Mods0", "Mods1", "Mods2"]} />

            <div block={""} elem="Elem" mods="Mods" />
            <div block={""} elem="Elem" mods={"Mods"} />
            <div block={""} elem="Elem" mods={["Mods0", "Mods1", "Mods2"]} />

            <div block={["", "", ""]} elem="Elem" mods="Mods" />
            <div block={["", "", ""]} elem="Elem" mods={"Mods"} />
            <div block={["", "", ""]} elem="Elem" mods={["Mods0", "Mods1", "Mods2"]} />
        </>
    );
}