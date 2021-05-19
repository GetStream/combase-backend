import 'dotenv/config';
import { MeiliSearch } from 'meilisearch';

export const meilisearch = new MeiliSearch({ host: process.env.MEILI_HOST });
