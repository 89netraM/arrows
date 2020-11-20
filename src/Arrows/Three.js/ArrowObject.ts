import { Object3D, ConeGeometry, Material, Mesh, MeshBasicMaterial, CylinderGeometry } from "three";

export class ArrowObject extends Object3D {
	//#region Static helpers
	private static calcDirection(totalLength: number): number {
		if (totalLength >= 0.0) {
			return 1.0;
		}
		else {
			return -1.0;
		}
	}

	public static readonly headRadius: number = 0.15;
	public static readonly headLength: number = 0.3;
	private static calcHeadPosition(totalLength: number): number {
		return (Math.abs(totalLength) - ArrowObject.headLength / 2.0) * ArrowObject.calcDirection(totalLength);
	}
	
	public static readonly arrowRadius: number = 0.05;
	private static calcArrowLength(totalLength: number): number {
		return (Math.abs(totalLength) - ArrowObject.headLength) * ArrowObject.calcDirection(totalLength);
	}
	private static calcArrowPosition(totalLength: number): number {
		return ArrowObject.calcArrowLength(totalLength) / 2.0;
	}
	//#endregion Static helpers

	private readonly headMesh: Mesh;
	public get headMaterial(): Material | Array<Material> {
		return this.headMesh.material;
	}
	public set headMaterial(value: Material | Array<Material>) {
		this.headMesh.material = value;
	}

	private readonly arrowMesh: Mesh;
	public get arrowMaterial(): Material | Array<Material> {
		return this.arrowMesh.material;
	}
	public set arrowMaterial(value: Material | Array<Material>) {
		this.arrowMesh.material = value;
	}

	private _length: number;
	public get length(): number {
		return this._length;
	}
	public set length(value: number) {
		this._length = value;
		this.updateLength();
	}

	public constructor(headMaterial?: Material, arrowMaterial?: Material, radius: number = 1.0, length: number = 1.0, detail: number = 25) {
		super();
		
		const headGeometry = new ConeGeometry(ArrowObject.headRadius * radius, ArrowObject.headLength * radius, detail);
		if (headMaterial != null) {
			this.headMesh = new Mesh(headGeometry, headMaterial);
		}
		else {
			this.headMesh = new Mesh(headGeometry, new MeshBasicMaterial({ color: 0x333333 }));
		}
		this.add(this.headMesh);
		
		const arrowGeometry = new CylinderGeometry(ArrowObject.arrowRadius * radius, ArrowObject.arrowRadius * radius, 1.0, detail);
		if (arrowMaterial != null) {
			this.arrowMesh = new Mesh(arrowGeometry, arrowMaterial);
		}
		else {
			this.arrowMesh = new Mesh(arrowGeometry, new MeshBasicMaterial({ color: 0x333333 }));
		}
		this.add(this.arrowMesh);
		
		this.length = length;
	}
	
	private updateLength(): void {
		if (Math.abs(this.length) < ArrowObject.headLength) {
			this.visible = false;
		}
		else {
			this.visible = true;
			this.headMesh.scale.y = ArrowObject.calcDirection(this.length);
			this.headMesh.position.y = ArrowObject.calcHeadPosition(this.length);
			this.arrowMesh.scale.y = ArrowObject.calcArrowLength(this.length);
			this.arrowMesh.position.y = ArrowObject.calcArrowPosition(this.length);
		}
	}
}