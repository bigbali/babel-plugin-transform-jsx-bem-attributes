const CustomConnectors = () => {
    const isTrue = true;

    return <>
        <div className="Block Block[ELEM]Elem" />
        <div className="Block Block[ELEM]Elem" />
        <div className="Block Block[ELEM]Elem0 Block[ELEM]Elem1 Block[ELEM]Elem2" />

        <div className="Block0 Block1 Block2 Block0[ELEM]Elem Block1[ELEM]Elem Block2[ELEM]Elem" />
        <div className="Block0 Block1 Block2 Block0[ELEM]Elem Block1[ELEM]Elem Block2[ELEM]Elem" />
        <div className="Block0 Block1 Block2 Block0[ELEM]Elem0 Block0[ELEM]Elem1 Block0[ELEM]Elem2 Block1[ELEM]Elem0 Block1[ELEM]Elem1 Block1[ELEM]Elem2 Block2[ELEM]Elem0 Block2[ELEM]Elem1 Block2[ELEM]Elem2" />

        <div className="Block Block[ELEM]Elem Block[ELEM]Elem[MODS]Mods" />
        <div className="Block Block[ELEM]Elem Block[ELEM]Elem[MODS]Mods" />
        <div className="Block Block[ELEM]Elem Block[ELEM]Elem[MODS]Mods0 Block[ELEM]Elem[MODS]Mods1 Block[ELEM]Elem[MODS]Mods2" />
        <div className="Block Block[ELEM]Elem Block[ELEM]Elem[MODS]mods0 Block[ELEM]Elem[MODS]mods1" />
        <div className="Block Block[ELEM]Elem Block[ELEM]Elem[MODS]mods0" />
        <div className="Block Block[ELEM]Elem" />
        <div className={`Block Block[ELEM]Elem ${isTrue ? "Block[ELEM]Elem[MODS]isTrue" : ""}${isTrue ? "Block[ELEM]Elem[MODS]isTrue" : ""}`} />
        <div className={`Block Block[ELEM]Elem ${true === true ? "Block[ELEM]Elem[MODS]trueExpression" : ""}${true === false ? "Block[ELEM]Elem[MODS]falseExpression" : ""}`} />

        <div className="Block Block[MODS]Mods" />
        <div className="Block Block[MODS]Mods" />
        <div className="Block Block[MODS]Mods0 Block[MODS]Mods1 Block[MODS]Mods2" />
        <div className="Block Block[MODS]mods0 Block[MODS]mods1" />
        <div className="Block Block[MODS]mods0" />
        <div className="Block" />
        <div className={`Block ${isTrue ? "Block[MODS]isTrue" : ""}${isTrue ? "Block[MODS]isTrue" : ""}`} />
        <div className={`Block ${true === true ? "Block[MODS]trueExpression" : ""}${true === false ? "Block[MODS]falseExpression" : ""}`} />

        <div className="Block Block[ELEM]Elem" />
        <div className="Block Block[ELEM]Elem" />
        <div className="Block Block[ELEM]Elem0 Block[ELEM]Elem1 Block[ELEM]Elem2" />
    </>;
};