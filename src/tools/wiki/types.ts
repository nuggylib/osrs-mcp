// Example query: https://runescape.wiki/api.php?action=query&titles=Green%20dragon&prop=extracts&format=json
export type OSRSWikiAPIResult = {
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
                 */
                extract?: string
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
