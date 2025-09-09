import axios from 'axios';
import { osrsApiBaseUrl } from './constants';
import { OSRSWikiAPIParseActionResult, OSRSWikiAPIQueryActionResult } from '../types/osrsWiki';

/**
 * Supported MediaWiki API actions for the OSRS Wiki
 * @see https://www.mediawiki.org/wiki/API:Main_page
 */
export enum SUPPORTED_API_ACTIONS {
    QUERY = 'query',
    PARSE = 'parse',
    OPENSEARCH = 'opensearch',
    EXPANDTEMPLATES = 'expandtemplates',
    HELP = 'help',
    PARAMINFO = 'paraminfo'
}

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
 * Factory method that creates a new OSRS Wiki API action function
 *
 * @param action The MediaWiki API action to use
 * @param defaultParams Default parameters to include with all requests for this action
 * @returns An async function that makes requests to the OSRS Wiki API with the specified action
 */
export const createOSRSWikiAPIAction = <T = any>(
	action: SUPPORTED_API_ACTIONS,
	defaultParams?: Record<string, string | number>,
) => {
	return async ({
		params,
	}: {
        params?: {
            [param: string]: string | number
        }
    }): Promise<axios.AxiosResponse<T, any>> => {
		try {
			const response = await axios.get<T>(
				osrsApiBaseUrl,
				{
					params: {
						action,
						format: 'json',
						...defaultParams,
						...params,
					},
					headers: {
						'User-Agent': 'osrs-mcp/1.0.0',
					},
				},
			);

			return response;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				console.error('API Error Details:', {
					status: error.response?.status,
					statusText: error.response?.statusText,
					data: error.response?.data,
					url: error.config?.url,
					params: error.config?.params,
				});
				throw new Error(`Failed to execute ${action} on Wiki: ${error.response?.status} ${error.response?.statusText} - ${error.message}`);
			}
			throw error;
		}
	};
};

/**
 * Pre-configured factory for creating query action functions
 * This is a convenience method that creates an API action function specifically for 'query' actions
 * with common default parameters
 */
export const createQueryAction = (defaultParams?: Record<string, string | number>) => {
	return createOSRSWikiAPIAction<OSRSWikiAPIQueryActionResult>(SUPPORTED_API_ACTIONS.QUERY, {
		rvprop: 'content',
		...defaultParams,
	});
};

export const createParseAction = (defaultParams?: Record<string, string | number>) => {
	return createOSRSWikiAPIAction<OSRSWikiAPIParseActionResult>(SUPPORTED_API_ACTIONS.PARSE, {
		prop: 'text|templates|links',
		disablelimitreport: 1,
		...defaultParams,
	});
};

export const createSearchAction = (defaultParams?: Record<string, string | number>) => {
	return createQueryAction({
		list: 'search',
		srnamespace: '0',
		srlimit: 50,
		...defaultParams,
	});
};
