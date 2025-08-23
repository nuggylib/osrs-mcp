import { CallToolResult } from "@modelcontextprotocol/sdk/types.js";

import { OSRSWikiAPIResult } from "../../types/osrsWiki.js";
import { makeOsrsWikiAPIQuery, SUPPORTED_VALUES_PROP_PARAM } from "../../utils/osrsWikiApiRequest.js";

export async function getFullDetailsForPage(
    /**
     * The page to fetch the details for
     */
    pageName: string
): Promise<CallToolResult> {
    if (!pageName || pageName.trim() === '') {
        throw new Error('pageName cannot be empty');
    }

    const response = await makeOsrsWikiAPIQuery({
        params: {
            titles: pageName.trim(),
            prop: SUPPORTED_VALUES_PROP_PARAM.REVISIONS,
        }
    })

    const pageResult: OSRSWikiAPIResult = response.data;
    const pageIdx = Object.keys(pageResult.query.pages).at(0) || ''

    return {
        content: [
            {
                type: 'text',
                text: JSON.stringify(pageResult.query.pages[pageIdx].revisions, null, 2)
            }
        ]
    };
}
