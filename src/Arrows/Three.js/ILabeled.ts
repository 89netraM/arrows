export interface ILabeled {
	label: string;
	isLabelVisible: boolean;
}
export function isILabeled(obj: Object): obj is ILabeled {
	return "label" in obj && typeof(obj["label"]) === "string" &&
		"isLabelVisible" in obj && typeof(obj["isLabelVisible"]) === "boolean";
}