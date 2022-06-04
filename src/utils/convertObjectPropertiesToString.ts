import { ObjectProperty, Identifier } from '@babel/types';
import { MODS_CONNECTOR } from '../constants';

export const convertObjectPropertiesToString = (mods: ObjectProperty[], blockElem: string): string => {
    let modsString = '';

    for (const modifier of mods) {
        const modifierName = (modifier.key as Identifier).name;

        if (modifierName) {
            modsString += `${blockElem}${MODS_CONNECTOR}${modifierName} `;
        }
    }

    return modsString;
};

export default convertObjectPropertiesToString;