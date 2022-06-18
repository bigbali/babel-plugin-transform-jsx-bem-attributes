const BlockNoInheritanceShouldThrow = () => {
    const BlockInheritance = () => {
        const isTrue = true;

        return (
            <div block="Block">
                <div elem="Elem" />
                <div elem={["Elem0", "Elem1", "Elem2"]} />
                <div mods="Mods" />
                <div mods={["Mods0", "Mods1", "Mods2"]} />
                <div mods={{ mods0: true, mods1: true }} />
                <div mods={{ mods0: isTrue, isTrue }} />
                <div mods={{ mods0: undefined !== NaN }} />

                <div elem="Elem" mods={{ mods0: true, mods1: true }} />
                <div elem="Elem" mods={{ mods0: isTrue, isTrue }} />
                <div elem="Elem" mods={{ mods0: undefined !== NaN }} />

                <div elem={["Elem0", "Elem1", "Elem2"]} mods={{ mods0: true, mods1: true }} />
                <div elem={["Elem0", "Elem1", "Elem2"]} mods={{ mods0: isTrue, isTrue }} />
                <div elem={["Elem0", "Elem1", "Elem2"]} mods={{ mods0: undefined !== NaN }} />
                <div />

                <div block={["Block0", "Block1", "Block2"]}>
                    <div elem="Elem" />
                    <div elem={["Elem0", "Elem1", "Elem2"]} />
                    <div mods="Mods" />
                    <div mods={["Mods0", "Mods1", "Mods2"]} />
                    <div mods={{ mods0: true, mods1: true }} />
                    <div mods={{ mods0: isTrue, isTrue }} />
                    <div mods={{ mods0: undefined !== NaN }} />

                    <div elem="Elem" mods={{ mods0: true, mods1: true }} />
                    <div elem="Elem" mods={{ mods0: isTrue, isTrue }} />
                    <div elem="Elem" mods={{ mods0: undefined !== NaN }} />

                    <div elem={["Elem0", "Elem1", "Elem2"]} mods={{ mods0: true, mods1: true }} />
                    <div elem={["Elem0", "Elem1", "Elem2"]} mods={{ mods0: isTrue, isTrue }} />
                    <div elem={["Elem0", "Elem1", "Elem2"]} mods={{ mods0: undefined !== NaN }} />
                    <div />
                </div>
                <div block="SecondNestedBlock" elem="Elem" />
                <div block="ThirdNestedBlock" mods={{ thirdNestedBlockMod: true }} />
                <div />
            </div>
        );
    }
}