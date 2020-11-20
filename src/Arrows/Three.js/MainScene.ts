import { DirectionalLight, Mesh, MeshToonMaterial, Object3D, Scene, SphereGeometry, Vector3 } from "three";

export class MainScene extends Scene {
	private static readonly lightPositions: ReadonlyArray<Vector3> = new Array<Vector3>(
		new Vector3(-10, 10, 10),
		new Vector3(10, -10, 10),
		new Vector3(10, 10, -10)
	);

	private ball: Object3D;

	public constructor() {
		super();

		this.addLights();

		const ballGeometry = new SphereGeometry(1);
		const ballMaterial = new MeshToonMaterial({ color: 0xBADA55 });
		this.ball = new Mesh(ballGeometry, ballMaterial);
	}

	private addLights(): void {
		for (const position of MainScene.lightPositions) {
			const light = new DirectionalLight(0xFFFFFF, 1/3);
			light.position.set(position.x, position.y, position.z);
			light.lookAt(0, 0, 0);
			this.add(light);
		}
	}

	public showBall(): void {
		this.add(this.ball);
	}
	public hideBall(): void {
		this.remove(this.ball);
	}
}