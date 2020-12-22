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

	public componentDidUpdate(prevProps: NumberInputProperties): void {
		if (this.props.value !== prevProps.value && this.props.value !== parseFloat(this.state.text)) {
			this.setState({
				text: prettify(this.props.value),
				isValid: true
			});
		}
	}

	private updateText(newText: string): void {
		const newValue = parseFloat(newText);
		let isValid = !isNaN(newValue);
		this.setState({
			text: newText,
			isValid
		});

		if (this.props.onChange != null && isValid) {
			this.props.onChange(newValue);
		}
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