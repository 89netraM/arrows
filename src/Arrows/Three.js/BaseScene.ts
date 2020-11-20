import { DirectionalLight, Scene, Vector3 } from "three";
import { ArrowsProperties } from "../ArrowsProperties";
import { GridObject } from "./GridObject";
import { isIVectorSegments } from "./IVectorSegments";
import { TorqueObject } from "./TorqueObject";
import { VectorObject } from "./VectorObject";

export class BaseScene<TProperties extends ArrowsProperties> extends Scene {
	private static readonly lightPositions: ReadonlyArray<Vector3> = new Array<Vector3>(
		new Vector3(-10, 10, 10),
		new Vector3(10, -10, 10),
		new Vector3(10, 10, -10),
	);

	private readonly grid: GridObject;

	private props: TProperties;

	public constructor(props: TProperties) {
		super();

		this.props = props;

		this.addLights();

		this.grid = new GridObject();
		if (this.props.shouldShowGrid) {
			this.add(this.grid);
		}
	}

	private addLights(): void {
		for (const position of BaseScene.lightPositions) {
			const light = new DirectionalLight(0xFFFFFF, 1/3);
			light.position.set(position.x, position.y, position.z);
			light.lookAt(0, 0, 0);
			this.add(light);
		}
	}

	public updateProperties(newProps: TProperties): void {
		this.onPropertiesUpdate(newProps);
		this.props = newProps;
	}

	protected onPropertiesUpdate(newProps: TProperties): void {
		if (this.props.shouldShowGrid !== newProps.shouldShowGrid) {
			if (newProps.shouldShowGrid) {
				this.add(this.grid);
			}
			else {
				this.remove(this.grid);
			}
		}

		if (this.props.shouldShowTails !== newProps.shouldShowTails) {
			for (const child of this.children) {
				if (isIVectorSegments(child)) {
					child.tails = newProps.shouldShowTails;
				}
			}
		}

		if (this.props.shouldShowSegments !== newProps.shouldShowSegments) {
			for (const child of this.children) {
				if (isIVectorSegments(child)) {
					child.shouldShowSegments = newProps.shouldShowSegments;
				}
			}
		}
	}
}