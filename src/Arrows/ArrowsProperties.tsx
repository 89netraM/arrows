export interface ArrowsProperties {
	shouldShowGrid: boolean;
	shouldShowTails: boolean;
	shouldShowSegments: boolean;
	isLabelVisible: boolean;
	cameraMode: "perspective" | "orthographic";
}
export const defaultArrowsProperties: ArrowsProperties = {
	shouldShowGrid: true,
	shouldShowTails: false,
	shouldShowSegments: true,
	isLabelVisible: true,
	cameraMode: "perspective",
};