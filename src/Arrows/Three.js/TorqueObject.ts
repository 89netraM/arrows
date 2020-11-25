import { Vector3, Material, Object3D } from "three";
import { VectorObject } from "./VectorObject";
import { ArrowObject } from "./ArrowObject";
import { IVectorSegments } from "./IVectorSegments";
import { ILabeled } from "./ILabeled";

export class TorqueObject extends Object3D implements IVectorSegments, ILabeled {
	public static get headInArrow(): number {
		return ArrowObject.arrowRadius / (ArrowObject.headRadius / ArrowObject.headLength);
	}
	public static get difference(): number {
		return ArrowObject.headLength - TorqueObject.headInArrow;
	}

	public get x(): number {
		return this.Vector.x;
	}
	public set x(value: number) {
		this.Vector.x = value;
		this.updateVectors();
	}
	public get y(): number {
		return this.Vector.y;
	}
	public set y(value: number) {
		this.Vector.y = value;
		this.updateVectors();
	}
	public get z(): number {
		return this.Vector.z;
	}
	public set z(value: number) {
		this.Vector.z = value;
		this.updateVectors();
	}

	public get tails(): boolean {
		return this.Vector.tails;
	}
	public set tails(value: boolean) {
		this.Vector.tails = value;
		this.updateVectors();
	}

	public get shouldShowSegments(): boolean {
		return this.Vector.shouldShowSegments;
	}
	public set shouldShowSegments(value: boolean) {
		this.Vector.shouldShowSegments = value;
		this.updateVectors();
	}

	public get label(): string {
		return this.Vector.label;
	}
	public set label(value: string) {
		this.Vector.label = value;
	}
	public get isLabelVisible(): boolean {
		return this.Vector.isLabelVisible;
	}
	public set isLabelVisible(value: boolean) {
		this.Vector.isLabelVisible = value;
	}

	protected readonly Vector: VectorObject;
	protected readonly xVector: ArrowObject;
	protected readonly yVector: ArrowObject;
	protected readonly zVector: ArrowObject;
	protected readonly aVector: ArrowObject;

	public constructor(vector: Vector3, baseMaterial?: Material, label?: string) {
		super();

		this.Vector = new VectorObject(vector, baseMaterial, label);
		this.add(this.Vector);

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
		this.xVector.length = this.Vector.x - TorqueObject.difference * (this.Vector.x / Math.abs(this.Vector.x));
		this.xVector.position.z = this.tails ? this.Vector.z : 0.0;
		this.xVector.rotation.z = -Math.PI / 2.0;
		this.xVector.visible = this.shouldShowSegments;

		this.yVector.length = this.Vector.y - TorqueObject.difference * (this.Vector.y / Math.abs(this.Vector.y));
		this.yVector.position.x = this.tails ? this.Vector.x : 0.0;
		this.yVector.position.z = this.tails ? this.Vector.z : 0.0;
		this.yVector.visible = this.shouldShowSegments;

		this.zVector.length = this.Vector.z - TorqueObject.difference * (this.Vector.z / Math.abs(this.Vector.z));
		this.zVector.rotation.x = Math.PI / 2.0;
		this.zVector.visible = this.shouldShowSegments;

		const v = new Vector3(this.Vector.x, this.Vector.y, this.Vector.z);
		this.aVector.length = v.length() - TorqueObject.difference;
		this.aVector.lookAt(this.position.clone().add(v));
		this.aVector.rotateOnAxis(new Vector3(1.0, 0.0, 0.0), Math.PI / 2);
	}
}