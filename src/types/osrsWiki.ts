export type OSRSWikiAPIQueryActionResult = {
    batchcomplete: string
    warnings?: {
        extracts: {
            [key: string]: string
        }
    }
    query: {
        // Contains the normalized page name
        normalized?: {
            [key: number]: {
                from: string
                to: string
            }
        }
        pages: {
            [pageKey: string]: {
                /**
                 * The unique identifier for the page; identical to pageKey
                 */
                pageid: string
                /**
                 * TODO: Document this
                 */
                ns: number
                /**
                 * The title of the page
                 */
                title: string
                /**
                 * HTML containing the summary of the page content.
                 *
                 * Populated when the Wiki API is queried for the "extracts" (e.g., `&prop=extracts` parameter)
                 */
                extract?: string
                /**
                 * WikiText content for the full page.
                 *
                 * Populated when the Wiki API is queried for the "revisions" (e.g., `&prop=revisions` parameter)
                 */
                revisions?: {
                    [key: number]: {
                        contentformat: string
                        contentmodel: string
                        // This is the FULL content for the Wiki page - the strings can be long.
                        // - Links are formatted using [[Page Name]]
                        // - TODO: Find out what {{Thing}} links are (seems to have something to do with tables)
                        '*': string
                    }
                }
            }
        }
    }
}

export type OSRSWikiAPIOpenSearchActionResult = [
  searchTerm: string,
  titles: string[],
  // Often just empty strings; many wikis (including the OSRS Wiki) disable descriptions in OpenSearch results for performance reasons
  description: string[],
  urls: string[]
];
