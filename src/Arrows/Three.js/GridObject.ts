import { Object3D, PlaneGeometry, Mesh, MeshBasicMaterial, Renderer, Scene, Camera, Color, Material, Geometry, Group, Vector3 } from "three";

export class GridObject extends Object3D {
	private static readonly frontColor: Color = new Color(0x000000);
	private static readonly backColor: Color = new Color(0x885500);

	private readonly material: MeshBasicMaterial;

	public constructor() {
		super();
		
		const planeGeometry = new PlaneGeometry(4, 4, 4, 4);
		this.material = new MeshBasicMaterial({ wireframe: true });
		const plane = new Mesh(planeGeometry, this.material);
		plane.rotation.x = -Math.PI / 2;
		this.add(plane);

		plane.onBeforeRender = this.beforeRender.bind(this);
	}

	private beforeRender(renderer: Renderer, scene: Scene, camera: Camera, geometry: Geometry, material: Material, group: Group): void {
		if (camera.position.clone().projectOnVector(this.localToWorld(new Vector3(0, 1, 0))).y < 0) {
			this.material.color.set(GridObject.backColor);
		}
		else {
			this.material.color.set(GridObject.frontColor);
		}
	}
}