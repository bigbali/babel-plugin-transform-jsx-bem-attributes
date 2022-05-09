import { useState } from 'react';

const isTrue = true;

export default function App() {
    const [isRetarded, setIsRetarded] = useState(true);

    return (
        <>
            {/* <div block="block-only" />
            <div block="block" elem="element" />
            <div block="block" elem="element" mods="string-modifier" />
            <div block="block" elem="element" mods={{ objectModifier: true, stringModifier: false }} />
            <div block="block" elem="element" mods={{ objectModifier: true, stringModifier: false, trueModifier: true, thruthyModifier: 'yes' }} />
            <div className="className-only" />
            <div className="className" block="block" elem="element" />
            <div className="className" block="block" elem="element" mods="string-modifier" />
            <div className="className" block="block" elem="element" mods={{ objectModifier: true, stringModifier: false, trueModifier: true, thruthyModifier: 'yes' }} />
            <div block="special-div" elem="retarded-element" mods={{ isRetarded }} onClick={() => { setIsRetarded(!isRetarded) }}>
                SPECIAL DIV WITH STATE
            </div>
            <div test={`pancakes ${isTrue ? "aretrue" : "falseyes"}`}>
                TEST
            </div> */}
            <div className="className" block="block" elem="element" mods={{ fullProperty: isRetarded === true }} />
            <div className="className" block="block" elem="element" mods={{ isRetarded }} />
            <div className="className" block="block" elem="element" mods="hello" />
        </>
    );
}