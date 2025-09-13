// Parse the release string, which is formatted similarly to `[[28 February]] [[2005]]`
export const getReleaseParts = (release: string) => {
	let matches: string[] = []
	const releaseMatch = release.match(/\[\[(\d+)\s+([^\]]+)\]\]\s*\[\[(\d+)\]\]/)
	if (releaseMatch) {
		matches = [
			releaseMatch[1],
			releaseMatch[2],
			releaseMatch[3],
		]
	}
	return matches
}