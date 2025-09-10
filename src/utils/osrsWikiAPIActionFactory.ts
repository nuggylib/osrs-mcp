import axios from 'axios';
import { osrsApiBaseUrl } from './constants';
import { OSRSWikiAPIParseActionResult, OSRSWikiAPIQueryActionResult, SUPPORTED_API_ACTIONS, ValidParseProp } from '../types/osrsWiki';

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
	format?: 'json' | 'xml',
) => {
	if (!format) {format = 'json'}
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
						format,
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

/**
 * Pre-configured factory for creating parse action functions
 * @param props The list of fields to parse.
 */
export const createParseAction = (props: ValidParseProp[], defaultParams?: Record<string, string | number>) => {
	return createOSRSWikiAPIAction<OSRSWikiAPIParseActionResult>(SUPPORTED_API_ACTIONS.PARSE, {
		prop: props.join('|'),
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
