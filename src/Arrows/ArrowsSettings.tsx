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
						<span>Show vector segments: </span>
						<input
							type="checkbox"
							checked={this.props.shouldShowSegments}
							onChange={() => this.onChange("shouldShowSegments", !this.props.shouldShowSegments)}
						/>
						<span className="toggle"></span>
					</label>
				</p>
				{
					(() => {
						if (this.props.shouldShowSegments) {
							return (
								<p>
									<span style={{ display: "block", marginBottom: "0.5em" }}>Vector segment display:</span>
									<label>
										<input
											type="radio"
											name="vectorSegmentMode"
											checked={this.props.shouldShowTails}
											onChange={() => this.onChange("shouldShowTails", !this.props.shouldShowTails)}
										/>
										<span className="radio"></span>
										<span>Tails</span>
									</label>
									<label>
										<input
											type="radio"
											name="vectorSegmentMode"
											checked={!this.props.shouldShowTails}
											onChange={() => this.onChange("shouldShowTails", !this.props.shouldShowTails)}
										/>
										<span className="radio"></span>
										<span>Split</span>
									</label>
								</p>
							);
						}
					})()
				}
				<p>
					<label>
						<span>Grid: </span>
						<input
							type="checkbox"
							checked={this.props.shouldShowGrid}
							onChange={() => this.onChange("shouldShowGrid", !this.props.shouldShowGrid)}
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