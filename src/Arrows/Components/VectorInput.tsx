import React from "react";
import { Vector3 } from "three";
import { NumberInput } from "./NumberInput";

export interface VectorInputProperties {
	vector: Vector3;
	readOnly?: boolean;
	onChange?: (newVector: Vector3) => void;
}

export function VectorInput(props: VectorInputProperties): JSX.Element {
	return (
		<span className="vector">
			<NumberInput
				value={props.vector.z}
				onChange={props.onChange != null ? z => props.onChange(props.vector.clone().setZ(z)) : null}
				readOnly={props.readOnly}
			>
				<span style={{ color: "#ff0000" }}>x</span>:
			</NumberInput>
			<NumberInput
				value={props.vector.x}
				onChange={props.onChange != null ? x => props.onChange(props.vector.clone().setX(x)) : null}
				readOnly={props.readOnly}
			>
			<span style={{ color: "#00ff00" }}>y</span>:
			</NumberInput>
			<NumberInput
				value={props.vector.y}
				onChange={props.onChange != null ? y => props.onChange(props.vector.clone().setY(y)) : null}
				readOnly={props.readOnly}
			>
				<span style={{ color: "#0000ff" }}>z</span>:
			</NumberInput>
			<NumberInput
				key={props.vector.length()}
				value={props.vector.length()}
				readOnly={true}
			>
				<span>Magnitude</span>:
			</NumberInput>
		</span>
	);
}