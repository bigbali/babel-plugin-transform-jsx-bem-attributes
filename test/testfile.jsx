export const App = () => {
    function func() { };
    const obj = { a: 0, b: 1 };

    return (
        <div block="Block0" x={'no'}>
            <span elem="Elem" />
            <span elem={"Elem"} mods="Mods" />
            <span elem="Elem" mods={{ m1: true }} />
            <span elem="Elem" mods={{ m1: func() }} />
            <span elem={["E1", "E2"]} mods="Mods" />
            <div block="Block1" x={'yes'}>
                <span elem="Elem" />
                <span elem={"Elem"} mods="Mods" />
                <span elem="Elem" mods={{ m1: true }} />
                <span elem="Elem" mods={{ m1: func() }} />
                <span elem={["E1", "E2"]} mods="Mods" />
            </div >
            <div block={func()} x={'maybe'}>
                <span elem="Elem" />
                <span elem={"Elem"} mods="Mods" />
                <span elem="Elem" mods={{ m1: true }} />
                <span elem="Elem" mods={{ m1: func() }} />
                <span elem={["E1", "E2"]} mods="Mods" />
            </div >
            <div block={['B0', 'B1', 'B2']} x={'maybe'}>
                <span elem="Elem" />
                <span elem={"Elem"} mods="Mods" />
                <span elem="Elem" mods={{ m1: true }} />
                <span elem="Elem" mods={{ m1: func() }} />
                <span elem={["E1", "E2"]} mods="Mods" />
            </div >
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

const f = () => 'F';
const f1 = () => 'F1';
const f2 = () => 'F2';
const f3 = () => 'F3';
const o = {
    p0: 'P0',
    p1: 'P1',
    p2: 'P2'
};

export const BLOCK = () => {
    return (
        <main block="B">
            <span block="" />
            <span block={'B'} />
            <span block={`B`} />
            <span block={``} />
            <span block={`${f()}`} />
            <span block={`PRE${f()}`} />
            <span block={`${f()}POST`} />
            <span block={`PRE${f()}POST`} />
            <span block={f()} />
            <span block={p} />
            <span block={`PRE${p}POST`} />
            <span block={['B0', 'B1', 'B2']} />
            <span block={['B0', '', 'B2']} />
            <span block={['B0', 'B1', f()]} />
            <span block={['B0', f(), 'B2']} />
            <span block={[f(), 'B1', 'B2']} />
            <span block={['', f(), 'B2']} />
            <span block={['B1', f(), '']} />
            <span block={[f(), 'B1', '']} />
            <span block={['B0', 'B1', o]} />
            <span block={['B0', f(), o]} />
            <span block={[f1(), f2(), f3()]} />
            <span block={[`${f1()}`, f2(), f3()]} />
            <span block={[`${f1()}`, `${f2()}`, `${f3()}`]} />
        </main>
    );
}