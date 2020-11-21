import React, { Component, ReactNode } from "react";
import { Vector3 } from "three";

export function VectorInput(props: { vector: Vector3, onChange?: (newVector: Vector3) => void }): JSX.Element {
	return (
		<span className="vector">
			<VectorDimensionInput
				name="x"
				color="#ff0000"
				length={props.vector.z}
				onChange={props.onChange != null ? z => props.onChange(props.vector.clone().setZ(z)) : null}
			/>
			<VectorDimensionInput
				name="y"
				color="#00ff00"
				length={props.vector.x}
				onChange={props.onChange != null ? x => props.onChange(props.vector.clone().setX(x)) : null}
			/>
			<VectorDimensionInput
				name="z"
				color="#0000ff"
				length={props.vector.y}
				onChange={props.onChange != null ? y => props.onChange(props.vector.clone().setY(y)) : null}
			/>
		</span>
	);
}

interface VectorDimensionInputProperties {
	name: string;
	color: string;
	length: number;
	onChange?: (newLength: number) => void;
}
interface VectorDimensionInputState {
	text: string;
}

class VectorDimensionInput extends Component<VectorDimensionInputProperties, VectorDimensionInputState> {
	public constructor(props: VectorDimensionInputProperties) {
		super(props);

		this.state = {
			text: this.props.length.toString()
		};
	}

	private updateText(newText: string): void {
		const newLength = parseFloat(newText);
		if (this.props.onChange != null && !isNaN(newLength)) {
			this.props.onChange(newLength);
		}

		this.setState({
			text: newText
		});
	}

	public render(): ReactNode {
		const valid = !isNaN(parseFloat(this.state.text));

		return (
			<label className={`${!valid ? "error" : ""}`}>
				<span style={{ color: this.props.color }}>{this.props.name}</span>:
				<input
					type="text"
					value={this.state.text}
					readOnly={this.props.onChange == null}
					onChange={e => this.updateText(e.target.value)}
				></input>
			</label>
		);
	}
}