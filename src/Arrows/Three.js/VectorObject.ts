import { Object3D, Vector3, Material, MeshToonMaterial } from "three";
import { ArrowObject } from "./ArrowObject";
import { IVectorSegments } from "./IVectorSegments";
import { ILabeled } from "./ILabeled";

export class VectorObject extends Object3D implements IVectorSegments, ILabeled {
	//#region Static helpers
	public static readonly baseMaterial: Material = new MeshToonMaterial({ color: 0x7F7F7F });
	public static readonly xHeadMaterial: Material = new MeshToonMaterial({ color: 0xFF0000 });
	public static readonly yHeadMaterial: Material = new MeshToonMaterial({ color: 0x00FF00 });
	public static readonly zHeadMaterial: Material = new MeshToonMaterial({ color: 0x0000FF });

	private static typeChecker(a: Vector3 | number, b?: number | Material, c?: number | string, d?: Material, e?: string): [Vector3, Material, string] {
		if (a instanceof Vector3) {
			if (b != null && b instanceof Material) {
				if (c != null && typeof(c) === "string") {
					return [a, b, c];
				}
				else {
					return [a, b, ""];
				}
			}
			else {
				return [a, VectorObject.baseMaterial, ""];
			}
		}
		else if (typeof a === "number" && typeof b === "number" && typeof c === "number") {
			const vector = new Vector3(a, b, c);

			if (d != null && d instanceof Material) {
				if (e != null && typeof(e) === "string") {
					return [vector, d, e];
				}
				else {
					return [vector, d, ""];
				}
			}
			else {
				return [vector, VectorObject.baseMaterial, ""];
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

	protected _shouldShowSegments: boolean = true;
	public get shouldShowSegments(): boolean {
		return this._shouldShowSegments;
	}
	public set shouldShowSegments(value: boolean) {
		this._shouldShowSegments = value;
		this.updateVectors();
	}

	public get label(): string {
		return this.aVector.label;
	}
	public set label(value: string) {
		this.aVector.label = value;
	}
	public get isLabelVisible(): boolean {
		return this.aVector.isLabelVisible;
	}
	public set isLabelVisible(value: boolean) {
		this.aVector.isLabelVisible = value;
	}

	protected readonly xVector: ArrowObject;
	protected readonly yVector: ArrowObject;
	protected readonly zVector: ArrowObject;
	protected readonly aVector: ArrowObject;

	public constructor(vector: Vector3, baseMaterial?: Material, label?: string);
	public constructor(x: number, y: number, z: number, baseMaterial?: Material, label?: string);
	public constructor(a: Vector3 | number, b?: number | Material, c?: number | string, d?: Material, e?: string) {
		super();

		let baseMaterial: Material;
		let label: string;
		[this.vector, baseMaterial, label] = VectorObject.typeChecker(a, b, c, d, e);

		this.xVector = new ArrowObject(VectorObject.yHeadMaterial, baseMaterial);
		this.add(this.xVector);

		this.yVector = new ArrowObject(VectorObject.zHeadMaterial, baseMaterial);
		this.add(this.yVector);

		this.zVector = new ArrowObject(VectorObject.xHeadMaterial, baseMaterial);
		this.add(this.zVector);

		this.aVector = new ArrowObject(baseMaterial, baseMaterial, 1.25);
		this.aVector.label = label;
		this.add(this.aVector);

		this.updateVectors();
	}

	protected updateVectors(): void {
		this.xVector.length = this.vector.x;
		this.xVector.position.z = this.tails ? this.vector.z : 0.0;
		this.xVector.rotation.z = -Math.PI / 2.0;
		this.xVector.visible = this.shouldShowSegments;

		this.yVector.length = this.vector.y;
		this.yVector.position.x = this.tails ? this.vector.x : 0.0;
		this.yVector.position.z = this.tails ? this.vector.z : 0.0;
		this.yVector.visible = this.shouldShowSegments;

		this.zVector.length = this.vector.z;
		this.zVector.rotation.x = Math.PI / 2.0;
		this.zVector.visible = this.shouldShowSegments;

		this.aVector.length = this.vector.length();
		this.aVector.lookAt(this.position.clone().add(this.vector));
		this.aVector.rotateOnAxis(new Vector3(1.0, 0.0, 0.0), Math.PI / 2);
	}
}