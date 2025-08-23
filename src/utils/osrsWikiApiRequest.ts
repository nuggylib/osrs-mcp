import axios from 'axios';
import { osrsApiBaseUrl } from './constants';
import { OSRSWikiAPIResult } from '../types/osrsWiki';

/**
 * The list of valid values for the `prop` query parameter on the OSRS Wiki API "query" action
 */
export enum SUPPORTED_VALUES_PROP_PARAM {
    CATEGORIES = 'categories',
    INFO = 'info',
    REVISIONS = 'revisions',
    LINKS = 'links',
    IMAGES = 'images',
    TEMPLATES = 'templates',
    PAGEPROPS = 'pageprops',
    EXTRACTS = 'extracts',
    IMAGEINFO = 'imageinfo',
    LANGLINKS = 'langlinks',
    COORDINATES = 'coordinates',
    DESCRIPTION = 'description'
}

/**
 * The list of valid values for the `lists` query parameter on the OSRS Wiki API "query" action
 */
export enum SUPPORTED_VALUES_LISTS_PARAM {
    ALLPAGES = 'allpages',
    ALLCATEGORIES = 'allcategories',
    CATEGORYMEMBERS = 'categorymembers',
    SEARCH = 'search',
    RECENTCHANGES = 'recentchanges',
    BACKLINKS = 'backlinks',
    EMBEDDEDIN = 'embeddedin',
    ALLIMAGES = 'allimages',
    ALLUSERS = 'allusers',
    USERCONTRIBS = 'usercontribs',
    RANDOM = 'random',
    QUERYPAGE = 'querypage'
}

/**
 * The list of valid values for the `meta` query parameter on the OSRS Wiki API "query" action
 */
export enum SUPPORTED_VALUES_META_PARAM {
    SITEINFO = 'siteinfo',
    USERINFO = 'userinfo',
    TOKENS = 'tokens',
    ALLMESSAGES = 'allmessages',
    LANGUAGEINFO = 'languageinfo'
}

/**
 * Helper method to simplify making OSRS API requests using the "query" action.
 *
 * @returns The API response data; `axios.AxiosResponse<any, any>.data`
 * @see https://www.mediawiki.org/wiki/API:Query
 * @see https://runescape.wiki/w/Application_programming_interface
 */
export const makeOsrsWikiAPIQuery = async ({
	params,
}: {
    params?: {
        [param: string]: string | number
    }
}): Promise<axios.AxiosResponse<OSRSWikiAPIResult, any>> => {
	try {
		// This does not use the API endpoint; it's the search API that their site uses to find relevant results
		const response = await axios.get<OSRSWikiAPIResult>(
			osrsApiBaseUrl,
			{
				params: {
					action: 'query',
					rvprop: 'content',
					format: 'json',
					...params,
				},
				headers: {
					'User-Agent': 'osrs-mcp/1.0.0',
				},
			},
		);

		return response
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error('API Error Details:', {
				status: error.response?.status,
				statusText: error.response?.statusText,
				data: error.response?.data,
				url: error.config?.url,
				params: error.config?.params,
			});
			throw new Error(`Failed to search Wiki: ${error.response?.status} ${error.response?.statusText} - ${error.message}`);
		}
		throw error;
	}
}