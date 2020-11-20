export interface IVectorSegments {
	shouldShowSegments: boolean;
	tails: boolean;
}
export function isIVectorSegments(obj: Object): obj is IVectorSegments {
	return "tails" in obj && typeof(obj["tails"]) === "boolean" &&
		"shouldShowSegments" in obj && typeof(obj["shouldShowSegments"]) === "boolean";
}