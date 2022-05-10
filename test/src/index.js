import { useState } from 'react';

export default function App() {
    const [isTest, setIsTest] = useState(true);

    return (
        <>
            <div block="block-only" />
            <div block="block" elem="element" />
            <div block="block" elem="element" mods="string-modifier" />
            <div block="block" elem="element" mods={{ objectModifier: true, stringModifier: false }} />
            <div block="block" elem="element" mods={{ objectModifier: true, stringModifier: false, trueModifier: true, thruthyModifier: 'yes' }} />
            <div className="className-only" />
            <div className="className" block="block" elem="element" />
            <div className="className" block="block" elem="element" mods="string-modifier" />
            <div className="className" block="block" elem="element" mods={{ objectModifier: true, stringModifier: false, trueModifier: true, thruthyModifier: 'yes' }} />
            <div block="special-div" elem="test-element" mods={{ isTest }} onClick={() => { setIsTest(!isTest) }}>
                SPECIAL DIV WITH STATE ACTION
            </div>
            <div className="className" block="block" elem="element" mods={{ fullProperty: isTest === true }} />
            <div className="className" block="block" elem="element" mods={{ isTest }} />
            <div className="className" block="block" elem="element" mods="hello" />
        </>
    );
}