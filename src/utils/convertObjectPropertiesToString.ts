import { ObjectProperty, Identifier } from '@babel/types';

const convertObjectPropertiesToString = (mods: ObjectProperty[]): string => {
    let modsString = '';

    for (const modifier of mods) {
        const modifierName = (modifier.key as Identifier).name;

        if (modifierName) {
            modsString += `${modifierName} `;
        }
    }

    return modsString;
};