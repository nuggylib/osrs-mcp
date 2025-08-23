import wiki from 'wikijs';
import { osrsApiBaseUrl } from './constants';
import type { WikiInstance } from '../types/wikijs';

const osrsWiki = wiki({
	apiUrl: osrsApiBaseUrl,
	origin: null,
}) as WikiInstance

export const searchForTopic = (topic: string, limit: number) => osrsWiki.search(topic, limit)
