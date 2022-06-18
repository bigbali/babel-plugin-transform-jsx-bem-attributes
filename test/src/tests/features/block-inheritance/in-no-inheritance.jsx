const BlockInheritance = () => {
    const isTrue = true;

    return (
        <div block="Block">
            <div block="Block" elem="Elem" />
            <div block="Block" elem={["Elem0", "Elem1", "Elem2"]} />
            <div block="Block" mods="Mods" />
            <div block="Block" mods={["Mods0", "Mods1", "Mods2"]} />
            <div block="Block" mods={{ mods0: true, mods1: true }} />
            <div block="Block" mods={{ mods0: isTrue, isTrue }} />
            <div block="Block" mods={{ mods0: undefined !== NaN }} />

            <div block="Block" elem="Elem" mods={{ mods0: true, mods1: true }} />
            <div block="Block" elem="Elem" mods={{ mods0: isTrue, isTrue }} />
            <div block="Block" elem="Elem" mods={{ mods0: undefined !== NaN }} />

            <div block="Block" elem={["Elem0", "Elem1", "Elem2"]} mods={{ mods0: true, mods1: true }} />
            <div block="Block" elem={["Elem0", "Elem1", "Elem2"]} mods={{ mods0: isTrue, isTrue }} />
            <div block="Block" elem={["Elem0", "Elem1", "Elem2"]} mods={{ mods0: undefined !== NaN }} />
            <div />

            <div block={["Block0", "Block1", "Block2"]}>
                <div block={["Block0", "Block1", "Block2"]} elem="Elem" />
                <div block={["Block0", "Block1", "Block2"]} elem={["Elem0", "Elem1", "Elem2"]} />
                <div block={["Block0", "Block1", "Block2"]} mods="Mods" />
                <div block={["Block0", "Block1", "Block2"]} mods={["Mods0", "Mods1", "Mods2"]} />
                <div block={["Block0", "Block1", "Block2"]} mods={{ mods0: true, mods1: true }} />
                <div block={["Block0", "Block1", "Block2"]} mods={{ mods0: isTrue, isTrue }} />
                <div block={["Block0", "Block1", "Block2"]} mods={{ mods0: undefined !== NaN }} />

                <div block={["Block0", "Block1", "Block2"]} elem="Elem" mods={{ mods0: true, mods1: true }} />
                <div block={["Block0", "Block1", "Block2"]} elem="Elem" mods={{ mods0: isTrue, isTrue }} />
                <div block={["Block0", "Block1", "Block2"]} elem="Elem" mods={{ mods0: undefined !== NaN }} />

                <div block={["Block0", "Block1", "Block2"]} elem={["Elem0", "Elem1", "Elem2"]} mods={{ mods0: true, mods1: true }} />
                <div block={["Block0", "Block1", "Block2"]} elem={["Elem0", "Elem1", "Elem2"]} mods={{ mods0: isTrue, isTrue }} />
                <div block={["Block0", "Block1", "Block2"]} elem={["Elem0", "Elem1", "Elem2"]} mods={{ mods0: undefined !== NaN }} />
                <div />
            </div>
            <div block="SecondNestedBlock" elem="Elem" />
            <div block="ThirdNestedBlock" mods={{ thirdNestedBlockMod: true }} />
            <div />
        </div>
    );
}
