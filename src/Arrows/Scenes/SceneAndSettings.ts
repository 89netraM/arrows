import { ReactNode } from "react";
import { ArrowsProperties } from "../ArrowsProperties";
import { BaseScene } from "../Three.js/BaseScene";

export interface SceneAndSettings<T extends ArrowsProperties> {
	scene: (p: T) => BaseScene<T>;
	settings: (p: SettingsProperties<T>) => ReactNode;
	defaultProperties: T;
}

export type SettingsProperties<T extends ArrowsProperties> = T & {
	onChange: (props: Partial<T>) => void
};