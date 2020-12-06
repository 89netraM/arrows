import React, { Component, ReactNode } from "react";
import { ArrowsCanvas } from "./Arrows/ArrowsCanvas";
import { ArrowsProperties } from "./Arrows/ArrowsProperties";
import { ArrowsSettings } from "./Arrows/ArrowsSettings";
import { SceneAndSettings } from "./Arrows/Scenes/SceneAndSettings";
import { BaseScene } from "./Arrows/Three.js/BaseScene";

export interface AppProperties<T extends ArrowsProperties> {
	startingState: AppState<T>;
}

export interface AppState<T extends ArrowsProperties> {
	isNavOpen: boolean;
	scene: SceneAndSettings<T>;
	arrowsProps: T;
}

export class App<T extends ArrowsProperties> extends Component<AppProperties<T>, AppState<T>> {
	private scene: [(p: T) => BaseScene<T>, BaseScene<T>] = [null, null];

	public constructor(props: AppProperties<T>) {
		super(props);

		this.state = this.props.startingState;
	}

	private toggleNav(): void {
		this.setState({
			isNavOpen: !this.state.isNavOpen
		});
	}

	private arrowPropsChange(changed: Partial<ArrowsProperties>): void {
		this.setState({
			arrowsProps: {
				...this.state.arrowsProps,
				...changed
			}
		});
	}

	public render(): ReactNode {
		const canvasRef = React.createRef<ArrowsCanvas>();

		if (this.scene[0] !== this.state.scene.scene) {
			this.scene = [
				this.state.scene.scene,
				this.state.scene.scene(this.state.arrowsProps)
			];
		}

		return (
			<>
				<header>
					<button
						className="expand-nav"
						onClick={this.toggleNav.bind(this)}
						>
					</button>
					<h1>Arrows</h1>
				</header>
				<nav className={`${this.state.isNavOpen ? "visible" : ""}`}>
					<ArrowsSettings
						sceneSettings={this.state.scene.settings({
							...this.state.arrowsProps,
							onChange: this.arrowPropsChange.bind(this),
							onEvent: (n, e) => canvasRef.current?.event(n, e)
						})}
						onChange={this.arrowPropsChange.bind(this)}
						onResetView={() => canvasRef.current?.event("resetView", null)}
						{...this.state.arrowsProps}
					/>
				</nav>
				<main>
					<ArrowsCanvas
						ref={canvasRef}
						scene={this.scene[1]}
						{...this.state.arrowsProps}
					/>
				</main>
			</>
		);
	}
}