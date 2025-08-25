import wiki from 'wikijs';
import { osrsApiBaseUrl } from './constants';
import type { WikiInstance } from '../types/wikijs';

const osrsWiki = wiki({
	apiUrl: osrsApiBaseUrl,
	origin: null,
	headers: {
		'User-Agent': 'osrs-mcp-server',
	},
}) as WikiInstance

export const searchWikiForTopicMatches = (topic: string, limit: number) => osrsWiki.search(topic, limit)
export const getPageForTopic = (topic: string) => osrsWiki.page(topic)
