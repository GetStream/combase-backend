import integrationModifiers from './modifiers/integration';
import integrationDefModifiers from './modifiers/integrationDefinition';

import { IntegrationTC, IntegrationDefinitionTC } from './model';

export const Integration = [IntegrationTC, integrationModifiers];
export const IntegrationDefinition = [IntegrationDefinitionTC, integrationDefModifiers];
