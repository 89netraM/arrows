import React, { Component, ReactNode } from "react";
import { ArrowsProperties } from "./ArrowsProperties";

export class ArrowsCanvas extends Component<ArrowsProperties, {}> {
	public constructor(props: ArrowsProperties) {
		super(props);
	}

	public render(): ReactNode {
		if (this.props.isOn) {
			return (
				<h1 style={{ margin: 0 }}>On</h1>
			);
		}
		else {
			return (
				<h1 style={{ margin: 0 }}>Off</h1>
			);
		}
	}
}