export const App = () => {
    function func() { };
    const obj = { a: 0, b: 1 };

    return (
        <div block="Block">
            <span elem="Elem" />
            <span elem={"Elem"} mods="Mods" />
            <span elem="Elem" mods={{ m1: true }} />
            <span elem="Elem" mods={{ m1: func() }} />
            <span elem={["E1", "E2"]} mods="Mods" />
        </div >
    );
}