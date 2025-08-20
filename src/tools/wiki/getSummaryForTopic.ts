import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import axios from 'axios';
import { PageResult } from './types.js';
import { osrsApiBaseUrl } from '../../utils/constants.js';

export async function getSummaryForPage(
    /**
     * The page to fetch a summary for
     */
    pageName: string
): Promise<CallToolResult> {
    if (!pageName || pageName.trim() === '') {
        throw new Error('pageName cannot be empty');
    }

    try {
        const response = await axios.get<PageResult>(
            osrsApiBaseUrl,
            {
                params: {
                    action: 'query',
                    titles: pageName.trim(),
                    prop: 'extracts',
                    format: 'json'
                },
                headers: {
                    'User-Agent': 'osrs-mcp/1.0.0'
                }
            }
        );

        const pageResult: PageResult = response.data;
        const pageIdx = Object.keys(pageResult.query.pages).at(0) || ''

        return {
            content: [
                {
                    type: 'text',
                    text: JSON.stringify(pageResult.query.pages[pageIdx].extract, null, 2)
                }
            ]
        };
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("API Error Details:", {
                status: error.response?.status,
                statusText: error.response?.statusText,
                data: error.response?.data,
                url: error.config?.url,
                params: error.config?.params
            });
            throw new Error(`Failed to fetch summary from Wiki: ${error.response?.status} ${error.response?.statusText} - ${error.message}`);
        }
        throw error;
    }
}
