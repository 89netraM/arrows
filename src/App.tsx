import React, { Component, ReactNode } from "react";
import { ArrowsCanvas } from "./Arrows/ArrowsCanvas";
import { ArrowsProperties, defaultArrowsProperties } from "./Arrows/ArrowsProperties";
import { ArrowsSettings } from "./Arrows/ArrowsSettings";

export interface AppState {
	isNavOpen: boolean;
	arrowsProps: ArrowsProperties;
}
export const defaultAppState: AppState = {
	isNavOpen: false,
	arrowsProps: defaultArrowsProperties
};

export class App extends Component<{}, AppState> {
	public constructor(props: {}) {
		super(props);

		this.state = defaultAppState;
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
						onChange={this.arrowPropsChange.bind(this)}
						{...this.state.arrowsProps}
					/>
				</nav>
				<main>
					<ArrowsCanvas {...this.state.arrowsProps}/>
				</main>
			</>
		);
	}
}