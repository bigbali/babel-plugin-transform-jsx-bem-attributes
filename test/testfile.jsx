export const App = () => {
    function func() { };
    const obj = { a: 0, b: 1 };

    return (
        <div block="Block" x={'no'}>
            <span elem="Elem" />
            <span elem={"Elem"} mods="Mods" />
            <span elem="Elem" mods={{ m1: true }} />
            <span elem="Elem" mods={{ m1: func() }} />
            <span elem={["E1", "E2"]} mods="Mods" />
        </div >
    );
}

export const className = () => {
    return (
        <div className="0ClassName">
            <div className="1ClassName" />
            <div className={['2ClassName0', '2ClassName1']} />
            <div className={['3ClassName0', '']} />
            <div className={['4ClassName0', null]} />
            <div className={['', '']} />
            <div className={['', '6ClassName1']} />
            <div className={[]} />
            <div className={func()} />
            <div className={`${func()}`} />
            <div className={`PRE ${func()} POST`} />
            <div className={[func(), obj]} />
            <div className={`PRE ${func()}${obj} POST`} />
        </div>
    );
}