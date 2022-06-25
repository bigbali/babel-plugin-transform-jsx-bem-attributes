const BlockClassName = () => {
    return (
        <>
            <div block="Block" className="ClassName" />
            <div block="Block" className={"ClassName"} />
            <div block="Block" className={["ClassName0", "ClassName1", "ClassName2"]} />

            <div block={"Block"} className="ClassName" />
            <div block={"Block"} className={"ClassName"} />
            <div block={"Block"} className={["ClassName0", "ClassName1", "ClassName2"]} />

            <div block={["Block0", "Block1", "Block2"]} className="ClassName" />
            <div block={["Block0", "Block1", "Block2"]} className={"ClassName"} />
            <div block={["Block0", "Block1", "Block2"]} className={["ClassName0", "ClassName1", "ClassName2"]} />

            <div block="Block" className="" />
            <div block="Block" className={""} />
            <div block="Block" className={["", "", ""]} />

            <div block={"Block"} className="" />
            <div block={"Block"} className={""} />
            <div block={"Block"} className={["", "", ""]} />

            <div block={["Block0", "Block1", "Block2"]} className="" />
            <div block={["Block0", "Block1", "Block2"]} className={""} />
            <div block={["Block0", "Block1", "Block2"]} className={["", "", ""]} />

            <div block="" className="ClassName" />
            <div block="" className={"ClassName"} />
            <div block="" className={["ClassName0", "ClassName1", "ClassName2"]} />

            <div block={""} className="ClassName" />
            <div block={""} className={"ClassName"} />
            <div block={""} className={["ClassName0", "ClassName1", "ClassName2"]} />

            <div block={["", "", ""]} className="ClassName" />
            <div block={["", "", ""]} className={"ClassName"} />
            <div block={["", "", ""]} className={["ClassName0", "ClassName1", "ClassName2"]} />
        </>
    );
}