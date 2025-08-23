// TODO: Regularly check if wikijs is exporting their types - at the moment, they don't export the types, so this just
// mirrors their internal types.

export interface Options {
	apiUrl?: string;
	origin?: string;
	headers?: HeadersInit;
}

export interface Coordinates {
	lat: number;
	lon: number;
	primary: string;
	globe: string;
}

export interface Link {
	lang: string;
	title: string;
}

export interface Image {
	ns: number;
	title: string;
	missing: string;
	known: string;
	imagerepository: string;
	imageinfo: object[];
}

export interface Result {
	results: string[];
	query: string;
	next(): Promise<Result>;
}

export interface RawPage {
	pageid: number;
	ns: number;
	title: string;
	touched: string;
	lastrevid: number;
	counter: number;
	length: number;
	fullurl: string;
	editurl: string;
}

export interface Page {
	raw: RawPage;
	backlinks(aggregated?: boolean, limit?: number): Promise<string[]>;
	categories(aggregated?: boolean, limit?: number): Promise<string[]>;
	content(): Promise<string>;
	coordinates(): Promise<Coordinates>;
	fullInfo(): Promise<object>;
	html(): Promise<string>;
	images(): Promise<string[]>;
	info(key?: string): Promise<object>;
	langlinks(): Promise<Link[]>;
	links(aggregated?: boolean, limit?: number): Promise<string[]>;
	mainImage(): Promise<string>;
	rawContent(): Promise<string>;
	rawImages(): Promise<Image[]>;
	references(): Promise<string[]>;
	summary(): Promise<string>;
	tables(): Promise<any>;
	url(): string;
}

export interface WikiInstance {
	findById(pageID: string): Promise<Page>;
	find(query: string, predicate?: (pages: Page[]) => Page): Promise<Page>;
	geoSearch(lat: number, lon: number, radius?: number): Promise<string[]>;
	page(title: string): Promise<Page>;
	allPages(): Promise<string[]>;
	random(limit?: number): Promise<string[]>;
	search(query: string, limit?: number): Promise<Result>;
	opensearch(query: string, limit?: number): Promise<string[]>;
	prefixSearch(query: string, limit?: number): Promise<Result>;
	mostViewed(): Promise<{ title: string; count: number }[]>;
	allCategories(): Promise<string[]>;
	pagesInCategory(category: string): Promise<string[]>;
}

export type WikiJS = (options?: Options) => WikiInstance;