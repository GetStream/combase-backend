import schemaComposer from 'api/schema/composer';

import inputModifiers from './inputModifiers';
import modifiers from './modifiers';

const StreamActivityTC = schemaComposer.getOTC('StreamActivity');
const StreamAddActivityITC = schemaComposer.getITC('StreamAddActivityInput');

export const StreamActivity = [StreamActivityTC, modifiers];
export const StreamAddActivity = [StreamAddActivityITC, inputModifiers];
