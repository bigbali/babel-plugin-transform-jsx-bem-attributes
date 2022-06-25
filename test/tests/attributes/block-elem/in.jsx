const BlockElem = () => {
    return (
        <>
            <div block="Block" elem="Elem" />
            <div block="Block" elem={"Elem"} />
            <div block="Block" elem={["Elem0", "Elem1", "Elem2"]} />

            <div block={"Block"} elem="Elem" />
            <div block={"Block"} elem={"Elem"} />
            <div block={"Block"} elem={["Elem0", "Elem1", "Elem2"]} />

            <div block={["Block0", "Block1", "Block2"]} elem="Elem" />
            <div block={["Block0", "Block1", "Block2"]} elem={"Elem"} />
            <div block={["Block0", "Block1", "Block2"]} elem={["Elem0", "Elem1", "Elem2"]} />

            <div block="Block" elem="" />
            <div block="Block" elem={""} />
            <div block="Block" elem={["", "", ""]} />

            <div block={"Block"} elem="" />
            <div block={"Block"} elem={""} />
            <div block={"Block"} elem={["", "", ""]} />

            <div block={["Block0", "Block1", "Block2"]} elem="" />
            <div block={["Block0", "Block1", "Block2"]} elem={""} />
            <div block={["Block0", "Block1", "Block2"]} elem={["", "", ""]} />

            <div block="" elem="Elem" />
            <div block="" elem={"Elem"} />
            <div block="" elem={["Elem0", "Elem1", "Elem2"]} />

            <div block={""} elem="Elem" />
            <div block={""} elem={"Elem"} />
            <div block={""} elem={["Elem0", "Elem1", "Elem2"]} />

            <div block={["", "", ""]} elem="Elem" />
            <div block={["", "", ""]} elem={"Elem"} />
            <div block={["", "", ""]} elem={["Elem0", "Elem1", "Elem2"]} />
        </>
    );
}