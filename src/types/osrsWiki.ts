import { ParsedTemplate } from './wikimedia'

/**
 * The list of possible template titles on quest page parsetree XML documents.
 *
 * To obtain full documentation on a template, you can query this endpoint:
 * - https://oldschool.runescape.wiki/api.php?action=parse&page=Template:[TEMPLATE_NAME]/doc&format=xml
 */
export enum SUPPORTED_PARSETREE_TEMPLATE_TITLE {
	/**
	 * The External template adds links to the RuneScape Wiki, RuneScape: Dragonwilds Wiki,
	 * RuneScape Classic Wiki, Meta RuneScape Wiki, and Wikipedia beside the "Discussion"
	 * tab above an article's title. The links are not added to the mobile skin.
	 */
	EXTERNAL = 'External',
	/**
	 * The 'Has quick guide' template notifies the user that there is a quick guide page
	 * for a quest, and links them to it.
	 */
	HAS_QUICK_GUIDE = 'Has quick guide',
	/**
	 * This template surfaces the following details:
	 * - "start" - Quest start location.
	 * - "startmap" - TBD
	 * - "difficulty" - Official difficulty as-given by Jagex.
	 * - "length" - Length of the quest.
	 * - "requirements" - The list of required skills (and whether or not they are boosting will satisfy the requirement).
	 * - "items" - The list of required items.
	 * - "recommended" - All recommended items or information.
	 * - "kills" - Enemies to defeat.
	 * - "ironman" - Ironman concerns.
	 */
	QUEST_DETAILS = 'Quest details',
	/**
	 * This template surfaces the following details:
	 * - "name" - The name of the Quest.
	 * - "number" - The Quest number.
	 * - "image" - The featured image for the Quest.
	 * - "release" - The release date of the Quest.
	 * - "update" - The release message that accompanied the update adding the Quest to the game.
	 * - "aka" - The alternative name for the Quest.
	 * - "members" - Whether or not the Quest is members-only content.
	 * - "series" - The Quest Series that the Quest is a part of.
	 * - "developer" - The name of the developer of the Quest.
	 */
	INFOBOX_QUEST = 'Infobox Quest',
	/**
	 * The SCP template displays a clickable skill icon picture
	 * (in other words, a "Skill ClickPic") that links to the skill
	 * page. This can be also be used in other templates that display
	 * skill icons.
	 *
	 * There are often multiple instances of this template in a Quest page.
	 */
	SCP = 'SCP',
	/**
	 * There may be multiple templates with this title.
	 */
	BOOSTABLE = 'Boostable',
	/**
	 * There may be multiple templates with this title.
	 */
	QUESTREQSTART = 'Questreqstart',
	/**
	 * There may be multiple templates with this title.
	 */
	FAIRYCODE = 'Fairycode',
	MAP = 'Map',
	/**
	 * There may be multiple templates with this title.
	 */
	NEEDED = 'Needed',
	/**
	 * There may be multiple templates with this title.
	 */
	NO_COINS = 'NoCoins',
	FLOOR_NUMBER = 'FloorNumber',
	/**
	 * There may be multiple templates with this title.
	 */
	GEP = 'GEP',
	QUEST_REWARDS = 'Quest rewards',
	HAS_TRANSCRIPT = 'Hastranscript',
	SUBJECT_CHANGES_HEADER = 'Subject changes header',
	SUBJECT_CHANGES = 'Subject changes',
	SUBJECT_CHANGES_FOOTER = 'Subject changes footer',
	/**
	 * There may be multiple templates with this title.
	 */
	CITE_NPC = 'CiteNPC',
	REFLIST = 'Reflist'
}

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

export type BaseOSRSWikiTemplate = ParsedTemplate & {
}

/**
 * The possible "official" Quest difficulties, set by Jagex.
 *
 * @see https://oldschool.runescape.wiki/w/Quest_Difficulties
 */
export type QuestDifficulty = 'Novice' | 'Intermediate' | 'Experienced' | 'Master' | 'Grandmaster' | 'Special'

/**
 * Contains high-level details about a Quest.
 */
