const BlockInheritance = () => {
    const isTrue = true;

    return (
        <div className="Block">
            <div className="Block-Elem" />
            <div className="Block Block-Elem0 Block-Elem1 Block-Elem2" />
            <div className="Block Block_Mods" />
            <div className="Block Block_Mods0 Block_Mods1 Block_Mods2" />
            <div className="Block Block_mods0 Block_mods1" />
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
