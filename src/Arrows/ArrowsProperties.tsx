export interface ArrowsProperties {
	shouldShowGrid: boolean;
	shouldShowTails: boolean;
	shouldShowSegments: boolean;
	cameraMode: "perspective" | "orthographic";
}
export const defaultArrowsProperties: ArrowsProperties = {
	shouldShowGrid: true,
	shouldShowTails: false,
	shouldShowSegments: true,
	cameraMode: "perspective",
};