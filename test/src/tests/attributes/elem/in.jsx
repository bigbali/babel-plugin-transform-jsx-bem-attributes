const Elem = () => {
    return (
        <>
            <div elem="Elem" />
            <div elem={"Elem"} />
            <div elem={["Elem0", "Elem1", "Elem2"]} />
            <div elem="" />
            <div elem={""} />
            <div elem={["", "", ""]} />
        </>
    );
}