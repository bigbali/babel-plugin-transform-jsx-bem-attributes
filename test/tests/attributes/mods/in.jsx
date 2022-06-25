const Mods = () => {
    return (
        <>
            <div mods="Mods" />
            <div mods={"Mods"} />
            <div mods={["Mods0", "Mods1", "Mods2"]} />
            <div mods={{ mods0: true, mods1: true }} />
            <div mods={{ mods0: true, mods1: false }} />
            <div mods={{ mods0: false, mods1: false }} />
            <div mods="" />
            <div mods={""} />
            <div mods={["", "", ""]} />
        </>
    );
}