import React, { ReactNode } from "react";
import { Vector3, MeshToonMaterial } from "three";
import { ArrowsProperties, defaultArrowsProperties } from "../ArrowsProperties";
import { VectorInput } from "../Components/VectorInput";
import { ArrowObject } from "../Three.js/ArrowObject";
import { BaseScene } from "../Three.js/BaseScene";
import { TorqueObject } from "../Three.js/TorqueObject";
import { VectorObject } from "../Three.js/VectorObject";
import { SceneAndSettings, SettingsProperties } from "./SceneAndSettings";

export interface TorqueProperties extends ArrowsProperties {
	r: Vector3;
	F: Vector3;
	M: Vector3;
}

class TorqueScene extends BaseScene<TorqueProperties> {
	private readonly r: VectorObject;
	private readonly F: VectorObject;
	private readonly M: TorqueObject;

	public constructor(props: TorqueProperties) {
		super(props);

		const x = new ArrowObject(VectorObject.xHeadMaterial, VectorObject.xHeadMaterial, 1.05);
		x.rotateX(Math.PI / 2);
		this.add(x);
		const y = new ArrowObject(VectorObject.yHeadMaterial, VectorObject.yHeadMaterial, 1.05);
		y.rotateZ(-Math.PI / 2);
		this.add(y);
		const z = new ArrowObject(VectorObject.zHeadMaterial, VectorObject.zHeadMaterial, 1.05);
		this.add(z);

		this.r = new VectorObject(this.props.r, VectorObject.baseMaterial);
		this.add(this.r);

		this.F = new VectorObject(this.props.F, new MeshToonMaterial({ color: 0x8F45C7 }));
		this.F.position.set(this.r.x, this.r.y, this.r.z);
		this.add(this.F);

		this.M = new TorqueObject(this.props.M, new MeshToonMaterial({ color: 0xFFD966 }));
		this.M.position.set(this.r.position.x, this.r.position.y, this.r.position.z);
		this.M.x = this.r.y * this.F.z - this.r.z * this.F.y;
		this.M.y = this.r.z * this.F.x - this.r.x * this.F.z;
		this.M.z = this.r.x * this.F.y - this.r.y * this.F.x;
		this.add(this.M);
	}

	public onPropertiesUpdate(newProps: TorqueProperties): void {
		super.onPropertiesUpdate(newProps);

		if (!this.props.r.equals(newProps.r)) {
			if (this.r.x !== newProps.r.x) {
				this.r.x = newProps.r.x;
			}
			if (this.r.y !== newProps.r.y) {
				this.r.y = newProps.r.y;
			}
			if (this.r.z !== newProps.r.z) {
				this.r.z = newProps.r.z;
			}

			this.F.position.set(newProps.r.x, newProps.r.y, newProps.r.z);
		}

		if (!this.props.F.equals(newProps.F)) {
			if (this.F.x !== newProps.F.x) {
				this.F.x = newProps.F.x;
			}
			if (this.F.y !== newProps.F.y) {
				this.F.y = newProps.F.y;
			}
			if (this.F.z !== newProps.F.z) {
				this.F.z = newProps.F.z;
			}
		}

		if (!this.props.M.equals(newProps.M)) {
			if (this.M.x !== newProps.M.x) {
				this.M.x = newProps.M.x;
			}
			if (this.M.y !== newProps.M.y) {
				this.M.y = newProps.M.y;
			}
			if (this.M.z !== newProps.M.z) {
				this.M.z = newProps.M.z;
			}
		}
	}
}

function TorqueSettings(props: SettingsProperties<TorqueProperties>): JSX.Element {
	return (
		<>
			<p>
				<strong style={{ color: "#7f7f7f" }}>r</strong>:
				<VectorInput
					vector={props.r}
					onChange={r => props.onChange({ r: r, M: calculateM(r, props.F) })}
				/>
			</p>
			<p>
				<strong style={{ color: "#8445c7" }}>F</strong>:
				<VectorInput
					vector={props.F}
					onChange={F => props.onChange({ F: F, M: calculateM(props.r, F) })}
				/>
			</p>
			<p>
				<strong style={{ color: "#ffd966" }}>M</strong>:
				<VectorInput
					key={JSON.stringify(props.M.toArray())}
					vector={props.M}
				/>
			</p>
		</>
	);
}
function calculateM(r: Vector3, F: Vector3): Vector3 {
	return new Vector3(
		r.y * F.z - r.z * F.y,
		r.z * F.x - r.x * F.z,
		r.x * F.y - r.y * F.x
	);
}

export const Torque: SceneAndSettings<TorqueProperties> = {
	scene: p => new TorqueScene(p),
	settings: p => <TorqueSettings {...p}/>,
	defaultProperties: {
		r: new Vector3(2, 3, -1.5),
		F: new Vector3(-1, -4, 2.5),
		M: new Vector3(1.5, -3.5, -5),
		...defaultArrowsProperties
	}
};