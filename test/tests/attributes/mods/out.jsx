/*
    This file is generated automatically.
    All your edits will be lost upon regeneration.
*/

const object = {
  p1: true,
  p2: false
};
const otherobject = {
  p1: "op1",
  p2: "op2"
};

const func = () => true;

<div className="Block">
    <div />
    <div className="Block-Elem Block-Elem_Mods" />
    <div className="Block-Elem" />
    <div className="Block-Elem Block-Elem_p1 Block-Elem_p2" />
    <div className="Block-Elem Block-Elem_p1" />
    <div className={`Block-Elem ${func() ? "Block-Elem_p1" : ""}`} />
    <div className={`Block-Elem ${object !== func ? "Block-Elem_p1" : ""}`} />
    <div className="Block-Elem Block-Elem_" /> {
    /* undefined */
  }
    <div className={`Block-Elem ${func() ? "Block-Elem_" : ""}`} /> {
    /* undefined */
  }
    <div className="Block-Elem Block-Elem_" />
    <div className={`Block-Elem ${func() ? "Block-Elem_" : ""}`} />
    <div className="Block-Elem Block-Elem_cp1" />
    <div className={`Block-Elem ${func() ? "Block-Elem_cp1" : ""}`} />
    <div className="Block-Elem" />
    <p className={`Block-Message ${true !== false ? "Block-Message_hello" : ""}`}>
        {otherobject.p2}
    </p>
</div>;