const Block = () => {
    return (
        <>
            <div block="Block" />
            <div block={"Block"} />
            <div block={["Block0", "Block1", "Block2"]} />
            <div block="" />
            <div block={""} />
            <div block={["", "", ""]} />
        </>
    );
}