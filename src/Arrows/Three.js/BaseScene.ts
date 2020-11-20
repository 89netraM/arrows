import { DirectionalLight, Scene, Vector3 } from "three";
import { GridObject } from "./GridObject";

export class BaseScene extends Scene {
	private static readonly lightPositions: ReadonlyArray<Vector3> = new Array<Vector3>(
		new Vector3(-10, 10, 10),
		new Vector3(10, -10, 10),
		new Vector3(10, 10, -10)
	);

	private grid: GridObject;

	public constructor() {
		super();

		this.addLights();

		this.grid = new GridObject();
	}

	private addLights(): void {
		for (const position of BaseScene.lightPositions) {
			const light = new DirectionalLight(0xFFFFFF, 1/3);
			light.position.set(position.x, position.y, position.z);
			light.lookAt(0, 0, 0);
			this.add(light);
		}
	}

	public showGrid(): void {
		this.add(this.grid);
	}
	public hideGrid(): void {
		this.remove(this.grid);
	}
}