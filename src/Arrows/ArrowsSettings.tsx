import React, { Component, ReactNode } from "react";
import { ArrowsProperties } from "./ArrowsProperties";

export interface ArrowsSettingsProperties extends ArrowsProperties {
	onChange: (changed: Partial<ArrowsProperties>) => void;
}

export class ArrowsSettings extends Component<ArrowsSettingsProperties, {}> {
	public constructor(props: ArrowsSettingsProperties) {
		super(props);
	}

	private onChange<T extends keyof ArrowsProperties>(prop: T, value: ArrowsProperties[T]): void {
		this.props.onChange({
			[prop]: value
		});
	}

	public render(): ReactNode {
		return (
			<>
				<p>
					<label>
						<span>Is on: </span>
						<input
							type="checkbox"
							checked={this.props.isOn}
							onChange={() => this.onChange("isOn", !this.props.isOn)}
						/>
						<span
							className="toggle"
							data-off="Off"
							data-on="On"
							>
						</span>
					</label>
				</p>
			</>
		);
	}
}