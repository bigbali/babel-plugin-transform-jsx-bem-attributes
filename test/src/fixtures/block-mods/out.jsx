const BlockElem = () => {
  const isTrue = true;
  const isFalse = false;
  return <>
            <div className="Block Block_Mods" />
            <div className="Block Block_Mods" />
            <div className="Block Block_Mods0 Block_Mods1 Block_Mods2" />
            <div className={`Block ${{
      mods0: true
    } ? "Block_mods0" : ""}${{
      mods1: true
    } ? "Block_mods1" : ""}`} />
            <div className={`Block ${{
      mods0: true
    } ? "Block_mods0" : ""}${{
      mods1: false
    } ? "Block_mods1" : ""}`} />
            <div className={`Block ${{
      mods0: false
    } ? "Block_mods0" : ""}${{
      mods1: false
    } ? "Block_mods1" : ""}`} />
            <div className={`Block ${{
      isTrue
    } ? "Block_isTrue" : ""}${{
      isTrue: isTrue
    } ? "Block_isTrue" : ""}`} />
            <div className={`Block ${{
      isFalse
    } ? "Block_isFalse" : ""}${{
      isFalse: isFalse
    } ? "Block_isFalse" : ""}`} />

            <div className="Block Block_Mods" />
            <div className="Block Block_Mods" />
            <div className="Block Block_Mods0 Block_Mods1 Block_Mods2" />
            <div className={`Block ${{
      mods0: true
    } ? "Block_mods0" : ""}${{
      mods1: true
    } ? "Block_mods1" : ""}`} />
            <div className={`Block ${{
      mods0: true
    } ? "Block_mods0" : ""}${{
      mods1: false
    } ? "Block_mods1" : ""}`} />
            <div className={`Block ${{
      mods0: false
    } ? "Block_mods0" : ""}${{
      mods1: false
    } ? "Block_mods1" : ""}`} />
            <div className={`Block ${{
      isTrue
    } ? "Block_isTrue" : ""}${{
      isTrue: isTrue
    } ? "Block_isTrue" : ""}`} />
            <div className={`Block ${{
      isFalse
    } ? "Block_isFalse" : ""}${{
      isFalse: isFalse
    } ? "Block_isFalse" : ""}`} />

            <div className="Block0 Block1 Block2 Block0_Mods Block1_Mods Block2_Mods" />
            <div className="Block0 Block1 Block2 Block0_Mods Block1_Mods Block2_Mods" />
            <div className="Block0 Block1 Block2 Block0_Mods0 Block0_Mods1 Block0_Mods2 Block1_Mods0 Block1_Mods1 Block1_Mods2 Block2_Mods0 Block2_Mods1 Block2_Mods2" />
            <div className={`Block0 Block1 Block2 ${{
      mods0: true
    } ? "Block0_mods0" : ""}${{
      mods1: true
    } ? "Block0_mods1" : ""}`} />
            <div className={`Block0 Block1 Block2 ${{
      mods0: true
    } ? "Block0_mods0" : ""}${{
      mods1: false
    } ? "Block0_mods1" : ""}`} />
            <div className={`Block0 Block1 Block2 ${{
      mods0: false
    } ? "Block0_mods0" : ""}${{
      mods1: false
    } ? "Block0_mods1" : ""}`} />
            <div className={`Block0 Block1 Block2 ${{
      isTrue
    } ? "Block0_isTrue" : ""}${{
      isTrue: isTrue
    } ? "Block0_isTrue" : ""}`} />
            <div className={`Block0 Block1 Block2 ${{
      isFalse
    } ? "Block0_isFalse" : ""}${{
      isFalse: isFalse
    } ? "Block0_isFalse" : ""}`} />

            <div className="Block" />
            <div className="Block" />
            <div className="Block Block_ Block_ Block_" />

            <div className="Block" />
            <div className="Block" />
            <div className="Block Block_ Block_ Block_" />

            <div className="Block0 Block1 Block2" />
            <div className="Block0 Block1 Block2" />
            <div className="Block0 Block1 Block2 Block0_ Block0_ Block0_ Block1_ Block1_ Block1_ Block2_ Block2_ Block2_" />

            <div />
            <div />
            <div />

            <div />
            <div />
            <div />

            <div />
            <div />
            <div />
        </>;
};