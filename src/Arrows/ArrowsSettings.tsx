import React, { Component, ReactNode } from "react";
import { ArrowsProperties } from "./ArrowsProperties";

export interface ArrowsSettingsProperties extends ArrowsProperties {
	sceneSettings: ReactNode;
	onChange: (changed: Partial<ArrowsProperties>) => void;
	onResetView: () => void;
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

	private onResetView(): void {
		this.props.onResetView();
	}

	public render(): ReactNode {
		return (
			<>
				{ this.props.sceneSettings }
				<hr/>
				<p>
					<button onClick={this.onResetView.bind(this)}>
						Reset View
					</button>
				</p>
				<p>
					<span style={{ display: "block", marginBottom: "0.5em" }}>Camera mode:</span>
					<label>
						<input
							type="radio"
							name="cameraMode"
							checked={this.props.cameraMode === "perspective"}
							onChange={e => {
								if (e.target.checked) {
									this.onChange("cameraMode", "perspective")
								}
							}}
						/>
						<span className="radio"></span>
						<span>Perspective</span>
					</label>
					<label>
						<input
							type="radio"
							name="cameraMode"
							checked={this.props.cameraMode === "orthographic"}
							onChange={e => {
								if (e.target.checked) {
									this.onChange("cameraMode", "orthographic")
								}
							}}
						/>
						<span className="radio"></span>
						<span>Orthographic</span>
					</label>
				</p>
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