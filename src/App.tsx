import React, { Component, ReactNode } from "react";
import { ArrowsCanvas } from "./Arrows/ArrowsCanvas";
import { ArrowsProperties } from "./Arrows/ArrowsProperties";
import { ArrowsSettings } from "./Arrows/ArrowsSettings";
import { SceneAndSettings } from "./Arrows/Scenes/SceneAndSettings";

export interface AppProperties<T extends ArrowsProperties> {
	startingState: AppState<T>;
}

export interface AppState<T extends ArrowsProperties> {
	isNavOpen: boolean;
	scene: SceneAndSettings<T>;
	arrowsProps: T;
}

export class App<T extends ArrowsProperties> extends Component<AppProperties<T>, AppState<T>> {
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
							onChange: this.arrowPropsChange.bind(this)
						})}
						onChange={this.arrowPropsChange.bind(this)}
						onResetView={() => canvasRef.current?.resetView()}
						{...this.state.arrowsProps}
					/>
				</nav>
				<main>
					<ArrowsCanvas
						ref={canvasRef}
						scene={this.state.scene.scene(this.state.arrowsProps)}
						{...this.state.arrowsProps}
					/>
				</main>
			</>
		);
	}
}