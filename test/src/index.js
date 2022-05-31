import { useState } from 'react';

export const stringBlockOnly = () => {
    return (
        <div block="Block" />
    );
}

export const stringArrayBlockOnly = () => {
    return (
        <div block={['Block0', 'Block1', 'Block2']} />
    );
}

export const stringElemOnly = () => {
    return (
        <div elem="Elem" />
    );
}

export const stringArrayElemOnly = () => {
    return (
        <div elem={['Elem0', 'Elem1', 'Elem2']} />
    );
}

export const stringModsOnly = () => {
    return (
        <div mods="Mods" />
    );
}

export const stringArrayModsOnly = () => {
    return (
        <div mods={['Mods0', 'Mods1', 'Mods2']} />
    );
}

export const objectModsOnlyTrue = () => {
    return (
        <div mods={{ objectMod0: true, objectMod1: true, objectMod2: true }} />
    );
}

export const objectModsOnlyTrueAndFalse = () => {
    return (
        <div mods={{ objectMod0: true, objectMod1: false, objectMod2: true }} />
    );
}

export const objectModsOnlyFalse = () => {
    return (
        <div mods={{ objectMod0: false, objectMod1: false, objectMod2: false }} />
    );
}

export const stringClassNameOnly = () => {
    return (
        <div className="ClassName" />
    );
}

export const stringArrayClassNameOnly = () => {
    return (
        <div className={['ClassName0', 'ClassName1', 'ClassName2']} />
    );
}

// TODO repeat with array

export const stringBlockAndStringElem = () => {
    return (
        <div block="Block" elem="Elem" />
    );
}

export const stringBlockAndStringArrayElem = () => {
    return (
        <div block="Block" elem={['Elem0', 'Elem1', 'Elem2']} />
    );
}

export const stringBlockAndStringMods = () => {
    return (
        <div block="Block" mods="Mods" />
    );
}

export const stringBlockAndStringArrayMods = () => {
    return (
        <div block="Block" mods={['Mods0', 'Mods1', 'Mods2']} />
    );
}

export const stringBlockObjectModsTrue = () => {
    return (
        <div block="Block" mods={{ objectMod0: true, objectMod1: true, objectMod2: true }} />
    );
}

export const stringBlockObjectModsMixed = () => {
    return (
        <div block="Block" mods={{ objectMod0: true, objectMod1: false, objectMod2: true }} />
    );
}

export const stringBlockObjectModsFalse = () => {
    return (
        <div block="Block" mods={{ objectMod0: false, objectMod1: false, objectMod2: false }} />
    );
}

export const stringArrayBlockObjectModsTrue = () => {
    return (
        <div block={['Block0', 'Block1', 'Block2']} mods={{ objectMod0: true, objectMod1: true, objectMod2: true }} />
    );
}

export const stringArrayBlockObjectModsMixed = () => {
    return (
        <div block={['Block0', 'Block1', 'Block2']} mods={{ objectMod0: true, objectMod1: false, objectMod2: true }} />
    );
}

export const stringArrayBlockObjectModsFalse = () => {
    return (
        <div block={['Block0', 'Block1', 'Block2']} mods={{ objectMod0: false, objectMod1: false, objectMod2: false }} />
    );
}

export const stringBlockStringElemObjectModsTrue = () => {
    return (
        <div block="Block" elem="Elem" mods={{ objectMod0: true, objectMod1: true, objectMod2: true }} />
    );
}
export const stringBlockStringArrayElemObjectModsTrue = () => {
    return (
        <div block={["Block0", 'Block1', 'Block2']} elem="Elem" mods={{ objectMod0: true, objectMod1: true, objectMod2: true }} />
    );
}

export const stringBlockStringElemStringMods = () => {
    return (
        <div block="Block" elem="Elem" mods="Mods" />
    );
}


// export function AppWithBlockInheritance() {
//     const [blockInheritance, setBlockInheritance] = useState(true);

//     return (
//         <>
//             <main block="MainBlock">
//                 <span>
//                     <div elem="MainBlockElement" />
//                 </span>
//             </main>
//             <div block="DivBlock">
//                 <div elem="DivBlockElement" />
//                 <div block="no" elem="DivBlockElement" mods={{ DivBlockElementModifier: true, OtherDivBlockElementModifier: false }} />
//                 <div className="className" elem="DivBlockElement" mods="DivBlockElementStringModifier" />
//                 <div block="InnerDivBlock" elem="InnerDivBlockElement" mods={{ blockInheritance }}>
//                     INNER DIV BLOCK TEXT
//                     <button>
//                         <div elem="InnerDivBlockInButton">
//                             <span>
//                                 <a href="#ANCHOR" elem="InnerDivBlockInButtonInnerAnchor">
//                                     <div mods={{ Anchor: true, NotAnchor: false }} />
//                                     <div mods={['StringAnchor0', 'StringAnchor1']} />
//                                 </a>
//                             </span>
//                         </div>
//                     </button>
//                 </div>
//                 <div elem={['DivBlockElement0', 'DivBlockElement1', 'DivBlockElement2']}>
//                     DIV WITH ARRAY ELEM
//                 </div>
//                 <div elem={'DivBlockElementInExpressionContainer'}>
//                     DIV WITH EXPRESSION CONTAINER ELEM
//                 </div>
//             </div>
//             <footer block={['FooterBlock0', 'FooterBlock1', 'FooterBlock2']}>
//                 FOOTER WITH BLOCK ARRAY
//                 <div elem={['FooterBlockElem0', 'FooterBlockElem1', 'FooterBlockElem2']} />
//                 <span elem="FooterBlockElem" />
//             </footer>
//         </>
//     );
// }

// export function AppWithoutBlockInheritance() {
//     const [isTest, setIsTest] = useState(true);

//     return (
//         <>
//             <main block="mainblock">
//                 <span block="heyho-telapo">
//                     <div block="block0" elem="element" />
//                 </span>
//             </main>
//             <span block="spanthing">
//                 <div block="block1" elem="element" />
//                 <div block="block2" elem="element" mods="string-modifier" />
//                 <div block="block3" elem="element" mods={{ objectModifier: true, stringModifier: false }} />
//                 <div block="block4" elem="element" mods={{ objectModifier: true, stringModifier: false, trueModifier: true, thruthyModifier: 'yes' }} />
//                 <div className="className-only" />
//                 <div className="className" block="block5" elem="element" />
//                 <div className="className" block="block6" elem="element" mods="string-modifier" />
//                 <div className="className" block="block7" elem="element" mods={{ objectModifier: true, stringModifier: false, trueModifier: true, thruthyModifier: 'yes' }} />
//                 <div className="className" block="block8" elem="element" mods={{ fullProperty: isTest === true }} />
//                 <div className="className" block="block9" elem="element" mods={{ isTest }} />
//                 <div className="className" block="block10" elem="element" mods="hello" />
//                 <div block="special-div" elem="test-element" mods={{ isTest }} onClick={() => { setIsTest(!isTest) }}>
//                     SPECIAL DIV WITH STATE ACTION
//                     <button>
//                         <div block="buttondiv">
//                             <span>
//                                 hey
//                             </span>
//                         </div>
//                     </button>
//                 </div>
//                 <div>
//                     SPECIAL DIV WITHOUT PROPS
//                     {x()}
//                     {y()}
//                 </div>
//             </span>
//         </>
//     );
// }