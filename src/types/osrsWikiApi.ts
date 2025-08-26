/**
 * The list of known info keys that can be fetched for a page in the Wiki.
 *
 * All examples in documentation comments use the Wiki pages listed in this
 * doc comment.
 *
 * @see https://oldschool.runescape.wiki/w/Green_dragon
 */
export enum INFO_KEYS {
	/**
	 * For pages with tabbed info tables, this refers to the label used for
	 * tab 1. For example, on the "Green dragon" page, the value for this key
	 * is "Level 79", which is the default tab shown when the page is first loaded,
	 * which makes the table display the values for the level 79 green dragon.
	 */
	VERSION_1 = 'version1',
	/**
	 * For pages with tabbed info tables, this refers to the label used for
	 * tab 2. For example, on the "Green dragon" page, the value for this key
	 * is "Level 88". When this tab is active, it makes the table display the
	 * values for the level 88 green dragon.
	 */
	VERSION_2 = 'version2',
}

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
