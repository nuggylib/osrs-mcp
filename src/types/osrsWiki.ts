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
export enum SUPPORTED_VALUES_QUERY_PROP_PARAM {
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
 * The valid values for the `prop` query parameter on the OSRS Wiki API "parse" action
 */
export type ValidParseProp = 'categories' | 'links' | 'externallinks' | 'images' | 'templates' | 'langlinks' | 'text' | 'sections'

/**
 * The list of valid values for the `lists` query parameter on the OSRS Wiki API "query" action
 */
export enum SUPPORTED_VALUES_QUERY_LISTS_PARAM {
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
export enum SUPPORTED_VALUES_QUERY_META_PARAM {
	SITEINFO = 'siteinfo',
	USERINFO = 'userinfo',
	TOKENS = 'tokens',
	ALLMESSAGES = 'allmessages',
	LANGUAGEINFO = 'languageinfo'
}

export type BaseOSRSWikiFieldType = {
	'*': string
}

export type OSRSWikiLangLink = BaseOSRSWikiFieldType & {
	lang: string
	url: string
	langname: string
	autonym: string
}

export type OSRSWikiCategory = BaseOSRSWikiFieldType & {
	sortkey: string
	hidden?: string
}

export type OSRSWikiLinkOrTemplate = BaseOSRSWikiFieldType & {
	ns: number
    exists?: string
}

/**
 * The shape of the data you get when using the `action=parse` Action of the OSRS
 * Wiki API.
 */
export type OSRSWikiAPIParseActionResult = {
    parse: {
        title: string
        pageid: number
        revid: number
		/**
		 * Populated when 'text' is included in the `prop=` argument.
		 */
        text?: BaseOSRSWikiFieldType
		/**
		 * Populated when 'langlink' is included in the `prop=` argument.
		 */
        langlinks?: OSRSWikiLangLink[]
		/**
		 * Populated when 'categories' is included in the `prop=` argument.
		 */
        categories?: OSRSWikiCategory[]
		/**
		 * Populated when 'links' is included in the `prop=` argument.
		 */
        links?: OSRSWikiLinkOrTemplate[]
		/**
		 * Populated when 'templates' is included in the `prop=` argument.
		 */
        templates?: OSRSWikiLinkOrTemplate[]
		/**
		 * Populated when 'images' is included in the `prop=` argument.
		 */
        images?: string[]
		/**
		 * Populated when 'externallinks' is included in the `prop=` argument.
		 */
        externallinks?: string[]
		/**
		 * Populated when 'sections' is included in the `prop=` argument.
		 */
        sections?: {
            toclevel: number
            level: string
            line: string
            number: string
            index: string
            fromtitle: string
            byteoffset: number
            anchor: string
        }[]
		/**
		 * Only populated if there were errors when running a parse Action. It is possible
		 * for an error to occur for one prop, but not on others.
		 */
        parsewarnings?: string[]
        displaytitle?: string
        iwlinks?: {
            prefix: string
            url: string
            '*': string
        }[]
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
