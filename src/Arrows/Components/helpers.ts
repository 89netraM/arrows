const precision = 100;
export function prettify(value: number): string {
	return (Math.round(value * precision) / precision).toString();
}