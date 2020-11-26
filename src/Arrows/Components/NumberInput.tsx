import React, { Component, ReactNode } from "react";
import { prettify } from "./helpers";

export interface NumberInputProperties {
	value: number;
	readOnly?: boolean;
	onChange?: (newValue: number) => void;
}
interface NumberInputState {
	text: string;
	isValid: boolean;
}

export class NumberInput extends Component<NumberInputProperties, NumberInputState> {
	public constructor(props: NumberInputProperties) {
		super(props);

		this.state = {
			text: prettify(this.props.value),
			isValid: true
		};
	}

	private updateText(newText: string): void {
		const newValue = parseFloat(newText);
		let isValid = !isNaN(newValue);
		if (this.props.onChange != null && isValid) {
			this.props.onChange(newValue);
		}

		this.setState({
			text: newText,
			isValid
		});
	}

	public render(): ReactNode {
		return (
			<label className={`${!this.state.isValid ? "error" : ""}`}>
				{ this.props.children }
				<input
					type="number"
					step={0.1}
					value={this.state.text}
					readOnly={this.props.readOnly}
					onChange={e => this.updateText(e.target.value)}
				></input>
			</label>
		);
	}
}