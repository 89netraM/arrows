import { Color } from "three";

export function getThemedColor(): string {
	return window.getComputedStyle(document.body)
		.getPropertyValue("--color");
}
export function getThemedInvertedColor(): string {
	return window.getComputedStyle(document.body)
		.getPropertyValue("--color-inverted");
}
export function cssColorToThreeJSColor(cssColor: string): Color {
	return new Color(
		parseInt(
			cssColor.replace(/^.*?(\[0-9a-f]{3}|[0-9a-f]{6}).*$/i, "$1"),
			16
		)
	);
}