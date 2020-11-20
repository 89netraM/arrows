import { Object3D, Vector3, Material, MeshToonMaterial } from "three";
import { ArrowObject } from "./ArrowObject";

export class VectorObject extends Object3D {
	//#region Static helpers
	public static readonly baseMaterial: Material = new MeshToonMaterial({ color: 0x7F7F7F });
	public static readonly xHeadMaterial: Material = new MeshToonMaterial({ color: 0xFF0000 });
	public static readonly yHeadMaterial: Material = new MeshToonMaterial({ color: 0x00FF00 });
	public static readonly zHeadMaterial: Material = new MeshToonMaterial({ color: 0x0000FF });

	private static typeChecker(a: Vector3 | number, b?: number | Material, c?: number, d?: Material): [Vector3, Material] {
		if (a instanceof Vector3) {
			if (b != null && b instanceof Material) {
				return [a, b];
			}
			else {
				return [a, VectorObject.baseMaterial];
			}
		}
		else if (typeof a === "number" && typeof b === "number" && typeof b === "number") {
			const vector = new Vector3(a, b, c);

			if (d != null && d instanceof Material) {
				return [vector, d];
			}
			else {
				return [vector, VectorObject.baseMaterial];
			}
		}
	}
	//#endregion Static helpers

	private readonly vector: Vector3;

	public get x(): number {
		return this.vector.x;
	}
	public set x(value: number) {
		this.vector.x = value;
		this.updateVectors();
	}
	public get y(): number {
		return this.vector.y;
	}
	public set y(value: number) {
		this.vector.y = value;
		this.updateVectors();
	}
	public get z(): number {
		return this.vector.z;
	}
	public set z(value: number) {
		this.vector.z = value;
		this.updateVectors();
	}

	protected _tails: boolean = false;
	public get tails(): boolean {
		return this._tails;
	}
	public set tails(value: boolean) {
		this._tails = value;
		this.updateVectors();
	}

	protected readonly xVector: ArrowObject;
	protected readonly yVector: ArrowObject;
	protected readonly zVector: ArrowObject;
	protected readonly aVector: ArrowObject;

	public constructor(vector: Vector3, baseMaterial?: Material);
	public constructor(x: number, y: number, z: number, baseMaterial?: Material);
	public constructor(a: Vector3 | number, b?: number | Material, c?: number, d?: Material) {
		super();

		let baseMaterial;
		[this.vector, baseMaterial] = VectorObject.typeChecker(a, b, c, d);

		this.xVector = new ArrowObject(VectorObject.yHeadMaterial, baseMaterial);
		this.add(this.xVector);

		this.yVector = new ArrowObject(VectorObject.zHeadMaterial, baseMaterial);
		this.add(this.yVector);

		this.zVector = new ArrowObject(VectorObject.xHeadMaterial, baseMaterial);
		this.add(this.zVector);

		this.aVector = new ArrowObject(baseMaterial, baseMaterial, 1.25);
		this.add(this.aVector);

		this.updateVectors();
	}

	protected updateVectors(): void {
		this.xVector.length = this.vector.x;
		this.xVector.position.z = this.tails ? this.vector.z : 0.0;
		this.xVector.rotation.z = -Math.PI / 2.0;

		this.yVector.length = this.vector.y;
		this.yVector.position.x = this.tails ? this.vector.x : 0.0;
		this.yVector.position.z = this.tails ? this.vector.z : 0.0;

		this.zVector.length = this.vector.z;
		this.zVector.rotation.x = Math.PI / 2.0;

		this.aVector.length = this.vector.length();
		this.aVector.lookAt(this.position.clone().add(this.vector));
		this.aVector.rotateOnAxis(new Vector3(1.0, 0.0, 0.0), Math.PI / 2);
	}
}