export type InfoboxQuestTemplate = BaseOSRSWikiTemplate & {
	parameters: {
		/**
		 * The name of the Quest.
		 */
		name: string
		/**
		 * The number of the Quest.
		 */
		number: string
		/**
		 * The featured image for the Quest on the Wiki page.
		 */
		image: string
		/**
		 * The release date of the Quest stored in the following format: `[[28 February]] [[2005]]`
		 */
		release: string
		/**
		 * The main release message for the update that added the Quest to the game.
		 */
		update: string
		/**
		 * The alternative name for the Quest.
		 */
		aka: string
		/**
		 * A 'Yes' or 'No' string indicating if the Quest is members-only content.
		 */
		members: string
		/**
		 * The name of the Quest Series that the Quest is a part of (or 'None', if it's not part of a Quest Series).
		 */
		series: string
		/**
		 * The name of the lead developer for the Quest.
		 */
		developer: string
	}
}

/**
 * Contains detailed information about the Quest.
 */
export type QuestDetailsTemplate = BaseOSRSWikiTemplate & {
	parameters: {
		/**
		 * A string explaining how to start the quest, including who to talk to and where. The
		 * name of the NPC is wrapped in double-brackets; e.g., `[[Yanni Salika]]`. The locations
		 * are formatted similar to the following: `[[Shilo Village (location)|Shilo Village]]`.
		 */
		start: string
		/**
		 * A string representation of the XY coordinated of the start location coordinates on
		 * the World Map.
		 */
		startmap: string
		/**
		 * The official difficulty of the Quest.
		 */
		difficulty: QuestDifficulty
		/**
		 * The description of the Quest, provided by Jagex/the Quest developer.
		 */
		description: string
		/**
		 * The a string representing the offical length of the quest (e.g., "Short", "Medium", "Long" and more).
		 */
		length: string
		/**
		 * A string formatted as a bulleted list of requirements. The response
		 * contains the following things:
		 * - A list of required Quests to needed to complete this Quest.
		 *    - Each Quest is wrapped in double-brackets; for example [[Rune Mysteries]].
		 *    - If a pre-requisite Quest has it's own pre-requisites, those are listed beneath the Quest it's required for.
		 * - A list of required Skills needed to complete the Quest.
		 *    - Each listed Skill is listed as an "SCP" template.
		 */
		requirements: string
		/**
		 * A string formatted as a bulleted list of required Items. The response
		 * contains the following things:
		 * - A list of required Items needed to complete the Quest.
		 *    - Items are wrapped in double-brackets; for example [[Soft Clay]].
		 *    - This list MAY contain nested Items; for example, "The ingredients required to make a [[Guthix rest]]:"
		 *    - If the Item is obtainable during the Quest, the list item will contain the text, "(Obtainable during the quest)".
		 *    - The sub-list may include special pieces of information that applies to the item for the Quest.
		 */
		items: string
		/**
		 * A string formatted as a bulleted list of requirements. The response
		 * contains the following things:
		 * - A list of recommended Skills that aide in completing the Quest.
		 *    - Each listed Skill is listed as an "SCP" template.
		 * - Fast-travel recommendations formatted as a list of locations (or, locations combined
		 * with a description on how to get there).
		 *    - Each Location is formatted similar to the following: `[[Shilo Village (location)|Shilo Village]]`.
		 *    - Fairy ring locations are listed using the "Fairycode" template.
		 * - Recommended Items, but is often less-specific than the required Items.
		 *    - As an example, a common recommendation for Items is `[[Armour]] and some [[food]]`.
		 *    - Other examples can be "conditional": `[[Lockpick]] to enter the [[H.A.M. Hideout]] if your [[Thieving]] level is low`.
		 */
		recommended: string
		/**
		 * A string formatted as a bulleted list of enemy Monsters the player needs to kill during the
		 * Quest.
		 * - Each list item is a separate Monster, formatted similarly to `[[Slagilith]] ''(level 92)''`.
		 * - Monsters with multiple levels are formatted similarly to `[[Dwarf gang member]]s ''(level 44/48/49)''`
		 * - Monster list items may include links to other topics that are relevant to the Monster kills for the Quest, for example `[[Multicombat area]]`.
		 */
		kills: string
	}
}


