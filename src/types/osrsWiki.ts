export type OSRSWikiAPIParseActionResult = {
    parse: {
        title: string
        pageid: number
        revid: number
        text: {
            '*': string  // Rendered HTML content
        }
        langlinks?: Array<{
            lang: string
            url: string
            langname: string
            autonym: string
            '*': string
        }>
        categories?: Array<{
            sortkey: string
            '*': string  // Category name
            hidden?: string
        }>
        links?: Array<{
            ns: number
            exists?: string
            '*': string  // Page title
        }>
        templates?: Array<{
            ns: number
            exists?: string
            '*': string  // Template name
        }>
        images?: string[]
        externallinks?: string[]
        sections?: Array<{
            toclevel: number
            level: string
            line: string
            number: string
            index: string
            fromtitle: string
            byteoffset: number
            anchor: string
        }>
        parsewarnings?: string[]
        displaytitle?: string
        iwlinks?: Array<{
            prefix: string
            url: string
            '*': string
        }>
        properties?: {
            [key: string]: string
        }
    }
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
