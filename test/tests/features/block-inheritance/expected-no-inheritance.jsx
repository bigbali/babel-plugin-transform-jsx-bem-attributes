const BlockNoInheritance = () => {
    const isTrue = true;

    return (
        <div className="Block">
            <div className="Block-Elem" />
            <div className="Block-Elem0 Block-Elem1 Block-Elem2" />
            <div />
            <div />
            <div />
            <div />
            <div />

            <div className="Block-Elem Block-Elem_mods0 Block-Elem_mods1" />
            <div className={`Block-Elem ${isTrue ? "Block-Elem_mods0" : ""}${isTrue ? "Block-Elem_isTrue" : ""}`} />
            <div className={`Block-Elem ${undefined !== NaN ? "Block-Elem_mods0" : ""}`} />

            <div className="Block-Elem0 Block-Elem1 Block-Elem2 Block-Elem0_mods0 Block-Elem1_mods0 Block-Elem2_mods0 Block-Elem0_mods1 Block-Elem1_mods1 Block-Elem2_mods1" />
            <div className={`Block-Elem0 Block-Elem1 Block-Elem2 ${isTrue ? "Block-Elem0_mods0 Block-Elem1_mods0 Block-Elem2_mods0" : ""}${isTrue ? "Block-Elem0_isTrue Block-Elem1_isTrue Block-Elem2_isTrue" : ""}`} />
            <div className={`Block-Elem0 Block-Elem1 Block-Elem2 ${undefined !== NaN ? "Block-Elem0_mods0 Block-Elem1_mods0 Block-Elem2_mods0" : ""}`} />
            <div />

            <div className="Block0 Block1 Block2">
                <div className="Block0-Elem Block1-Elem Block2-Elem" />
                <div className="Block0-Elem0 Block0-Elem1 Block0-Elem2 Block1-Elem0 Block1-Elem1 Block1-Elem2 Block2-Elem0 Block2-Elem1 Block2-Elem2" />
                <div />
                <div />
                <div />
                <div />
                <div />

                <div className="Block0-Elem Block1-Elem Block2-Elem Block0-Elem_mods0 Block1-Elem_mods0 Block2-Elem_mods0 Block0-Elem_mods1 Block1-Elem_mods1 Block2-Elem_mods1" />
                <div className={`Block0-Elem Block1-Elem Block2-Elem ${isTrue ? "Block0-Elem_mods0 Block1-Elem_mods0 Block2-Elem_mods0" : ""}${isTrue ? "Block0-Elem_isTrue Block1-Elem_isTrue Block2-Elem_isTrue" : ""}`} />
                <div className={`Block0-Elem Block1-Elem Block2-Elem ${undefined !== NaN ? "Block0-Elem_mods0 Block1-Elem_mods0 Block2-Elem_mods0" : ""}`} />

                <div className="Block0-Elem0 Block0-Elem1 Block0-Elem2 Block1-Elem0 Block1-Elem1 Block1-Elem2 Block2-Elem0 Block2-Elem1 Block2-Elem2 Block0-Elem0_mods0 Block0-Elem1_mods0 Block0-Elem2_mods0 Block1-Elem0_mods0 Block1-Elem1_mods0 Block1-Elem2_mods0 Block2-Elem0_mods0 Block2-Elem1_mods0 Block2-Elem2_mods0 Block0-Elem0_mods1 Block0-Elem1_mods1 Block0-Elem2_mods1 Block1-Elem0_mods1 Block1-Elem1_mods1 Block1-Elem2_mods1 Block2-Elem0_mods1 Block2-Elem1_mods1 Block2-Elem2_mods1" />
                <div className={`Block2 Block0-Elem0 Block0-Elem1 Block0-Elem2 Block1-Elem0 Block1-Elem1 Block1-Elem2 Block2-Elem0 Block2-Elem1 Block2-Elem2 ${isTrue ? "Block0-Elem0_mods0 Block0-Elem1_mods0 Block0-Elem2_mods0 Block1-Elem0_mods0 Block1-Elem1_mods0 Block1-Elem2_mods0 Block2-Elem0_mods0 Block2-Elem1_mods0 Block2-Elem2_mods0" : ""}${isTrue ? "Block0-Elem0_isTrue Block0-Elem1_isTrue Block0-Elem2_isTrue Block1-Elem0_isTrue Block1-Elem1_isTrue Block1-Elem2_isTrue Block2-Elem0_isTrue Block2-Elem1_isTrue Block2-Elem2_isTrue" : ""}`} />
                <div className={`Block0-Elem0 Block0-Elem1 Block0-Elem2 Block1-Elem0 Block1-Elem1 Block1-Elem2 Block2-Elem0 Block2-Elem1 Block2-Elem2 ${undefined !== NaN ? "Block0-Elem0_mods0 Block0-Elem1_mods0 Block0-Elem2_mods0 Block1-Elem0_mods0 Block1-Elem1_mods0 Block1-Elem2_mods0 Block2-Elem0_mods0 Block2-Elem1_mods0 Block2-Elem2_mods0" : ""}`} />
                <div />
            </div>
            <div className="SecondNestedBlock SecondNestedBlock-Elem" />
            <div className="ThirdNestedBlock ThirdNestedBlock_thirdNestedBlockMod" />
            <div />
        </div>
    );
};